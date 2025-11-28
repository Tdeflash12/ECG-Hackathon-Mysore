# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## MyCardio (Project Overview)

MyCardio is a lightweight dashboard (React + Vite) for reading Arduino heart sensor data and evaluating it with a model.

### Demo features for your hackathon presentation

- Request a demo — a modal pops up for quick demo scheduling.
- Live Preview — animated ECG-like chart with BPM readout and edge mode toggle.
- Simulate Cases — built-in card that simulates series of heart BPMs so you can demo edge cases.
- Model Library — example model formats listed for quick swap-in to show real inference.
- Downloadable sample data (CSV) and an example Arduino serial snippet to feed the dashboard.

### Chatbot (Demo Assistant)

The demo includes a local InfoChatbot (floating button at the bottom-right). It has a built-in knowledge base for common questions (how to connect Arduino, how to simulate cases, supported model formats, privacy/edge mode). Clicking the Chat button opens a small assistant UI that responds to simple text queries.

### Chatbot problem analysis & safety

The chatbot can also analyze simple symptom descriptions and numeric readings (e.g., "I measured 150 bpm" or "I have chest pain"). It provides high-level, educational guidance and recommended next steps (e.g., "See a clinician" or "Call emergency services") but is not a medical device and does not provide a diagnosis. The assistant cites trusted sources when available (e.g., Heart.org, CDC).

Examples:

- "I measured 150 bpm" → the assistant classifies the BPM and suggests next steps (e.g., seek immediate medical attention if high and symptomatic).
- "My heart is fluttering and dizzy" → the assistant describes possible arrhythmia concerns and recommends clinical evaluation. 



### Quick checklist to demo

1. Start the dev server and open the app: `npm run dev`.
2. Visit About -> demo to show Live Preview and the 'Simulate' button.
3. Use the Contact page to 'Download sample data' and try 'Schedule demo' in the aside.
4. Optionally connect your Arduino and send a line per reading (BPM). For demos, use the simulator to show problematic cases.

Demo script (quick):

- Start: `npm run dev`
- Show Dashboard and LivePreview.
- On About, press 'Simulate' to show a range of BPMs and the app's UI reactions.
- Open the chat and ask the assistant "I measured 150 bpm" to show educational analysis.

