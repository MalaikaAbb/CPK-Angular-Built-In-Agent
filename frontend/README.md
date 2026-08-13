# CopilotKit + Angular — built-in agent harness

A navigable test harness for the Angular section of the CopilotKit docs, running
against CopilotKit's own **built-in agent**. Every guide in the sidebar is a
route, and each route runs the thing its doc page teaches rather than restating
it.

Docs this harness tracks:

| Route                           | Doc page                                                                  |
| ------------------------------- | ------------------------------------------------------------------------- |
| `/` and `/quickstart`           | https://docs.copilotkit.ai/angular                                        |
| `/chat-ui`                      | https://docs.copilotkit.ai/angular/guides/chat-ui                         |
| `/frontend-tools-generative-ui` | https://docs.copilotkit.ai/angular/guides/frontend-tools-generative-ui    |
| `/a2ui`                         | https://docs.copilotkit.ai/angular/guides/a2ui                            |
| `/voice-multimodal`             | https://docs.copilotkit.ai/angular/guides/voice-multimodal                |
| `/human-in-the-loop`            | https://docs.copilotkit.ai/angular/guides/human-in-the-loop               |
| `/shared-state`                 | https://docs.copilotkit.ai/angular/guides/shared-state                    |
| `/threads`, `/memory`, `/attachments`, `/headless` | https://docs.copilotkit.ai/angular/guides/threads-memory-attachments-headless |

`/status` in the app shows the same table with each route's current
implementation status.

## Architecture

```
Browser (Angular 22, zoneless)
  |  @copilotkit/angular — provideCopilotKit, copilot-chat, signal APIs
  |  POST http://localhost:8200/api/copilotkit
  v
Copilot Runtime  ·  localhost:8200        <- Node, frontend/server.ts
  |  agents: { default, support } -> new BuiltInAgent({ model, prompt })
  |  OPENAI_API_KEY from this process's environment
  v
Model  (openai:gpt-5-mini)
```

Two processes: the Copilot Runtime and `ng serve`. There is no agent process to
run — `BuiltInAgent` **is** the agent, and it calls the model provider from
inside the runtime. Angular still needs the runtime as its own Node process,
unlike the React quickstart where it lives inside a Next route, because the
browser must never hold the model key.

## Prerequisites

- Node `^22.22.3 || ^24.15.0 || >=26.0.0` (the Angular 22 engine range)
- An OpenAI API key — https://platform.openai.com/api-keys

## Start the project

**1. Install dependencies**

```bash
npm install
```

**2. Export your model key**

```bash
export OPENAI_API_KEY=sk-...
```

This is read by the runtime process only. If it is missing, the runtime still
starts and logs a warning, and the first chat message fails.

**3. Start both processes**

```bash
npm run dev
```

That runs the Copilot Runtime and `ng serve` together under `concurrently`,
with prefixed output, and kills both if either exits.

Open **http://localhost:4200**. The Introduction route runs a live connection
check against the runtime, so if the chat is not streaming, look there first.

### Or start them in two terminals

```bash
# Terminal 1 — Copilot Runtime on :8200
export OPENAI_API_KEY=sk-...
npm run runtime

# Terminal 2 — Angular dev server on :4200
npm start
```

### Verify the runtime by itself

```bash
curl -s http://localhost:8200/api/copilotkit/info
```

It should report both agents bound to `BuiltInAgent`:

```json
{
  "agents": {
    "default": { "name": "default", "className": "BuiltInAgent", "...": "..." },
    "support": { "name": "support", "className": "BuiltInAgent", "...": "..." }
  },
  "a2uiEnabled": true
}
```

`support` is a second identical agent, registered so the doc snippets that use
`agentId="support"` (Chat UI, Threads) run verbatim.

## Configuration

