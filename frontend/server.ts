/**
 * Copilot Runtime for this harness.
 *
 * Verbatim in shape from the Angular quickstart's Node runtime server
 * (https://docs.copilotkit.ai/angular), which registers CopilotKit's own
 * `BuiltInAgent` as the `default` agent. There is no separate agent process:
 * `BuiltInAgent` calls the model provider directly from this file, so the whole
 * stack is two processes — this runtime and `ng serve`.
 *
 * `default` and `support` are two instances of the same agent. `support` exists
 * so the doc snippets that use `agentId="support"` (Chat UI, Threads) run
 * verbatim.
 *
 * `a2ui: {}` enables A2UIMiddleware for every registered agent, per
 * https://docs.copilotkit.ai/angular/guides/a2ui
 */
import { createServer } from 'node:http';
import { BuiltInAgent, CopilotRuntime, defineTool } from '@copilotkit/runtime/v2';
import { createCopilotNodeListener } from '@copilotkit/runtime/v2/node';
import { z } from 'zod';

// The quickstart's model string. `BuiltInAgent` resolves "provider:model" (or
// "provider/model") against @ai-sdk, and reads the matching provider key from
// the environment — OPENAI_API_KEY here, ANTHROPIC_API_KEY or GOOGLE_API_KEY if
// you point MODEL at one of those providers instead.
const model = process.env['COPILOTKIT_MODEL'] ?? 'openai:gpt-5-mini';

const prompt = 'You are a helpful assistant for an Angular app.';

/**
 * The one server-side tool this harness needs.
 *
 * https://docs.copilotkit.ai/angular/guides/frontend-tools-generative-ui splits
 * tools in two: `registerFrontendTool` runs in the browser and needs nothing
 * here, but `registerRenderToolCall` only *renders* a tool the agent owns — so
 * `getWeather` has to exist on this side or the guide's renderer never fires.
 *
 * The name and the `city` argument are fixed by the guide's snippet:
 * `registerRenderToolCall({ name: 'getWeather', args: z.object({ city }) })`
 * matches by exact string, and a mismatch fails silently — the agent answers in
 * plain text where the card should be.
 *
 * The reading is invented. Nothing here calls a weather service; the point is
 * the render path, not the data.
 */
const getWeather = defineTool({
  name: 'getWeather',
  description: 'Get the current weather for a city',
  parameters: z.object({ city: z.string() }),
  execute: async ({ city }) => ({
    city,
    temperature: 22,
    conditions: 'Partly cloudy',
    humidity: 58,
    windSpeed: 12,
  }),
});

/**
 * `maxSteps` is the one option this harness adds to the quickstart's model and
 * prompt. It defaults to 1, which ends the run as soon as the model emits a
 * tool call — the frontend-tools, human-in-the-loop, and shared-state routes
 * all need the model to keep going once the tool result comes back, so they
 * need more than one step to finish a turn.
 */
const agent = () => new BuiltInAgent({ model, prompt, maxSteps: 10, tools: [getWeather] });

const runtime = new CopilotRuntime({
  agents: {
    default: agent(),
    support: agent(),
  },
  a2ui: {},
});

const port = Number(process.env['PORT'] ?? 8200);

createServer(
  createCopilotNodeListener({
    runtime,
    basePath: '/api/copilotkit',
    cors: true,
  }),
).listen(port, () => {
  console.log(`Copilot Runtime listening at http://localhost:${port}/api/copilotkit`);
  console.log(`Built-in agent model: ${model}`);
  if (!process.env['OPENAI_API_KEY'] && model.startsWith('openai')) {
    console.warn('OPENAI_API_KEY is not set — the agent will fail on the first message.');
  }
});
