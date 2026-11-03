export function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[280px]">
      <div className="absolute -left-16 top-16 hidden w-48 rounded-2xl border border-line bg-cream p-4 shadow-lg sm:block">
        <p className="text-xs font-bold uppercase tracking-wide text-terracotta">
          Alerte aidant
        </p>
        <p className="mt-1 text-sm text-ink-muted">
          La prise de 12h30 n’a pas été confirmée. Maman n’a pas encore appuyé sur le bouton.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-[2.4rem] border-[10px] border-[#1c2a26] bg-[#f4faf7] shadow-2xl">
        <div className="mx-auto mt-2 h-5 w-24 rounded-full bg-[#1c2a26]" />
        <div className="px-5 pb-8 pt-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-sage">
            PilulAmi
          </p>
          <p className="mt-4 font-serif text-2xl leading-tight text-foreground">
            8h30 — votre prise
          </p>
          <div className="mt-5 rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm text-ink-muted">Ce matin</p>
            <p className="mt-1 text-lg font-bold">Doliprane 1000 mg</p>
            <p className="text-sm text-ink-muted">1 comprimé, avec un verre d’eau</p>
          </div>
          <button
            type="button"
            tabIndex={-1}
            className="mt-6 w-full rounded-2xl bg-sage py-5 text-lg font-bold text-white shadow-md"
          >
            J’ai pris mon médicament
          </button>
          <p className="mt-4 text-center text-sm text-ink-muted">
            Sophie verra que c’est fait.
          </p>
        </div>
      </div>

      <div className="absolute -right-10 bottom-10 hidden w-40 rounded-2xl border border-line bg-white p-3 shadow-lg sm:block">
        <p className="text-xs font-bold text-sage">Aujourd’hui</p>
        <p className="mt-2 text-sm">✓ 8h30 prise confirmée</p>
        <p className="text-sm text-ink-muted">12h30 en attente</p>
        <p className="text-sm text-ink-muted">20h00 à venir</p>
      </div>
    </div>
  );
}
