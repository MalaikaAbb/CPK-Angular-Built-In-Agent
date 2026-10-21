/**
 * Server Tools — the page's runnable snippet.
 * https://docs.copilotkit.ai/angular/server-tools
 *
 * Only "Defining a tool" runs as published. Its body below is verbatim; the
 * wrapping function exists so `server.ts` can register it under its own key
 * (`server-tools`), since the page shows no runtime registration.
 *
 * Not wired, because the snippets use identifiers the page never defines —
 * see the route page and README Known issues:
 * - "Multiple tools": `search`, `db`
 * - "Complex Zod schemas": `searchFlights`
 * - "Error handling": `db`
 * - "Multi-step tool calling": `searchDocs`, `createTicket`, `getUser` from
 *   the sections above, so it inherits their gaps
 */
import { BuiltInAgent, defineTool } from "@copilotkit/runtime/v2";
import { z } from "zod";

// server-tools : "Defining a tool" start
export function definingATool() {
  const getWeather = defineTool({
    name: "getWeather",
    description: "Get the current weather for a location",
    parameters: z.object({
      location: z.string().describe("The location's name"),
    }),
    execute: async ({ location }) => {
      // Your implementation here
      return { temperature: 72, condition: "sunny", location };
    },
  });

  const builtInAgent = new BuiltInAgent({
    model: "openai:gpt-5.4-mini",
    tools: [getWeather],
    maxSteps: 2                   //Important for tool calls
  });

  return builtInAgent;
}
// server-tools : "Defining a tool" end