| Variable            | Default                  | Purpose                                                       |
| ------------------- | ------------------------ | ------------------------------------------------------------- |
| `OPENAI_API_KEY`    | —                        | Read by `BuiltInAgent`. Required for any chat to work.        |
| `COPILOTKIT_MODEL`  | `openai:gpt-5-mini`      | Any `provider:model` @ai-sdk understands.                     |
| `PORT`              | `8200`                   | Runtime port. Change it and update `runtimeUrl` in `src/app/app.config.ts`. |

Switching provider means switching the key too — `anthropic:claude-sonnet-4.5`
reads `ANTHROPIC_API_KEY`, `google:gemini-2.5-flash` reads `GOOGLE_API_KEY`.

## Scripts

| Script                | What it does                                                    |
| --------------------- | --------------------------------------------------------------- |
| `npm run dev`         | Runtime + `ng serve` together. The normal way to run this.       |
| `npm run runtime`     | Copilot Runtime alone (`tsx server.ts`).                         |
| `npm start`           | Angular dev server alone.                                        |
| `npm run build`       | Production build into `dist/`.                                   |
| `npm test`            | Vitest.                                                          |
| `npm run gen:sources` | Re-snapshot the source files the doc routes display. Runs automatically before `start` and `build`. |

## How the code is laid out

| Path                          | What lives there                                                     |
| ----------------------------- | -------------------------------------------------------------------- |
| `server.ts`                   | The whole backend: `CopilotRuntime` + `BuiltInAgent` + one server tool. |
| `src/app/app.config.ts`       | `provideCopilotKit` — `runtimeUrl`, A2UI recovery, sandbox functions.  |
| `src/app/lib/nav-config.ts`   | One entry per route: doc path, summary, status. The nav, route headers, and `/status` all read from it. |
| `src/app/features/<topic>/`   | The doc snippets themselves, as close to verbatim as they compile.     |
| `src/app/pages/<topic>.ts`    | The notes, pass/fail criteria, and rendered source for one doc page.   |
| `scripts/generate-sources.ts` | Reads the feature files off disk at build time, so the source shown on a page is the source that runs. |

Routes with a live feature are split in two: `/<topic>` holds the explanation,
and `/<topic>/demo` holds the running feature with no page chrome, so it can be
screen-recorded on its own.

## Server-side tools

The frontend-tools guide splits tools in two. `registerFrontendTool` runs in the
browser and needs nothing on the server. `registerRenderToolCall` only *renders*
a tool the agent owns — so `getWeather` is declared in `server.ts` with
`defineTool`, matching the guide's `name: 'getWeather'` and `city` argument
exactly. A name mismatch fails silently: the agent still answers, you just get
plain text where the card should be.

`server.ts` also sets `maxSteps: 10`. `BuiltInAgent` defaults to `1`, which ends
the run the moment the model emits a tool call — the frontend-tools,
human-in-the-loop, and shared-state routes all need the model to keep going once
the tool result comes back.

## Known limitations

These are expected results, not bugs in this harness:

- **A2UI is inert.** `/info` reports `a2uiEnabled: true` because the runtime
  enables A2UIMiddleware, but supplying `a2ui.catalog` to `provideCopilotKit` is
  what actually registers the `render_a2ui` renderer, and the guide's catalog
  snippet is not self-contained. `app.config.ts` sets `a2ui.recovery` only.
- **Voice transcription fails by design.** The microphone renders and records,
  but this runtime configures no `transcriptionService`, so `/info` reports
  `audioFileTranscriptionEnabled: false`.
- **Threads and memory are premium.** Those endpoints come from the CopilotKit
  Enterprise Intelligence Platform. Unlicensed, the thread list stays empty, the
  drawer renders its locked state, and `injectMemories().isAvailable()` is false
  — which is exactly what the guide's fallback path is for.
- **The interrupt panel stays idle.** `BuiltInAgent` emits an AG-UI interrupt
  only for a server tool declared with `interrupt: true`, and none is declared
  here — the human-in-the-loop guide is frontend-only. The
  `registerHumanInTheLoop` half of that route is fully live.
