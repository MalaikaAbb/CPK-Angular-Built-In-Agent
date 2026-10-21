/**
 * Harness wrapper for the Built-in Agent pages (Server Tools, MCP Servers,
 * Model Selection, Advanced Configuration).
 *
 * SELF-DEFINED — not from the docs. Those pages show only backend
 * `new BuiltInAgent({...})` snippets and no frontend code. `server.ts`
 * registers each runnable snippet under its own key; this component is a plain
 * `copilot-chat` bound to whichever key is picked, so each configuration can
 * be exercised on its own. The `@for` over a one-item list re-creates the chat
 * when the key changes, so each agent starts from its own conversation.
 *
 * These agents live on a separate runtime in `server.ts`
 * (`/api/copilotkit-builtin`, no Intelligence). `CopilotKit` is a root
 * singleton, so a component-level `provideCopilotKit` is never read; instead
 * this component points the root instance at that runtime with the public
 * `updateRuntime`, and restores the previous URL when it is destroyed.
 */
import { Component, DestroyRef, inject, input, linkedSignal } from '@angular/core';
import { CopilotChat, CopilotKit } from '@copilotkit/angular';

const BUILT_IN_AGENT_RUNTIME_URL = 'http://localhost:8200/api/copilotkit-builtin';

export interface AgentOption {
  /** Agent key registered in `server.ts`. */
  id: string;
  /** Doc section the key's snippet comes from. */
  section: string;
  /** A prompt that exercises the snippet. */
  prompt: string;
}

@Component({
  selector: 'app-agent-picker-chat',
  imports: [CopilotChat],
  host: { class: 'flex h-full min-h-0 gap-4 p-4' },
  template: `
    <nav
      class="w-72 shrink-0 overflow-y-auto rounded-lg border border-slate-200 bg-white p-3"
      aria-label="Agent configurations"
    >
      <ul class="space-y-1">
        @for (option of agents(); track option.id) {
          <li>
            <button
              type="button"
              class="w-full rounded-md px-3 py-2 text-left text-sm"
              [class]="
                option.id === selected().id
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              "
              [attr.aria-pressed]="option.id === selected().id"
              (click)="selected.set(option)"
            >
              <span class="block font-medium">{{ option.section }}</span>
              <code class="block text-xs opacity-80">{{ option.id }}</code>
            </button>
          </li>
        }
      </ul>
    </nav>

    <section class="flex min-w-0 flex-1 flex-col gap-2">
      <p class="text-sm text-slate-700">
        Agent <code>{{ selected().id }}</code> — try:
        <em>{{ selected().prompt }}</em>
      </p>
      <div class="min-h-0 flex-1 rounded-lg border border-slate-200 bg-white">
        @for (option of [selected()]; track option.id) {
          <copilot-chat [agentId]="option.id" />
        }
      </div>
    </section>
  `,
})
export class AgentPickerChatComponent {
  readonly agents = input.required<AgentOption[]>();

  protected readonly selected = linkedSignal(() => this.agents()[0]);

  constructor() {
    const copilotKit = inject(CopilotKit);
    const previousRuntimeUrl = copilotKit.runtimeUrl();
    copilotKit.updateRuntime({ runtimeUrl: BUILT_IN_AGENT_RUNTIME_URL });
    inject(DestroyRef).onDestroy(() =>
      copilotKit.updateRuntime({ runtimeUrl: previousRuntimeUrl }),
    );
  }
}
