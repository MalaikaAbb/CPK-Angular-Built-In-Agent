/**
 * Model Selection — the page's runnable snippets.
 * https://docs.copilotkit.ai/angular/model-selection
 *
 * Each snippet's body is verbatim inside a function, so `server.ts` can
 * register it under its own key; the page shows no runtime registration.
 * Each provider reads its own key from the environment: OPENAI_API_KEY,
 * ANTHROPIC_API_KEY, GOOGLE_API_KEY — and MY_OPENAI_KEY for the `apiKey`
 * snippet.
 *
 * Not wired — shown on the route page as code only:
 * - MiniMax: no MINIMAX_API_KEY for this harness.
 * - "Custom Models (AI SDK)": a placeholder proxy (`my-proxy.example.com`,
 *   `my-fine-tuned-model`) and an Azure resource (`my-resource`,
 *   `my-deployment`) that do not exist.
 * - "OpenRouter, proxies, and bring-your-own LLM": no OPENROUTER_API_KEY.
 * - "The model is set on the agent": `openrouter("...")` is a placeholder.
 */
import { BuiltInAgent } from "@copilotkit/runtime/v2";

// model-selection : "OpenAI" start
export function openAi() {
  const agent = new BuiltInAgent({
    model: "openai:gpt-5.4-mini",
  });

  return agent;
}
// model-selection : "OpenAI" end

// model-selection : "Anthropic" start
export function anthropic() {
  const agent = new BuiltInAgent({
    model: "anthropic:claude-sonnet-4-6",
  });

  return agent;
}
// model-selection : "Anthropic" end

// model-selection : "Google" start
export function google() {
  const agent = new BuiltInAgent({
    model: "google:gemini-2.5-pro",
  });

  return agent;
}
// model-selection : "Google" end

// model-selection : "Environment Variables" — apiKey start
export function apiKeyInConfiguration() {
  const agent = new BuiltInAgent({
    model: "openai:gpt-5.4-mini",
    apiKey: process.env.MY_OPENAI_KEY, // [!code highlight]
  });

  return agent;
}
// model-selection : "Environment Variables" — apiKey end
