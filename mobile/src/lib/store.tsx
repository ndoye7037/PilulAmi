import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { rescheduleAll } from './notifications';
import { computeDay, dayKey, logKey, uid } from './schedule';
import type { DoseLogs, Medication, Settings } from './types';

const STORAGE_KEY = 'pilulami:v1';

export const DEFAULT_SETTINGS: Settings = {
  onboarded: false,
  seniorName: 'Maman',
  aidantName: '',
  graceMinutes: 30,
  mode: null,
};

type Data = { meds: Medication[]; logs: DoseLogs; settings: Settings };

type Store = Data & {
  loaded: boolean;
  now: Date;
  saveMed: (med: Omit<Medication, 'id'> & { id?: string }) => void;
  addMeds: (meds: Omit<Medication, 'id'>[]) => void;
  deleteMed: (id: string) => void;
  confirmSlot: (time: string) => void;
  undoSlot: (time: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  loadExample: () => void;
  resetAll: () => void;
};

const StoreContext = createContext<Store | null>(null);

export const EXAMPLE_MEDS: Omit<Medication, 'id'>[] = [
  { name: 'Kardégic 75 mg', dosage: '1 sachet', times: ['08:00'], instructions: 'Au petit-déjeuner' },
  { name: 'Metformine 500 mg', dosage: '1 comprimé', times: ['08:00', '19:30'], instructions: 'Pendant le repas' },
  { name: 'Amlodipine 5 mg', dosage: '1 comprimé', times: ['12:30'] },
  { name: 'Atorvastatine 20 mg', dosage: '1 comprimé', times: ['19:30'] },
];

/** Historique fictif des 6 derniers jours, pour que la démo ne soit pas vide. */
function exampleLogs(meds: Medication[]): DoseLogs {
  const logs: DoseLogs = {};
  const now = new Date();
  for (let i = 6; i >= 1; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const day = dayKey(d);
    for (const med of meds) {
      for (const time of med.times) {
        if (i === 3 && time === '19:30') continue; // un oubli, pour l'exemple
        const t = new Date(d);
        const [h, m] = time.split(':').map(Number);
        t.setHours(h, m + Math.floor(Math.random() * 20), 0, 0);
        logs[logKey(day, med.id, time)] = t.toISOString();
      }
    }
  }
  return logs;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Data>({ meds: [], logs: {}, settings: DEFAULT_SETTINGS });
  const [loaded, setLoaded] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const firstSave = useRef(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<Data>;
          setData({
            meds: parsed.meds ?? [],
            logs: parsed.logs ?? {},
            settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  // Horloge partagée : rafraîchit les statuts (à venir → en retard → oublié)
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (firstSave.current) {
      firstSave.current = false;
    } else {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch(() => {});
    }
    rescheduleAll(data.meds, data.logs, data.settings);
  }, [data, loaded]);

  const saveMed = useCallback<Store['saveMed']>((med) => {
    setData((d) => {
      if (med.id) {
        return { ...d, meds: d.meds.map((m) => (m.id === med.id ? { ...m, ...med, id: m.id } : m)) };
      }
      return { ...d, meds: [...d.meds, { ...med, id: uid() }] };
    });
  }, []);

  const addMeds = useCallback<Store['addMeds']>((meds) => {
    setData((d) => ({ ...d, meds: [...d.meds, ...meds.map((m) => ({ ...m, id: uid() }))] }));
  }, []);

  const deleteMed = useCallback((id: string) => {
    setData((d) => ({ ...d, meds: d.meds.filter((m) => m.id !== id) }));
  }, []);

  const confirmSlot = useCallback((time: string) => {
    setData((d) => {
      const day = dayKey();
      const at = new Date().toISOString();
      const logs = { ...d.logs };
      for (const med of d.meds) {
        if (!med.times.includes(time)) continue;
        const key = logKey(day, med.id, time);
        if (!logs[key]) logs[key] = at; // jamais deux fois la même prise
      }
      return { ...d, logs };
    });
  }, []);

  const undoSlot = useCallback((time: string) => {
    setData((d) => {
      const day = dayKey();
      const logs = { ...d.logs };
      for (const med of d.meds) delete logs[logKey(day, med.id, time)];
      return { ...d, logs };
    });
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setData((d) => ({ ...d, settings: { ...d.settings, ...patch } }));
  }, []);

  const loadExample = useCallback(() => {
    setData((d) => {
      const meds = EXAMPLE_MEDS.map((m) => ({ ...m, id: uid() }));
      return { ...d, meds, logs: exampleLogs(meds) };
    });
  }, []);

  const resetAll = useCallback(() => {
    setData({ meds: [], logs: {}, settings: DEFAULT_SETTINGS });
  }, []);

  const value = useMemo<Store>(
    () => ({
      ...data,
      loaded,
      now,
      saveMed,
      addMeds,
      deleteMed,
      confirmSlot,
      undoSlot,
      updateSettings,
      loadExample,
      resetAll,
    }),
    [data, loaded, now, saveMed, addMeds, deleteMed, confirmSlot, undoSlot, updateSettings, loadExample, resetAll],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore doit être utilisé dans <StoreProvider>');
  return ctx;
}

export function useToday() {
  const { meds, logs, now, settings } = useStore();
  return useMemo(
    () => computeDay(meds, logs, now, settings.graceMinutes),
    [meds, logs, now, settings.graceMinutes],
  );
}
