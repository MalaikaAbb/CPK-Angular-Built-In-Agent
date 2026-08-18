import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BackendHealth } from '../components/backend-health';
import { DocDriftPanel } from '../components/doc-drift-panel';
import { RouteHeader } from '../components/route-header';
import { Callout, Panel, SourceCode } from '../components/ui';
import { NAV } from '../lib/nav-config';

@Component({
  selector: 'app-introduction-page',
  imports: [
    RouterLink,
    RouteHeader,
    BackendHealth,
    DocDriftPanel,
    Panel,
    Callout,
    SourceCode,
  ],
  template: `
    <app-route-header path="/" />

    <div class="space-y-6">
      <app-backend-health />

      <doc-drift-panel />

      <ui-panel heading="What this is">
        <p class="text-sm text-slate-700">
          A navigable test harness for the Angular section of the CopilotKit docs, running against
          CopilotKit's own built-in agent. Every guide listed in the sidebar is a route, and each
          route runs the thing its doc page teaches rather than restating it.
        </p>
        <p class="mt-3 text-sm text-slate-700">
          Routes with a live feature are split in two: the route itself holds the notes, pass/fail
          criteria, and the exact source that runs, and
          <code class="rounded bg-slate-100 px-1">&lt;route&gt;/demo</code>
          holds just the running feature with no page chrome.
        </p>
      </ui-panel>

      <ui-panel heading="Architecture">
        <pre
          class="overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs leading-relaxed text-slate-100"
        ><code>Browser (Angular 22, zoneless)
  &#124;  &#64;copilotkit/angular — provideCopilotKit, copilot-chat, signal APIs
  &#124;  POST http://localhost:8200/api/copilotkit
  v
Copilot Runtime  ·  localhost:8200        &#8592; Node, frontend/server.ts
  &#124;  agents: &#123; default, support &#125; &#8594; new BuiltInAgent(&#123; model, prompt &#125;)
  &#124;  OPENAI_API_KEY from this process's environment
  v
Model  (openai:gpt-5-mini)</code></pre>

        <p class="mt-3 text-sm text-slate-700">
          Two processes, not three. There is no agent process to run:
          <code>BuiltInAgent</code> is the agent, and it calls the model provider from inside the
          runtime. Angular still needs the runtime as its own Node process — unlike the React
          quickstart, where it lives inside a Next route — because the browser must never hold the
          model key.
        </p>
      </ui-panel>

      <ui-callout title="The runtime must be running">
        The chat will not stream if it is down. Start it with
        <code>npm run runtime</code> from <code>frontend/</code>, with
        <code>OPENAI_API_KEY</code> exported — or run <code>npm run dev</code> to start it alongside
        <code>ng serve</code>.
      </ui-callout>

      <ui-panel heading="Routes">
        <ul class="space-y-4 text-sm">
          @for (group of nav; track group.title) {
            <li>
              <p class="font-semibold text-slate-900">{{ group.title }}</p>
              <ul class="mt-1 space-y-1">
                @for (route of group.routes; track route.path) {
                  <li>
                    <a
                      [routerLink]="route.path"
                      class="text-blue-700 underline decoration-dotted"
                      >{{ route.title }}</a
                    >
                    <span class="text-slate-600"> — {{ route.summary }}</span>
                  </li>
                }
              </ul>
            </li>
          }
        </ul>
      </ui-panel>

      <ui-panel heading="The runtime binding">
        <p class="mb-3 text-sm text-slate-700">
          This is the one file that stands between the browser and the model. It is read off disk at
          build time, so what you see is what runs.
        </p>
        <ui-source path="server.ts" />
      </ui-panel>
    </div>
  `,
})
export default class IntroductionPage {
  protected readonly nav = NAV;
}
