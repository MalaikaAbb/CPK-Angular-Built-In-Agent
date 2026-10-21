import { Component } from '@angular/core';

import { RouteHeader } from '../components/route-header';
import { Callout, DocSample, Panel, SourceCode, TryIt } from '../components/ui';
import { ADVANCED_MULTI_STEP } from '../features/built-in-agent/doc-samples';

@Component({
  selector: 'app-advanced-configuration-page',
  imports: [RouteHeader, Panel, Callout, TryIt, SourceCode, DocSample],
  template: `
    <app-route-header path="/advanced-configuration" />

    <div class="space-y-6">
      <ui-try-it>
        <p class="mt-1 text-slate-700">
          Open the demo and send each agent the prompt shown above its chat.
        </p>
        <ul class="mt-2 list-disc space-y-1 pl-5 text-slate-700">
          <li>
            <code>adv-system-prompt</code> — <strong>Pass:</strong> it answers
            as Acme Corp support.
          </li>
          <li>
            <code>adv-openai-reasoning</code> (o3) and
            <code>adv-anthropic-thinking</code> — <strong>Pass:</strong> a
            reply after a visible reasoning delay.
          </li>
          <li>
            <code>adv-tool-choice</code>, <code>adv-generation</code>,
            <code>adv-overridable</code>,
            <code>adv-message-forwarding</code> — <strong>Pass:</strong> an
            ordinary reply. These options change no visible behaviour on their
            own; check the runtime log for the provider warnings below.
          </li>
        </ul>
        <p class="mt-2 text-slate-700">
          <strong>Fail:</strong> a run error.
        </p>
      </ui-try-it>

      <ui-panel heading="Mounted snippets">
        <ui-source path="agents/advanced-configuration.ts" />
      </ui-panel>

      <ui-panel heading="Registered in the runtime">
        <ui-source path="server.ts" note="see builtInAgentPages" />
      </ui-panel>

      <ui-callout tone="warn" title="Findings on the mounted snippets">
        <ul class="list-disc space-y-1 pl-5">
          <li>
            <strong>Generation parameters</strong> on the page's own model,
            <code>openai:gpt-5.4-mini</code>: the runtime logs that
            <code>temperature</code>, <code>topP</code>, <code>topK</code>,
            <code>seed</code>, <code>presencePenalty</code>,
            <code>frequencyPenalty</code>, and <code>stopSequences</code> are
            all unsupported, and drops them. Only
            <code>maxOutputTokens</code> and <code>maxRetries</code> apply. The
            page's note names only <code>topK</code>.
          </li>
          <li>
            <strong>Overridable properties</strong> sets
            <code>temperature: 0.5</code> on the same model, which is dropped
            the same way.
          </li>
          <li>
            <strong>Overridable properties</strong> shows only the agent side.
            The page never shows how the frontend sends an override, so the
            demo chat cannot exercise it.
          </li>
        </ul>
      </ui-callout>

      <ui-callout tone="warn" title="Not mounted: Multi-step tool calling">
        <code>searchDocs</code> and <code>createTicket</code> are not defined on
        this page; they come from Server Tools, where they depend on the
        undefined <code>search</code> and <code>db</code>.
      </ui-callout>

      <ui-panel heading="Multi-step tool calling">
        <ui-doc-sample caption="advanced-configuration — Multi-step tool calling" [code]="multiStep" />
      </ui-panel>
    </div>
  `,
})
export default class AdvancedConfigurationPage {
  protected readonly multiStep = ADVANCED_MULTI_STEP;
}
