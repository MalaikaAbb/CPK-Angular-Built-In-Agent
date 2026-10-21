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
import {
  BuiltInAgent,
  CopilotKitIntelligence,
  CopilotRuntime,
  defineTool,
} from '@copilotkit/runtime/v2';
import { createCopilotNodeListener } from '@copilotkit/runtime/v2/node';
import { z } from 'zod';

import * as advancedConfiguration from './agents/advanced-configuration';
import * as mcpServers from './agents/mcp-servers';
import * as modelSelection from './agents/model-selection';
import * as serverTools from './agents/server-tools';

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

// Create the Intelligence client with your project API key. Keep this key on the server.
const intelligence = new CopilotKitIntelligence({
  apiKey: process.env.CPK_INTELLIGENCE_API_KEY!,
});

/**
 * The Intelligence quickstart calls `authenticateApplicationUser` but leaves it
 * to the app. This harness has no login, so it uses the fixed identity the doc
 * allows "only for a local, single-user demo".
 */
async function authenticateApplicationUser(_request: Request) {
  return { id: 'local-user', name: 'Local User' };
}

const runtime = new CopilotRuntime({
  agents: {
    default: agent(),
    support: agent(),
  },
  a2ui: {},
  // Pass the Intelligence client to the runtime
  intelligence,
  // Identify the user from a verified session or token
  identifyUser: async (request) => {
    const user = await authenticateApplicationUser(request);
    if (!user) throw new Error("Unauthorized");
    return { id: user.id, name: user.name };
  },
});

// built-in-agent pages : separate runtime start
/**
 * The Built-in Agent pages (Server Tools, MCP Servers, Model Selection,
 * Advanced Configuration) each show `new BuiltInAgent({...})` and nothing
 * about registering it. Every runnable snippet is registered under its own key
 * so each route's demo can bind a chat to exactly that configuration. The
 * snippets live verbatim in `agents/`.
 *
 * They are served by a second runtime, without Intelligence, at
 * `/api/copilotkit-builtin`. Registered on the Intelligence runtime above, the
 * nineteen extra agents broke chat on every route: the browser timed out
 * joining the run's realtime channel. With only `default` and `support` it
 * does not. The four demo routes point their own `provideCopilotKit` here.
 */
const builtInAgentPages = {
  'server-tools': serverTools.definingATool(),
  'mcp-sse': mcpServers.sseTransport(),
  'mcp-sse-auth': mcpServers.authenticationHeaders(),
  'mcp-http': mcpServers.httpTransport(),
  'mcp-multiple': mcpServers.multipleServers(),
  'mcp-collisions': mcpServers.toolNameCollisions(),
  'mcp-with-server-tools': mcpServers.combiningWithServerTools(),
  'model-openai': modelSelection.openAi(),
  'model-anthropic': modelSelection.anthropic(),
  'model-google': modelSelection.google(),
  'model-api-key': modelSelection.apiKeyInConfiguration(),
  'adv-tool-choice': advancedConfiguration.toolChoice(),
  'adv-system-prompt': advancedConfiguration.systemPrompt(),
  'adv-generation': advancedConfiguration.generationParameters(),
  'adv-openai-reasoning': advancedConfiguration.openAiReasoningEffort(),
  'adv-anthropic-thinking': advancedConfiguration.anthropicAdaptiveThinking(),
  'adv-overridable': advancedConfiguration.overridableProperties(),
  'adv-message-forwarding': advancedConfiguration.messageForwarding(),
};

/**
 * "User-managed MCP clients" connects to the MCP server before the agent
 * exists. If `../mcp-server` is not up yet, only this key is missing — the
 * rest of the runtime keeps serving — and the next request tries again.
 */
let mcpClientsAgent: Promise<BuiltInAgent> | undefined;
async function resolveMcpClientsAgent(): Promise<BuiltInAgent | undefined> {
  mcpClientsAgent ??= mcpServers.userManagedMcpClients();
  try {
    return await mcpClientsAgent;
  } catch (error) {
    mcpClientsAgent = undefined;
    console.error('[mcp-clients] could not connect to the MCP server:', error);
    return undefined;
  }
}

const builtInAgentRuntime = new CopilotRuntime({
  agents: async () => {
    const mcpClients = await resolveMcpClientsAgent();
    return {
      ...builtInAgentPages,
      ...(mcpClients ? { 'mcp-clients': mcpClients } : {}),
    };
  },
});

const builtInAgentListener = createCopilotNodeListener({
  runtime: builtInAgentRuntime,
  basePath: '/api/copilotkit-builtin',
  cors: true,
});
// built-in-agent pages : separate runtime end

const port = Number(process.env['PORT'] ?? 8200);

const listener = createCopilotNodeListener({
  runtime,
  basePath: '/api/copilotkit',
  cors: true,
});

createServer((req, res) =>
  req.url?.startsWith('/api/copilotkit-builtin')
    ? builtInAgentListener(req, res)
    : listener(req, res),
).listen(port, () => {
  console.log(`Copilot Runtime listening at http://localhost:${port}/api/copilotkit`);
  console.log(`Built-in Agent pages runtime at http://localhost:${port}/api/copilotkit-builtin`);
  console.log(`Built-in agent model: ${model}`);
  if (!process.env['OPENAI_API_KEY'] && model.startsWith('openai')) {
    console.warn('OPENAI_API_KEY is not set — the agent will fail on the first message.');
  }
});
