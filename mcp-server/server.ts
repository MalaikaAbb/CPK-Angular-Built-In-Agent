/**
 * Local MCP server for the MCP Servers route.
 * https://docs.copilotkit.ai/angular/mcp-servers
 *
 * SELF-DEFINED — not from the docs. The page connects the Built-in Agent to
 * MCP servers at placeholder hosts (`my-mcp-server.example.com`,
 * `search-mcp.example.com`, `staging.example.com`, …) and never defines one.
 * This process stands in for all of them: each placeholder host becomes a path
 * prefix here, so `https://search-mcp.example.com/sse` is
 * `http://localhost:8300/search-mcp/sse`.
 *
 * Every server exposes the same single tool, `search`, returning fixed
 * results tagged with the server's name — the page defines no tool content,
 * and one shared name is what the "Tool name collisions" section needs.
 *
 * Transports, per server:
 * - `GET  /<server>/sse` + `POST /<server>/messages` — SSE
 * - `POST /<server>/mcp` — Streamable HTTP, stateless
 *
 * No auth is enforced. The page only shows the agent sending an
 * `Authorization` header; whether it arrives is logged, nothing more.
 */
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';

/** The placeholder hosts used on the doc page, by subdomain. */
const SERVERS = [
  'my-mcp-server',
  'search-mcp',
  'db-mcp',
  'analytics-mcp',
  'staging',
  'prod',
  'other-mcp',
] as const;

function createMcpServer(name: string): McpServer {
  const server = new McpServer({ name, version: '1.0.0' });
  server.registerTool(
    'search',
    {
      description: `Search the ${name} index`,
      inputSchema: { query: z.string().describe('The search query') },
    },
    async ({ query }) => ({
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            server: name,
            query,
            results: [
              { title: `${name}: first result for "${query}"` },
              { title: `${name}: second result for "${query}"` },
            ],
          }),
        },
      ],
    }),
  );
  return server;
}

/** Live SSE sessions, by session id, so POSTed messages reach their stream. */
const sseSessions = new Map<string, SSEServerTransport>();

function logAuth(server: string, req: IncomingMessage): void {
  const auth = req.headers['authorization'];
  console.log(
    `[${server}] ${req.method} ${req.url} — authorization header: ${auth ? 'present' : 'absent'}`,
  );
}

async function handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const url = new URL(req.url ?? '/', 'http://localhost');
  const [, server, endpoint] = url.pathname.split('/');

  if (!SERVERS.includes(server as (typeof SERVERS)[number])) {
    res.writeHead(404).end(`Unknown MCP server "${server}"`);
    return;
  }

  if (endpoint === 'sse' && req.method === 'GET') {
    logAuth(server, req);
    const transport = new SSEServerTransport(`/${server}/messages`, res);
    sseSessions.set(transport.sessionId, transport);
    res.on('close', () => sseSessions.delete(transport.sessionId));
    await createMcpServer(server).connect(transport);
    return;
  }

  if (endpoint === 'messages' && req.method === 'POST') {
    const transport = sseSessions.get(url.searchParams.get('sessionId') ?? '');
    if (!transport) {
      res.writeHead(404).end('Unknown SSE session');
      return;
    }
    await transport.handlePostMessage(req, res);
    return;
  }

  if (endpoint === 'mcp' && req.method === 'POST') {
    logAuth(server, req);
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    res.on('close', () => transport.close());
    await createMcpServer(server).connect(transport);
    await transport.handleRequest(req, res);
    return;
  }

  res.writeHead(405).end();
}

const port = Number(process.env['MCP_PORT'] ?? 8300);

createServer((req, res) => {
  handle(req, res).catch((error: unknown) => {
    console.error(error);
    if (!res.headersSent) res.writeHead(500).end();
  });
}).listen(port, () => {
  console.log(`MCP server listening at http://localhost:${port}`);
  for (const server of SERVERS) {
    console.log(`  /${server}/sse  /${server}/mcp`);
  }
});
