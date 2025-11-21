# Puppeteer CDP Monitor

Minimal React + Node proof of concept that triggers a Puppeteer script via Chrome DevTools Protocol (CDP). The frontend exposes a single button; when clicked it calls the backend (`/run-cdp`), which launches Chromium, connects a CDP session and types into the ACE editor demo.

## Project Structure

- `src/` – Vite + React UI (`PuppeteerCDPMonitor.jsx`) that fetches the backend response and renders the returned JSON.
- `server/` – Express server with one route (`GET /run-cdp`) that runs the Puppeteer automation with CDP session logging.

## Prerequisites

- Node.js 18+ (tested with 24.x)
- A Chromium-compatible browser that Puppeteer can download/launch
- Linux users without the Chrome SUID sandbox can still run using the built-in `--no-sandbox --disable-setuid-sandbox` flags already configured.

## Installation

```bash
# frontend
cd /home/nxtwave/Documents/NxtWave/Puppeteer-CDP
npm install

# backend
cd /home/nxtwave/Documents/NxtWave/Puppeteer-CDP/server
npm install
```

## Running the Apps

Backend (port `4000`):

```bash
cd /home/nxtwave/Documents/NxtWave/Puppeteer-CDP/server
npm start
```

Frontend (Vite dev server on `5173`):

```bash
cd /home/nxtwave/Documents/NxtWave/Puppeteer-CDP
npm run dev
```

Open `http://localhost:5173`, click **Run CDP Script**, and watch the backend logs plus the JSON response in the UI. The backend launches Chromium non-headless by default so you can observe the CDP actions.

## API Reference

`GET http://localhost:4000/run-cdp`

- Launches Chromium with Puppeteer
- Enables `DOM`, `Page`, and `Runtime` domains
- Navigates to the ACE kitchen-sink demo, waits ~5 seconds, clicks the editor, and injects text via `Input.insertText`
- Responds with:
  - `message`: status string
  - `eventsCount`: total CDP events captured during the run
  - `exampleEvents`: first 10 logged events

You can invoke it manually with curl:

```bash
curl 'http://localhost:4000/run-cdp'
```

Feel free to include any custom headers from the browser request (Origin, Referer, etc.)—CORS is configured to allow `*`.

## Troubleshooting

- **Failed to fetch in the UI** – ensure both frontend (`5173`) and backend (`4000`) servers are running.
- **Puppeteer sandbox errors** – already mitigated with `--no-sandbox --disable-setuid-sandbox`, but you can install Chrome’s SUID helpers for a hardened setup.
- **ProtocolError (Input.enable)** – the Input domain does not require explicit enabling; the current backend code already omits that call.
- **`waitForTimeout` missing** – some Puppeteer versions drop this helper; the code now uses `setTimeout` instead.

## Next Steps

- Adjust the target URL or injected text in `server/server.js`.
- Stream CDP event logs back to the frontend instead of returning only the first 10.
- Enable headless mode for CI environments by setting `headless: "new"` or `true`.

