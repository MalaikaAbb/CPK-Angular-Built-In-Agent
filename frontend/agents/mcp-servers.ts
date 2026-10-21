/**
 * MCP Servers — the page's runnable snippets.
 * https://docs.copilotkit.ai/angular/mcp-servers
 *
 * Each snippet's body is verbatim inside a function, so `server.ts` can
 * register it under its own key; the page shows no runtime registration.
 *
 * ADDED to every snippet: `maxSteps: 2`. None of the page's snippets set it,
 * so it stays at the default of 1 and the run ends at the MCP tool call with
 * no answer. 2 is the value the Server Tools page uses, with the comment
 * "Important for tool calls".
 *
 * The one change to every snippet is the URL. The page points at placeholder
 * hosts (`https://my-mcp-server.example.com/sse`, …); here each one is the
 * same path on the harness's own MCP server (`../mcp-server`), with the
 * placeholder's subdomain as the first path segment, so the mapping stays
 * readable: `https://search-mcp.example.com/sse` → `${MCP}/search-mcp/sse`.
 *
 * Not wired, because the snippets use identifiers the page never defines —
 * see the route page and README Known issues:
 * - "Tool caching": `ToolSet`, `transport` (from the previous snippet)
 * - "Dynamic authentication": `isTokenExpired`, `currentClient`,
 *   `makeTransport`, `getFreshToken`
 * - "Combining with mcpServers": `persistentClient`
 */
import { BuiltInAgent, defineTool } from "@copilotkit/runtime/v2";
import { createMCPClient } from "@ai-sdk/mcp";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { z } from "zod";

/** Base URL of `../mcp-server`. Replaces the page's placeholder hosts. */
const MCP = process.env["MCP_SERVER_URL"] ?? "http://localhost:8300";

// mcp-servers : "SSE transport" start
export function sseTransport() {
  const builtInAgent = new BuiltInAgent({
    model: "openai:gpt-5.4-mini",
    maxSteps: 2, // ADDED — not in the MCP page; see the header comment
    mcpServers: [
      {
        type: "sse", // [!code highlight]
        url: `${MCP}/my-mcp-server/sse`,
      },
    ],
  });

  return builtInAgent;
}
// mcp-servers : "SSE transport" end

// mcp-servers : "Authentication headers" start
export function authenticationHeaders() {
  const builtInAgent = new BuiltInAgent({
    model: "openai:gpt-5.4-mini",
    maxSteps: 2, // ADDED — not in the MCP page; see the header comment
    mcpServers: [
      {
        type: "sse",
        url: `${MCP}/my-mcp-server/sse`,
        headers: { // [!code highlight:3]
          Authorization: `Bearer ${process.env.MCP_API_KEY}`,
        },
      },
    ],
  });

  return builtInAgent;
}
// mcp-servers : "Authentication headers" end

// mcp-servers : "HTTP transport" start
export function httpTransport() {
  const builtInAgent = new BuiltInAgent({
    model: "openai:gpt-5.4-mini",
    maxSteps: 2, // ADDED — not in the MCP page; see the header comment
    mcpServers: [
      {
        type: "http", // [!code highlight]
        url: `${MCP}/my-mcp-server/mcp`,
      },
    ],
  });

  return builtInAgent;
}
// mcp-servers : "HTTP transport" end

// mcp-servers : "Multiple servers" start
export function multipleServers() {
  const builtInAgent = new BuiltInAgent({
    model: "openai:gpt-5.4-mini",
    maxSteps: 2, // ADDED — not in the MCP page; see the header comment
    mcpServers: [
      {
        type: "sse",
        url: `${MCP}/search-mcp/sse`,
      },
      {
        type: "sse",
        url: `${MCP}/db-mcp/sse`,
        headers: { Authorization: `Bearer ${process.env.DB_MCP_KEY}` },
      },
      {
        type: "http",
        url: `${MCP}/analytics-mcp/mcp`,
      },
    ],
  });

  return builtInAgent;
}
// mcp-servers : "Multiple servers" end

// mcp-servers : "Tool name collisions" start
export function toolNameCollisions() {
  const builtInAgent = new BuiltInAgent({
    model: "openai:gpt-5.4-mini",
    maxSteps: 2, // ADDED — not in the MCP page; see the header comment
    mcpServers: [
      { type: "http", url: `${MCP}/staging/mcp`, name: "staging" }, // [!code highlight]
      { type: "http", url: `${MCP}/prod/mcp`, name: "production" }, // [!code highlight]
    ],
  });
  // Both servers expose `search`, so the model sees `staging_search` and `production_search`.

  return builtInAgent;
}
// mcp-servers : "Tool name collisions" end

// mcp-servers : "Combining with server tools" start
export function combiningWithServerTools() {
  const customTool = defineTool({
    name: "getUser",
    description: "Get the current user",
    parameters: z.object({}),
    execute: async () => {
      return { name: "Jane", role: "Admin" };
    },
  });

  const builtInAgent = new BuiltInAgent({
    model: "openai:gpt-5.4-mini",
    maxSteps: 2, // ADDED — not in the MCP page; see the header comment
    tools: [customTool], // Your custom tools
    mcpServers: [        // Plus tools from MCP servers
      { type: "sse", url: `${MCP}/search-mcp/sse` },
    ],
  });

  return builtInAgent;
}
// mcp-servers : "Combining with server tools" end

/**
 * The page creates this client with a top-level `await`. This runtime is
 * loaded as CommonJS, where top-level `await` is a syntax error, so the
 * snippet runs inside an async function instead; `server.ts` awaits it.
 */
// mcp-servers : "User-managed MCP clients" start
export async function userManagedMcpClients() {
  // Create a persistent client at startup
  const transport = new StreamableHTTPClientTransport(
    new URL(`${MCP}/my-mcp-server/mcp`),
  );
  const client = await createMCPClient({ transport });

  const builtInAgent = new BuiltInAgent({
    model: "openai:gpt-5.4-mini",
    maxSteps: 2, // ADDED — not in the MCP page; see the header comment
    mcpClients: [client], // [!code highlight]
  });

  return builtInAgent;
}
// mcp-servers : "User-managed MCP clients" end
