/**
 * Doc snippets this harness does not mount, extracted verbatim from the
 * published pages. Each one either uses identifiers its page never defines or
 * needs a resource this harness does not have; the route pages say which.
 *
 * https://docs.copilotkit.ai/angular/server-tools
 * https://docs.copilotkit.ai/angular/mcp-servers
 * https://docs.copilotkit.ai/angular/model-selection
 * https://docs.copilotkit.ai/angular/advanced-configuration
 */

/** server-tools — "Multiple tools". */
export const SERVER_TOOLS_MULTIPLE_TOOLS = "const searchDocs = defineTool({\n  name: \"searchDocs\",\n  description: \"Search the documentation for relevant articles\",\n  parameters: z.object({\n    query: z.string().describe(\"The search query\"),\n  }),\n  execute: async ({ query }) => {\n    const results = await search(query);\n    return { results, count: results.length };\n  },\n});\n\nconst createTicket = defineTool({\n  name: \"createTicket\",\n  description: \"Create a support ticket\",\n  parameters: z.object({\n    title: z.string().describe(\"Ticket title\"),\n    priority: z.enum([\"low\", \"medium\", \"high\"]).describe(\"Ticket priority\"),\n    description: z.string().describe(\"Detailed description of the issue\"),\n  }),\n  execute: async ({ title, priority, description }) => {\n    const ticket = await db.tickets.create({ title, priority, description });\n    return { ticketId: ticket.id, status: \"created\" };\n  },\n});\n\nconst builtInAgent = new BuiltInAgent({\n  model: \"openai:gpt-5.4-mini\",\n  tools: [searchDocs, createTicket], // [!code highlight]\n  maxSteps: 2                        \n});";

/** server-tools — "Complex Zod schemas". */
export const SERVER_TOOLS_COMPLEX_ZOD = "const bookFlight = defineTool({\n  name: \"bookFlight\",\n  description: \"Search for and book flights\",\n  parameters: z.object({\n    trip: z.object({\n      origin: z.string().describe(\"Origin airport code (e.g., SFO)\"),\n      destination: z.string().describe(\"Destination airport code (e.g., JFK)\"),\n      date: z.string().describe(\"Departure date in YYYY-MM-DD format\"),\n    }),\n    passengers: z.array(\n      z.object({\n        name: z.string(),\n        seatPreference: z.enum([\"window\", \"middle\", \"aisle\"]).optional(),\n      })\n    ).describe(\"List of passengers\"),\n    class: z.enum([\"economy\", \"business\", \"first\"]).default(\"economy\"),\n  }),\n  execute: async ({ trip, passengers, class: seatClass }) => {\n    const flights = await searchFlights(trip, seatClass);\n    return { flights, passengerCount: passengers.length };\n  },\n});";

/** server-tools — "Error handling". */
export const SERVER_TOOLS_ERROR_HANDLING = "const getUser = defineTool({\n  name: \"getUser\",\n  description: \"Look up a user by email\",\n  parameters: z.object({\n    email: z.string().email().describe(\"The user's email address\"),\n  }),\n  execute: async ({ email }) => {\n    const user = await db.users.findByEmail(email);\n    if (!user) {\n      throw new Error(`No user found with email: ${email}`); // [!code highlight]\n    }\n    return { id: user.id, name: user.name, role: user.role };\n  },\n});";

/** server-tools — "Multi-step tool calling". */
export const SERVER_TOOLS_MULTI_STEP = "const builtInAgent = new BuiltInAgent({\n  model: \"openai:gpt-5.4-mini\",\n  maxSteps: 5, // [!code highlight]\n  tools: [searchDocs, createTicket, getUser],\n});";

/** mcp-servers — "Tool caching". */
export const MCP_TOOL_CACHING = "const client = await createMCPClient({ transport });\n\nlet cachedTools: ToolSet | null = null;\nconst warmupPromise = client.tools().then(tools => { cachedTools = tools; });\n\nconst provider = {\n  async tools() {\n    if (cachedTools) return cachedTools;\n    await warmupPromise;\n    return cachedTools!;\n  },\n};\n\nconst builtInAgent = new BuiltInAgent({\n  model: \"openai:gpt-5.4-mini\",\n  mcpClients: [provider], // [!code highlight]\n});";

