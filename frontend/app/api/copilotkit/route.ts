import { createCopilotRuntimeHandler } from "@copilotkit/runtime/v2";

const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit",
  mode: "single-route",
});

export const POST = handler;
