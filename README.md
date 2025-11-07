# AI Stock Prediction — Minimal Backend Example

This project demonstrates a minimal server that fetches stock aggregates from Polygon and forwards them to OpenAI to generate a short report.

Files added for the backend:
- `server.js` — Express server with `POST /report` endpoint
- `package.json` — minimal dependencies and start script
- `.env.example` — example environment variables

Quick start (Windows PowerShell):

1. Copy the example env and fill your keys:

```powershell
cp .env.example .env
# edit .env in a text editor and put your real keys
```

2. Install dependencies and run the server:

```powershell
npm install
npm start
```

3. In the frontend (Live Server), add tickers then click "Generate Report" — the frontend will POST to `http://localhost:3000/report` and display the returned report.

Notes
- Keep your API keys secret — don't commit `.env` to source control.
- This is a minimal example. For production, add rate limiting, request validation, better error handling, and secrets management.

Environment & security
----------------------
- Keep secrets (API keys) out of your repository. This project uses a `.env` file for local configuration which should never be committed.
- The repository includes a `.env.example` file that documents which environment variables are required. Copy it to `.env` and fill in your values:

```powershell
cp .env.example .env
notepad .env
# then paste or edit keys in the file
```

- Add `.env` to `.gitignore` (this repo includes one). If you accidentally committed `.env`, remove it from git with:

```powershell
git rm --cached .env
git commit -m "Remove .env from repo"
git push
```

Mock mode (develop without real API keys)
----------------------------------------
If you don't want to use real API keys while developing, you can run the server in MOCK mode which returns a synthetic report. Edit your `.env` and set:

```
MOCK=true
PORT=3000
```

Then run the usual install/start commands:

```powershell
npm install
npm start
```

Open the frontend (`index.html`) with Live Server or directly in the browser. Add tickers and click "Generate Report" — the server will return a mock report so you can test the full UI flow without Polygon/OpenAI keys.

How to run (quick recap)
------------------------
1. Copy `.env.example` to `.env` and edit it (or set `MOCK=true`).
2. Install dependencies and start the server:

```powershell
npm install
npm start
```

3. Open `index.html` using Live Server in VS Code or by opening the file in your browser.

If you need help setting up keys or want me to add a small `start-dev.ps1` script to automate these steps, tell me and I will add it.