/** mcp-servers — "Dynamic authentication". */
export const MCP_DYNAMIC_AUTH = "const provider = {\n  async tools() {\n    if (isTokenExpired()) {\n      await currentClient.close();\n      currentClient = await createMCPClient({\n        transport: makeTransport(getFreshToken()),\n      });\n    }\n    return currentClient.tools();\n  },\n};\n\nconst builtInAgent = new BuiltInAgent({\n  model: \"openai:gpt-5.4-mini\",\n  mcpClients: [provider],\n});";

/** mcp-servers — "Combining with mcpServers". */
export const MCP_COMBINING_WITH_MCP_SERVERS = "const builtInAgent = new BuiltInAgent({\n  model: \"openai:gpt-5.4-mini\",\n  mcpClients: [persistentClient],  // User-managed, persistent\n  mcpServers: [                     // Agent-managed, per-request\n    { type: \"sse\", url: \"https://other-mcp.example.com/sse\" },\n  ],\n});";

/** model-selection — "MiniMax". */
export const MODEL_MINIMAX = "const agent = new BuiltInAgent({\n  model: \"minimax:MiniMax-M3\",\n});";

/** model-selection — "Environment Variables". */
export const MODEL_ENVIRONMENT_VARIABLES = "# OpenAI\nOPENAI_API_KEY=sk-...\n\n# Anthropic\nANTHROPIC_API_KEY=sk-ant-...\n\n# Google\nGOOGLE_API_KEY=...\n\n# MiniMax\nMINIMAX_API_KEY=...\n\n# Optional: use the China endpoint\nMINIMAX_BASE_URL=https://api.minimaxi.com/v1";

/** model-selection — "Custom Models (AI SDK) — install". */
export const MODEL_INSTALL_AI_V6 = "npm install @ai-sdk/openai@ai-v6";

/** model-selection — "Custom Models (AI SDK)". */
export const MODEL_CUSTOM_PROVIDER = "import { BuiltInAgent } from \"@copilotkit/runtime/v2\";\nimport { createOpenAI } from \"@ai-sdk/openai\"; // [!code highlight]\n\nconst customProvider = createOpenAI({\n  // [!code highlight]\n  apiKey: process.env.MY_API_KEY, // [!code highlight]\n  baseURL: \"https://my-proxy.example.com/v1\", // [!code highlight]\n}); // [!code highlight]\n\nconst agent = new BuiltInAgent({\n  model: customProvider(\"my-fine-tuned-model\"), // [!code highlight]\n});";

/** model-selection — "Custom Models (AI SDK) — Azure". */
export const MODEL_AZURE = "import { createAzure } from \"@ai-sdk/azure\";\n\nconst azure = createAzure({\n  resourceName: \"my-resource\",\n  apiKey: process.env.AZURE_API_KEY,\n});\n\nconst agent = new BuiltInAgent({\n  model: azure(\"my-deployment\"),\n});";

/** model-selection — "OpenRouter, proxies, and bring-your-own LLM". */
export const MODEL_OPENROUTER = "import { BuiltInAgent } from \"@copilotkit/runtime/v2\";\nimport { createOpenAI } from \"@ai-sdk/openai\"; // [!code highlight]\n\n// OpenRouter: one key, hundreds of models behind an OpenAI-compatible API\nconst openrouter = createOpenAI({\n  // [!code highlight]\n  apiKey: process.env.OPENROUTER_API_KEY, // [!code highlight]\n  baseURL: \"https://openrouter.ai/api/v1\", // [!code highlight]\n}); // [!code highlight]\n\nconst agent = new BuiltInAgent({\n  model: openrouter(\"anthropic/claude-sonnet-4-6\"), // [!code highlight]\n});";

/** model-selection — "The model is set on the agent". */
export const MODEL_SET_ON_AGENT = "new BuiltInAgent({ model: \"openai:gpt-5.4-mini\" }); // built-in string\nnew BuiltInAgent({ model: openrouter(\"...\") }); // any LanguageModel";

/** advanced-configuration — "Multi-step tool calling". */
export const ADVANCED_MULTI_STEP = "const agent = new BuiltInAgent({\n  model: \"openai:gpt-5.4-mini\",\n  maxSteps: 5, // [!code highlight]\n  tools: [searchDocs, createTicket],\n});";
