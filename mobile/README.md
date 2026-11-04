# PilulAmi

Rappels de médicaments pour le senior, alertes en cas d'oubli pour l'aidant.
Application React Native (Expo SDK 58 + Expo Router), réalisée d'après le brief PilulAmi.

## Lancer

```bash
npm install
npx expo start        # puis « i » (iOS), « a » (Android) ou scanner le QR code avec Expo Go
```

## Parcours

| Écran | Rôle |
| --- | --- |
| `src/app/index.tsx` | Accueil : prénoms, puis « Qui utilise ce téléphone ? » |
| `src/app/senior.tsx` | Mode senior : heure en grand, médicaments du moment, **un seul bouton « J'ai pris mon médicament »**. Indique « Déjà pris à 8h05 » pour éviter une double prise. Appui long en bas pour quitter. |
| `src/app/aidant.tsx` | Tableau de bord de l'aidant : bandeau « Tout va bien » ou alerte d'oubli, journée par horaire, observance sur 7 jours, traitement |
| `src/app/scan.tsx` | Photo de l'ordonnance → planning proposé → vérification ligne par ligne → validation |
| `src/app/medicament.tsx` | Ajout / modification manuelle d'un médicament |
| `src/app/reglages.tsx` | Délai avant alerte (15 min à 1h30), notifications, données |

## Ce qui est simulé dans le prototype

- **Lecture de l'ordonnance** : `src/lib/ordonnance.ts` renvoie un exemple. À brancher sur un OCR / modèle de vision hébergé HDS.
- **Un seul appareil** : les données sont stockées localement (AsyncStorage). L'alerte « prise non confirmée » est une notification locale programmée à l'heure + délai, et annulée quand la prise est confirmée. En production, elle partirait d'un serveur vers le téléphone de l'aidant (push), ce qui demande un backend et un build de développement.

## Vérifications

```bash
npx tsc --noEmit
npx expo lint
npx expo-doctor
```
