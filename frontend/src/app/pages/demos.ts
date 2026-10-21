/**
 * Chrome-free demo routes. Each one mounts exactly the feature its doc route
 * documents, with nothing but a thin back-bar above it, so a demo can be
 * screen-recorded on its own.
 *
 * All demos share the application-root CopilotKit provider, so a conversation
 * started in one demo continues in another — the Quickstart, Frontend tools,
 * A2UI, and Headless demos all drive the `default` agent and therefore show the
 * same conversation through four different interfaces.
 */
import { Component } from '@angular/core';

import { DemoFrame } from '../components/demo-frame';
import {
  ADVANCED_CONFIGURATION_AGENTS,
  MCP_SERVERS_AGENTS,
  MODEL_SELECTION_AGENTS,
  SERVER_TOOLS_AGENTS,
} from '../features/built-in-agent/agent-options';
import { AgentPickerChatComponent } from '../features/built-in-agent/agent-picker-chat.component';
import { A2uiChatComponent } from '../features/a2ui/a2ui-chat.component';
import { MediaChatComponent } from '../features/attachments/media-chat.component';
import { ChatUiDemoComponent } from '../features/chat-ui/chat-ui-demo.component';
import { HeadlessChatComponent } from '../features/headless/headless-chat.component';
import { HitlChatComponent } from '../features/hitl/hitl-chat.component';
import { MemoryDemoComponent } from '../features/memory/memory-demo.component';
import { VoiceChatComponent } from '../features/media/voice-chat.component';
import { QuickstartChat } from '../features/quickstart/quickstart-chat';
import { SharedStateChatComponent } from '../features/shared-state/shared-state-chat.component';
import { ThreadsDemoComponent } from '../features/threads/threads-demo.component';
import { ToolsChatComponent } from '../features/tools/tools-chat.component';

@Component({
  selector: 'app-quickstart-demo',
  imports: [DemoFrame, QuickstartChat],
  template: `<app-demo-frame backTo="/quickstart"
    ><app-quickstart-chat
  /></app-demo-frame>`,
})
export class QuickstartDemo {}

@Component({
  selector: 'app-chat-ui-demo-page',
  imports: [DemoFrame, ChatUiDemoComponent],
  template: `<app-demo-frame backTo="/chat-ui"
    ><app-chat-ui-demo
  /></app-demo-frame>`,
})
export class ChatUiDemo {}

@Component({
  selector: 'app-tools-demo',
  imports: [DemoFrame, ToolsChatComponent],
  template: `<app-demo-frame backTo="/frontend-tools-generative-ui"
    ><app-tools-chat
  /></app-demo-frame>`,
})
export class ToolsDemo {}

@Component({
  selector: 'app-a2ui-demo',
  imports: [DemoFrame, A2uiChatComponent],
  template: `<app-demo-frame backTo="/a2ui"><app-a2ui-chat /></app-demo-frame>`,
})
export class A2uiDemo {}

@Component({
  selector: 'app-voice-demo',
  imports: [DemoFrame, VoiceChatComponent],
  template: `<app-demo-frame backTo="/voice-multimodal"
    ><app-voice-chat
  /></app-demo-frame>`,
})
export class VoiceDemo {}

@Component({
  selector: 'app-hitl-demo',
  imports: [DemoFrame, HitlChatComponent],
  template: `<app-demo-frame backTo="/human-in-the-loop"
    ><app-hitl-chat
  /></app-demo-frame>`,
})
export class HitlDemo {}

@Component({
  selector: 'app-shared-state-demo',
  imports: [DemoFrame, SharedStateChatComponent],
  template: `<app-demo-frame backTo="/shared-state"
    ><app-shared-state-chat
  /></app-demo-frame>`,
})
export class SharedStateDemo {}

@Component({
  selector: 'app-threads-demo-page',
  imports: [DemoFrame, ThreadsDemoComponent],
  template: `<app-demo-frame backTo="/threads"
    ><app-threads-demo
  /></app-demo-frame>`,
})
export class ThreadsDemo {}

@Component({
  selector: 'app-memory-demo-page',
  imports: [DemoFrame, MemoryDemoComponent],
  template: `<app-demo-frame backTo="/memory"
    ><app-memory-demo
  /></app-demo-frame>`,
})
export class MemoryDemo {}

@Component({
  selector: 'app-attachments-demo',
  imports: [DemoFrame, MediaChatComponent],
  template: `<app-demo-frame backTo="/attachments"
    ><div style="height: 100%"><app-media-chat /></div
  ></app-demo-frame>`,
})
export class AttachmentsDemo {}

@Component({
  selector: 'app-headless-demo',
  imports: [DemoFrame, HeadlessChatComponent],
  template: `<app-demo-frame backTo="/headless"
    ><div style="height: 100%; overflow: auto; padding: 1rem">
      <app-headless-chat /></div
  ></app-demo-frame>`,
})
export class HeadlessDemo {}

@Component({
  selector: 'app-server-tools-demo',
  imports: [DemoFrame, AgentPickerChatComponent],
  template: `<app-demo-frame backTo="/server-tools"
    ><app-agent-picker-chat [agents]="agents"
  /></app-demo-frame>`,
})
export class ServerToolsDemo {
  protected readonly agents = SERVER_TOOLS_AGENTS;
}

@Component({
  selector: 'app-mcp-servers-demo',
  imports: [DemoFrame, AgentPickerChatComponent],
  template: `<app-demo-frame backTo="/mcp-servers"
    ><app-agent-picker-chat [agents]="agents"
  /></app-demo-frame>`,
})
export class McpServersDemo {
  protected readonly agents = MCP_SERVERS_AGENTS;
}

@Component({
  selector: 'app-model-selection-demo',
  imports: [DemoFrame, AgentPickerChatComponent],
  template: `<app-demo-frame backTo="/model-selection"
    ><app-agent-picker-chat [agents]="agents"
  /></app-demo-frame>`,
})
export class ModelSelectionDemo {
  protected readonly agents = MODEL_SELECTION_AGENTS;
}

@Component({
  selector: 'app-advanced-configuration-demo',
  imports: [DemoFrame, AgentPickerChatComponent],
  template: `<app-demo-frame backTo="/advanced-configuration"
    ><app-agent-picker-chat [agents]="agents"
  /></app-demo-frame>`,
})
export class AdvancedConfigurationDemo {
  protected readonly agents = ADVANCED_CONFIGURATION_AGENTS;
}
