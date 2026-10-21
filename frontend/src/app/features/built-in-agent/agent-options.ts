/**
 * The agent keys each Built-in Agent route's demo can bind to. Every `id` is a
 * key registered in `server.ts`, backed by a verbatim snippet in `agents/`.
 */
import type { AgentOption } from './agent-picker-chat.component';

export const SERVER_TOOLS_AGENTS: AgentOption[] = [
  {
    id: 'server-tools',
    section: 'Defining a tool',
    prompt: "What's the weather in Paris?",
  },
];

export const MCP_SERVERS_AGENTS: AgentOption[] = [
  { id: 'mcp-sse', section: 'SSE transport', prompt: 'Search for "angular".' },
  {
    id: 'mcp-sse-auth',
    section: 'Authentication headers',
    prompt: 'Search for "angular".',
  },
  { id: 'mcp-http', section: 'HTTP transport', prompt: 'Search for "angular".' },
  {
    id: 'mcp-multiple',
    section: 'Multiple servers',
    prompt: 'List the exact names of every tool you have.',
  },
  {
    id: 'mcp-collisions',
    section: 'Tool name collisions',
    prompt: 'List the exact names of every tool you have.',
  },
  {
    id: 'mcp-with-server-tools',
    section: 'Combining with server tools',
    prompt: 'Who is the current user?',
  },
  {
    id: 'mcp-clients',
    section: 'User-managed MCP clients',
    prompt: 'Search for "angular".',
  },
];

export const MODEL_SELECTION_AGENTS: AgentOption[] = [
  { id: 'model-openai', section: 'OpenAI', prompt: 'Which model are you?' },
  { id: 'model-anthropic', section: 'Anthropic', prompt: 'Which model are you?' },
  { id: 'model-google', section: 'Google', prompt: 'Which model are you?' },
  {
    id: 'model-api-key',
    section: 'Environment Variables — apiKey',
    prompt: 'Say hello.',
  },
];

export const ADVANCED_CONFIGURATION_AGENTS: AgentOption[] = [
  { id: 'adv-tool-choice', section: 'Tool choice', prompt: 'Say hello.' },
  {
    id: 'adv-system-prompt',
    section: 'System prompt',
    prompt: 'Who do you work for?',
  },
  {
    id: 'adv-generation',
    section: 'Generation parameters',
    prompt: 'Write a two-line poem.',
  },
  {
    id: 'adv-openai-reasoning',
    section: 'Provider-specific options — OpenAI',
    prompt: 'What is 17 × 23?',
  },
  {
    id: 'adv-anthropic-thinking',
    section: 'Provider-specific options — Anthropic',
    prompt: 'What is 17 × 23?',
  },
  {
    id: 'adv-overridable',
    section: 'Overridable properties',
    prompt: 'Say hello.',
  },
  {
    id: 'adv-message-forwarding',
    section: 'Message forwarding',
    prompt: 'Say hello.',
  },
];
