import { Component } from '@angular/core';

import { RouteHeader } from '../components/route-header';
import { Callout, DocSample, Panel, SourceCode, TryIt } from '../components/ui';
import {
  MCP_COMBINING_WITH_MCP_SERVERS,
  MCP_DYNAMIC_AUTH,
  MCP_TOOL_CACHING,
} from '../features/built-in-agent/doc-samples';

@Component({
  selector: 'app-mcp-servers-page',
  imports: [RouteHeader, Panel, Callout, TryIt, SourceCode, DocSample],
  template: `
    <app-route-header path="/mcp-servers" />

    <div class="space-y-6">
      <ui-try-it>
        <p class="mt-1 text-slate-700">
          Start the MCP server first (<code>cd mcp-server &amp;&amp; npm start</code>,
          port 8300), then open the demo and pick an agent.
        </p>
        <ul class="mt-2 list-disc space-y-1 pl-5 text-slate-700">
          <li>
            <code>mcp-sse</code>, <code>mcp-sse-auth</code>,
            <code>mcp-http</code>, <code>mcp-clients</code> — send
            <em>Search for "angular"</em>. <strong>Pass:</strong> a
            <code>search</code> call reaches the MCP server and the answer
            quotes its fixed results (<code>my-mcp-server: first result…</code>).
          </li>
          <li>
            <code>mcp-collisions</code> — ask it to list its tools.
            <strong>Pass:</strong> <code>staging_search</code> and
            <code>production_search</code>.
          </li>
          <li>
            <code>mcp-multiple</code> — ask it to list its tools.
            <strong>Pass:</strong> <code>mcp1_search</code>,
            <code>mcp2_search</code>, <code>mcp3_search</code> (no
            <code>name</code> on any server).
          </li>
          <li>
            <code>mcp-with-server-tools</code> — ask who the current user is.
            <strong>Pass:</strong> <code>getUser</code> is called and the answer
            names Jane, Admin.
          </li>
        </ul>
        <p class="mt-2 text-slate-700">
          <strong>Fail:</strong> a run error, or an answer with made-up search
          results and no <code>search</code> call — the MCP server is not
          running (next callout).
        </p>
      </ui-try-it>

      <ui-callout tone="warn" title="maxSteps: 2 added to every MCP snippet">
        None of the page's agents set <code>maxSteps</code>, so as published
        each stops after one step: the model calls an MCP tool and the run ends
        before it can use the result. The Server Tools page sets
        <code>maxSteps: 2</code> and flags it as important for tool calls; this
        page does not mention it. The harness adds <code>maxSteps: 2</code> to
        each snippet, marked <code>ADDED</code> in the source.
      </ui-callout>

      <ui-panel heading="The MCP server — self-defined">
        <p class="mb-3 text-sm text-slate-700">
          The page connects to placeholder hosts and defines no server, so this
          one stands in for all of them. Each placeholder's subdomain is a path
          here, serving both SSE and Streamable HTTP, and every server exposes
          one <code>search</code> tool with fixed results.
        </p>
        <ui-source path="../mcp-server/server.ts" />
      </ui-panel>

      <ui-panel heading="Mounted snippets">
        <p class="mb-3 text-sm text-slate-700">
          Bodies unchanged except the URL — each placeholder host becomes the
          matching path on the local server — and the added
          <code>maxSteps: 2</code>.
        </p>
        <ui-source path="agents/mcp-servers.ts" />
      </ui-panel>

      <ui-panel heading="Registered in the runtime">
        <ui-source path="server.ts" note="see builtInAgentPages and resolveMcpClientsAgent" />
      </ui-panel>

      <ui-callout tone="warn" title="Findings on the mounted snippets">
        <ul class="list-disc space-y-1 pl-5">
          <li>
            <strong>An unreachable <code>mcpServers</code> entry is skipped,
            not reported.</strong> The runtime logs a warning and runs without
            that server's tools, so the model answers anyway — inventing
            results where it would have searched. Nothing reaches the chat.
            <code>mcpClients</code> fails the run instead.
          </li>
          <li>
            <strong>Authentication headers</strong> interpolate
            <code>process.env.MCP_API_KEY</code> directly. Unset, the request
            still goes out, as <code>Authorization: Bearer undefined</code>.
          </li>
          <li>
            <strong>User-managed MCP clients</strong> use a top-level
            <code>await</code>, which is a syntax error in a CommonJS runtime
            like this one, so the snippet runs inside an async function.
          </li>
          <li>
            <strong>User-managed MCP clients</strong> do not type-check:
            installing <code>&#64;ai-sdk/mcp</code> from its
            <code>ai-v6</code> line brings a different
            <code>&#64;ai-sdk/provider-utils</code> than <code>ai</code> uses,
            so <code>mcpClients: [client]</code> is a type error. It still runs.
          </li>
          <li>
            <strong>Tool name collisions</strong> needs
            <code>&#64;copilotkit/runtime</code> 1.79.1 or later —
            <code>name</code> does not exist on the MCP config types in
            1.73.0. The page does not say so.
          </li>
        </ul>
      </ui-callout>

      <ui-callout tone="warn" title="Not mounted: snippets with undefined identifiers">
        Quoted below and recorded in the README's Known issues.
      </ui-callout>

      <ui-panel heading="Tool caching — uses ToolSet and transport">
        <p class="mb-3 text-sm text-slate-700">
          <code>ToolSet</code> is never imported, and <code>transport</code>
          comes from the previous snippet.
        </p>
        <ui-doc-sample caption="mcp-servers — Tool caching" [code]="toolCaching" />
      </ui-panel>

      <ui-panel heading="Dynamic authentication — uses four undefined helpers">
        <p class="mb-3 text-sm text-slate-700">
          <code>isTokenExpired</code>, <code>currentClient</code>,
          <code>makeTransport</code>, and <code>getFreshToken</code>.
        </p>
        <ui-doc-sample caption="mcp-servers — Dynamic authentication" [code]="dynamicAuth" />
      </ui-panel>

      <ui-panel heading="Combining with mcpServers — uses persistentClient">
        <ui-doc-sample caption="mcp-servers — Combining with mcpServers" [code]="combiningWithMcpServers" />
      </ui-panel>
    </div>
  `,
})
export default class McpServersPage {
  protected readonly toolCaching = MCP_TOOL_CACHING;
  protected readonly dynamicAuth = MCP_DYNAMIC_AUTH;
  protected readonly combiningWithMcpServers = MCP_COMBINING_WITH_MCP_SERVERS;
}
