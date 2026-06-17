# QuizMe

**Allenati con quiz a risposta multipla.** Zero backend, tutto nel browser.

Importa i tuoi dataset JSON, organizza le domande in mazzi personalizzati, esercitati con diverse modalità e monitora i progressi nel tempo. I dati restano sul tuo dispositivo tramite IndexedDB.

---

## Funzionalità

- **Importa domande** — carica file JSON (anche backup), incolla testo, con validazione automatica
- **Mazzi nominati** — organizza le domande in deck, importa backup con struttura completa
- **4 modalità di quiz:**
  - *Standard* — tutte le domande in ordine casuale
  - *Solo errori* — solo le domande sbagliate in passato
  - *Punti deboli* — priorità alle domande con più errori
  - *Numero fisso* — 10, 20 o 50 domande
- **Timer** integrato con feedback visivo
- **Statistiche globali** — accuracy, media punteggi, best score, tempo medio
- **Top 10 domande più sbagliate** — tabella con successo percentuale
- **Dashboard HTML** esportabile con report completo (anche in dark mode)
- **Backup JSON** scaricabile e reimportabile in qualsiasi momento
- **Tema chiaro/scuro/auto** con toggle manuale e preferenza di sistema
- **Navigazione completa da tastiera** — `1-9` rispondi, `Enter` avanti, `R` restart
- **Accessibilità** — ARIA, focus visibile, skip link, screen reader
- **Persistenza** — IndexedDB (Dexie) per deck e statistiche, localStorage per il tema

---

## Stack

| Strato | Tecnologia |
|---|---|
| Build | [Vite 8](https://vite.dev) |
| UI | [React 19](https://react.dev), [TypeScript 6](https://www.typescriptlang.org) |
| Stili | [Tailwind CSS 4](https://tailwindcss.com) (plugin Vite, zero config file) |
| Database | [Dexie 4](https://dexie.org) su IndexedDB |
| Persistenza minima | localStorage (solo tema) |

---

## Primi passi

```bash
git clone https://github.com/0xPwn3z/quiz-me.git
cd quiz-me

npm install
npm run dev
```

Apri `http://localhost:5173/quiz-me/`.

---

## Comandi

| Comando | Cosa fa |
|---|---|
| `npm run dev` | Avvia il dev server su `localhost:5173` |
| `npm run build` | Typecheck + bundle produzione → `dist/` |
| `npm run preview` | Serve `dist/` localmente per test |
| `npm run lint` | ESLint su tutta la codebase |

---

## Struttura del progetto

```
quiz-me/
├── index.html                    # entry Vite
├── vite.config.ts                # plugin + base /quiz-me/
├── tsconfig.app.json             # TS strict
├── .github/workflows/deploy.yml  # CI → GitHub Pages
├── public/data/questions.json    # dataset d'esempio
├── src/
│   ├── main.tsx                  # React root
│   ├── App.tsx                   # state machine a 5 schermate
│   ├── index.css                 # @import "tailwindcss" + theme
│   ├── types/index.ts            # tutti i tipi condivisi
│   ├── db/database.ts            # schema Dexie (3 tabelle)
│   ├── services/
│   │   ├── quizEngine.ts         # logica pura (shuffle, prepare, select)
│   │   ├── importParser.ts       # validazione JSON
│   │   ├── htmlExport.ts         # generazione report HTML
│   │   └── storage.ts            # localStorage adapter
│   ├── hooks/                    # useQuiz, useDecks, useStats, useTheme, useTimer
│   ├── context/AppContext.tsx     # tema + navigazione
│   └── components/
│       ├── ui/                   # Card, Button, RadioCard, ProgressBar…
│       ├── layout/               # AppShell, SkipLink, ThemeToggle
│       ├── home/                 # HomeScreen + selettori
│       ├── quiz/                 # QuizScreen + QuestionCard + timer
│       ├── results/              # ResultsScreen
│       ├── stats/                # StatsScreen + top 10
│       └── data/                 # Import, Export, DeckManager, Reset
```

---

## Architettura

- **Nessun router** — `App.tsx` usa uno `useState<Screen>` per navigare tra le 5 viste (home, quiz, results, stats, data)
- **Quiz engine puro** — `services/quizEngine.ts` è TypeScript puro, zero dipendenze React. Fisher–Yates O(n) per shufflare anche 10.000+ domande.
- **Stato condiviso** — `useQuiz()` vive in `App.tsx` e viene passato come prop a `QuizScreen`. Ogni istanza separata rompe il flusso.
- **Live queries** — `useLiveQuery` di Dexie osserva i dati in real time. **Scritture solo fuori dalla live query** (in `useCallback` o `useEffect`), altrimenti `ReadOnlyError`.
- **Modalità errori/weak** — aggiornano le statistiche per singola domanda ma non toccano i globali (accuracy, media punteggi).

---

## Import / Export

### Importare un mazzo
1. Vai su **Dati** → **Importa un mazzo**
2. Inserisci un nome, carica un file JSON o incolla il testo
3. Clicca **Salva mazzo**

### Formato domande
```json
[
  { "id": "q0001", "q": "Domanda?", "c": ["A", "B", "C", "D"], "a": 0 }
]
```
`a` è l'indice 0–3 della risposta corretta in `c`.

### Backup
- **Scarica backup.json** → esporta mazzi + progressi + impostazioni
- **Reimporta backup.json** → drag & drop e "Salva mazzo": ripristina deck, statistiche e tema

### Report progressi
**Scarica progress.html** → dashboard HTML autonoma con summary, statistiche per mazzo, top 10 errori e tabella completa.

---

## Deploy

Il repository `quiz-me` è configurato per GitHub Pages tramite GitHub Actions.

1. Push su `main`
2. Il workflow `.github/workflows/deploy.yml` esegue `npm ci && npm run build`
3. `dist/` viene deployato automaticamente

**Attenzione:** `vite.config.ts` ha `base: "/quiz-me/"` — deve corrispondere al nome del repository.

---

## Licenza

MIT
