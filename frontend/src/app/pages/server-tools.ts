import { Component } from '@angular/core';

import { RouteHeader } from '../components/route-header';
import { Callout, DocSample, Panel, SourceCode, TryIt } from '../components/ui';
import {
  SERVER_TOOLS_COMPLEX_ZOD,
  SERVER_TOOLS_ERROR_HANDLING,
  SERVER_TOOLS_MULTI_STEP,
  SERVER_TOOLS_MULTIPLE_TOOLS,
} from '../features/built-in-agent/doc-samples';

@Component({
  selector: 'app-server-tools-page',
  imports: [RouteHeader, Panel, Callout, TryIt, SourceCode, DocSample],
  template: `
    <app-route-header path="/server-tools" />

    <div class="space-y-6">
      <ui-try-it>
        <p class="mt-1 text-slate-700">
          Open the demo (agent <code>server-tools</code>) and send
          <em>What's the weather in Paris?</em>
        </p>
        <p class="mt-2 text-slate-700">
          <strong>Pass:</strong> the agent calls <code>getWeather</code> with
          <code>location: "Paris"</code> and answers with the fixed reading the
          tool returns — sunny, 72.
          <strong>Fail:</strong> a plain-text answer with no tool call, or a
          run that stops right after the call with no reply.
        </p>
      </ui-try-it>

      <ui-panel heading="Defining a tool — mounted">
        <p class="mb-3 text-sm text-slate-700">
          The only snippet on the page that runs as published. Its body is
          unchanged; the wrapping function lets <code>server.ts</code> register
          it under the <code>server-tools</code> key, because the page never
          shows how the agent reaches the runtime.
        </p>
        <ui-source path="agents/server-tools.ts" />
      </ui-panel>

      <ui-panel heading="Registered in the runtime">
        <ui-source path="server.ts" note="see builtInAgentPages" />
      </ui-panel>

      <ui-callout tone="warn" title="Not mounted: snippets with undefined identifiers">
        The remaining samples call helpers the page never defines, so they
        cannot run as published. Each is quoted below and recorded in the
        README's Known issues.
      </ui-callout>

      <ui-panel heading="Multiple tools — uses search and db">
        <ui-doc-sample caption="server-tools — Multiple tools" [code]="multipleTools" />
      </ui-panel>

      <ui-panel heading="Complex Zod schemas — uses searchFlights">
        <ui-doc-sample caption="server-tools — Complex Zod schemas" [code]="complexZod" />
      </ui-panel>

      <ui-panel heading="Error handling — uses db">
        <ui-doc-sample caption="server-tools — Error handling" [code]="errorHandling" />
      </ui-panel>

      <ui-panel heading="Multi-step tool calling — uses the tools above">
        <p class="mb-3 text-sm text-slate-700">
          <code>searchDocs</code>, <code>createTicket</code>, and
          <code>getUser</code> are the tools from the two broken sections, so
          this one inherits their gaps.
        </p>
        <ui-doc-sample caption="server-tools — Multi-step tool calling" [code]="multiStep" />
      </ui-panel>
    </div>
  `,
})
export default class ServerToolsPage {
  protected readonly multipleTools = SERVER_TOOLS_MULTIPLE_TOOLS;
  protected readonly complexZod = SERVER_TOOLS_COMPLEX_ZOD;
  protected readonly errorHandling = SERVER_TOOLS_ERROR_HANDLING;
  protected readonly multiStep = SERVER_TOOLS_MULTI_STEP;
}
