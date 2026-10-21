import { Component } from '@angular/core';

import { RouteHeader } from '../components/route-header';
import { Callout, DocSample, Panel, SourceCode, TryIt } from '../components/ui';
import {
  MODEL_AZURE,
  MODEL_CUSTOM_PROVIDER,
  MODEL_ENVIRONMENT_VARIABLES,
  MODEL_INSTALL_AI_V6,
  MODEL_MINIMAX,
  MODEL_OPENROUTER,
  MODEL_SET_ON_AGENT,
} from '../features/built-in-agent/doc-samples';

@Component({
  selector: 'app-model-selection-page',
  imports: [RouteHeader, Panel, Callout, TryIt, SourceCode, DocSample],
  template: `
    <app-route-header path="/model-selection" />

    <div class="space-y-6">
      <ui-try-it>
        <p class="mt-1 text-slate-700">
          Open the demo and send <em>Which model are you?</em> to each agent.
          Each provider reads its own key from the runtime's environment.
        </p>
        <ul class="mt-2 list-disc space-y-1 pl-5 text-slate-700">
          <li><code>model-openai</code> — <code>OPENAI_API_KEY</code></li>
          <li><code>model-anthropic</code> — <code>ANTHROPIC_API_KEY</code></li>
          <li><code>model-google</code> — <code>GOOGLE_API_KEY</code></li>
          <li>
            <code>model-api-key</code> — <code>MY_OPENAI_KEY</code>, passed as
            <code>apiKey</code>
          </li>
        </ul>
        <p class="mt-2 text-slate-700">
          <strong>Pass:</strong> a streamed reply from that provider.
          <strong>Fail:</strong> a run error — read it: a rejected or
          exhausted key is reported by the provider, not by CopilotKit.
        </p>
      </ui-try-it>

      <ui-panel heading="Mounted snippets">
        <ui-source path="agents/model-selection.ts" />
      </ui-panel>

      <ui-panel heading="Registered in the runtime">
        <ui-source path="server.ts" note="see builtInAgentPages" />
      </ui-panel>

      <ui-callout tone="warn" title="apiKey: undefined falls back silently">
        With <code>MY_OPENAI_KEY</code> unset, <code>apiKey</code> is
        <code>undefined</code> and the agent quietly uses
        <code>OPENAI_API_KEY</code> instead, so <code>model-api-key</code>
        answers anyway. A passing reply does not prove the configured key was
        used.
      </ui-callout>

      <ui-panel heading="Environment variables">
        <ui-doc-sample caption="model-selection — Environment Variables" [code]="environmentVariables" />
      </ui-panel>

      <ui-callout tone="warn" title="Not mounted: no key or no real resource">
        MiniMax and OpenRouter need keys this harness does not have. The custom
        provider and Azure snippets point at a placeholder proxy, model, and
        resource that do not exist. They are quoted as published.
      </ui-callout>

      <ui-panel heading="MiniMax — needs MINIMAX_API_KEY">
        <ui-doc-sample caption="model-selection — MiniMax" [code]="minimax" />
      </ui-panel>

      <ui-panel heading="Custom Models (AI SDK) — placeholders">
        <ui-doc-sample caption="model-selection — install" [code]="installAiV6" />
        <div class="mt-3">
          <ui-doc-sample caption="model-selection — Custom Models (AI SDK)" [code]="customProvider" />
        </div>
        <div class="mt-3">
          <ui-doc-sample caption="model-selection — Azure" [code]="azure" />
        </div>
      </ui-panel>

      <ui-panel heading="OpenRouter, proxies, and bring-your-own LLM — needs OPENROUTER_API_KEY">
        <ui-doc-sample caption="model-selection — OpenRouter" [code]="openrouter" />
      </ui-panel>

      <ui-panel heading="The model is set on the agent">
        <p class="mb-3 text-sm text-slate-700">
          <code>openrouter("...")</code> is a placeholder from the snippet
          above.
        </p>
        <ui-doc-sample caption="model-selection — The model is set on the agent" [code]="setOnAgent" />
      </ui-panel>
    </div>
  `,
})
export default class ModelSelectionPage {
  protected readonly environmentVariables = MODEL_ENVIRONMENT_VARIABLES;
  protected readonly minimax = MODEL_MINIMAX;
  protected readonly installAiV6 = MODEL_INSTALL_AI_V6;
  protected readonly customProvider = MODEL_CUSTOM_PROVIDER;
  protected readonly azure = MODEL_AZURE;
  protected readonly openrouter = MODEL_OPENROUTER;
  protected readonly setOnAgent = MODEL_SET_ON_AGENT;
}
