# AI Sphere

An interactive 3D map of the top AI influencers — explore who they are, what they do, what they think, and how they're connected.

## 🌐 Live Site

**[wendylzh6.github.io/AI_Sphere](https://wendylzh6.github.io/AI_Sphere/)** — full 3D React app (auto-deployed from `main` via GitHub Actions).

Lightweight 2D D3 preview also available at
[`/preview.html`](https://wendylzh6.github.io/AI_Sphere/preview.html).

---

## 💡 Why I Built This

There are millions of pieces of AI news and information generated every second on X and LinkedIn — and for new users, it can get really overwhelming. To figure out which accounts were actually worth following, and to visualize what the AI community on X and LinkedIn actually looks like, I built this 3D interactive platform. It's a tool for anyone trying to navigate the AI space and find their footing in it.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| 3D visualization | Three.js + react-force-graph-3d |
| AI (network expansion) | Google Gemini API |
| Styling | Tailwind CSS (CDN) |
| Icons | Lucide React |
| Analytics | Vercel Analytics |
| Data pipeline | Node.js + RapidAPI (X/Twitter) |

---

## 🧩 Details Panel (per-influencer)

Selecting any node in the graph pops open a 4-row details panel. Every
row is also available in the GitHub Pages preview (`preview.html`) so
the two experiences stay in sync.

| Row | Component | What it shows |
|---|---|---|
| 1 | `components/ProfileCards.tsx` | X (Twitter) snapshot + LinkedIn snapshot side-by-side (avatar, bio, followers / connections, Follow / View buttons). LinkedIn avatars are fetched via `unavatar.io/linkedin/{slug}` with a chained fallback to the X avatar, then an initials placeholder. |
| 2 | `components/CareerMobility.tsx` | Horizontal career timeline (oldest → newest) sourced from `data/profileExtras.ts#careerHistory`. |
| 3 | `components/SentimentEvolutionChart.tsx` alongside the Gemini-inferred sentiment bars | 4-line SVG chart tracking curated sentiment scores (Regulation / Usage / Trust / Agents) across each career stage. |
| 4 | `components/TopicChips.tsx` | The influencer's AI focus areas, pulled from `bioTags` in `constants.ts`. |

The curated LinkedIn URLs, LinkedIn extras (connections + location),
career history, and per-stage sentiment data all live in
[`data/profileExtras.ts`](./data/profileExtras.ts) and are keyed by the
same influencer `id` used in `constants.ts`. Profiles that don't have
curated data simply render fewer rows (the panel is defensive against
missing keys).

### 51-Person Shortlist

The default React experience renders a hand-curated 51-person shortlist
so it matches `preview.html` exactly. The full 300-node crawl is still
available as `ALL_INITIAL_DATA` in
[`constants.ts`](./constants.ts); swap the `INITIAL_DATA` export (or
change which ids are in `PREVIEW_INFLUENCER_IDS`) to opt into the
larger graph.

---

## 🤖 In-App AI Assistant

AI Sphere ships with a floating Gemini-powered chatbot ("Tauhid D. Luffy")
in the bottom-right corner (just below the Legend). It has been pre-briefed
on the app's layout, features, and methodology, so users can ask things
like:

- "What do the node colors mean?"
- "How is the sentiment analysis computed?"
- "How do I filter by researchers only?"

The component lives in `components/AIChatbot.tsx` and reads the same
`GEMINI_API_KEY` env var that the sentiment analyzer uses.

On the static GitHub Pages preview (`preview.html`) the chatbot uses
Gemini's REST API directly and prompts each visitor for their own
Gemini API key, which is stored only in their browser's `localStorage`
(no secrets are committed to the repo).

---

## 🚀 Run Locally

**Prerequisites:** Node.js

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local` and paste your Gemini API key
   (get one at https://aistudio.google.com/app/apikey).
3. Run the React app: `npm run dev`
   (or `npm run dev:preview` to open the static `preview.html` instead).

Additional scripts:

| Script | What it does |
|---|---|
| `npm run dev` | Start Vite dev server on the React app (`index.html`). |
| `npm run dev:preview` | Same dev server, but opens the `preview.html` prototype. |
| `npm run build` | Production build to `dist/`. |
| `npm run typecheck` | Run `tsc --noEmit`. |
| `npm run fetch-influencers` | Refresh X profile data via RapidAPI. |
