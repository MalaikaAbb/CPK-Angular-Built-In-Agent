/**
 * Advanced Configuration — the page's runnable snippets.
 * https://docs.copilotkit.ai/angular/advanced-configuration
 *
 * Each snippet's body is verbatim inside a function, so `server.ts` can
 * register it under its own key; the page shows no runtime registration.
 *
 * Not wired:
 * - "Multi-step tool calling": `searchDocs` and `createTicket` are not
 *   defined on this page (they come from Server Tools, where they depend on
 *   the undefined `search` and `db`).
 *
 * "Overridable properties" is wired, but the page shows only the agent side —
 * no frontend code that sends an override — so the chat bound to it behaves
 * like any other. See the route page and README Known issues.
 */
import { BuiltInAgent } from "@copilotkit/runtime/v2";

// advanced-configuration : "Tool choice" start
export function toolChoice() {
  const agent = new BuiltInAgent({
    model: "openai:gpt-5.4-mini",
    toolChoice: "auto",       // Let the model decide (default)
    // toolChoice: "required", // Force the model to call a tool
    // toolChoice: "none",     // Disable tool calling
    // toolChoice: { type: "tool", toolName: "searchDocs" }, // Force a specific tool
  });

  return agent;
}
// advanced-configuration : "Tool choice" end

// advanced-configuration : "System prompt" start
export function systemPrompt() {
  const agent = new BuiltInAgent({
    model: "openai:gpt-5.4-mini",
    prompt: "You are a customer support agent for Acme Corp. Be concise and helpful. Always check the knowledge base before answering.", // [!code highlight]
  });

  return agent;
}
// advanced-configuration : "System prompt" end

// advanced-configuration : "Generation parameters" start
export function generationParameters() {
  const agent = new BuiltInAgent({
    model: "openai:gpt-5.4-mini",
    temperature: 0.7,        // Creativity (0 = deterministic, 1+ = creative)
    topP: 0.9,               // Nucleus sampling
    topK: 40,                // Top-K sampling (provider-dependent)
    maxOutputTokens: 4096,   // Maximum tokens in the response
    presencePenalty: 0.1,    // Penalize repeated topics
    frequencyPenalty: 0.1,   // Penalize repeated tokens
    stopSequences: ["END"],  // Stop generation at these sequences
    seed: 42,                // Deterministic output (provider-dependent)
    maxRetries: 3,           // Retry on transient failures
  });

  return agent;
}
// advanced-configuration : "Generation parameters" end

// advanced-configuration : "Provider-specific options" — OpenAI start
export function openAiReasoningEffort() {
  // OpenAI reasoning models (o3, o4-mini) with reasoning effort
  const agent = new BuiltInAgent({
    model: "openai:o3",
    providerOptions: { // [!code highlight:3]
      openai: { reasoningEffort: "high" },
    },
  });

  return agent;
}
// advanced-configuration : "Provider-specific options" — OpenAI end

// advanced-configuration : "Provider-specific options" — Anthropic start
export function anthropicAdaptiveThinking() {
  // Anthropic with adaptive thinking
  const agent = new BuiltInAgent({
    model: "anthropic:claude-sonnet-4-6",
    providerOptions: { // [!code highlight:3]
      anthropic: { thinking: { type: "adaptive" }, effort: "high" },
    },
  });

  return agent;
}
// advanced-configuration : "Provider-specific options" — Anthropic end

// advanced-configuration : "Overridable properties" start
export function overridableProperties() {
  const agent = new BuiltInAgent({
    model: "openai:gpt-5.4-mini",
    temperature: 0.5,
    overridableProperties: ["model", "temperature", "prompt"], // [!code highlight]
  });

  return agent;
}
// advanced-configuration : "Overridable properties" end

// advanced-configuration : "Message forwarding" start
export function messageForwarding() {
  const agent = new BuiltInAgent({
    model: "openai:gpt-5.4-mini",
    forwardSystemMessages: true,    // Forward system-role messages
    forwardDeveloperMessages: true, // Forward developer-role messages (as system messages)
  });

  return agent;
}
// advanced-configuration : "Message forwarding" end
