import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { errorMessage, fail, ok } from "../helpers.js";

export function registerJsonFormatter(server: McpServer) {
  server.registerTool(
    "json_formatter",
    {
      description: "Validate a JSON string and return it pretty-printed.",
      inputSchema: z.object({
        json: z.string().min(1).describe("The JSON text to validate and format"),
        indent: z
          .number()
          .int()
          .min(0)
          .max(8)
          .default(2)
          .describe("Spaces per indentation level (0-8, default 2)"),
      }),
    },
    async ({ json, indent }) => {
      try {
        const parsed: unknown = JSON.parse(json);
        return ok(JSON.stringify(parsed, null, indent));
      } catch (error) {
        return fail(`Invalid JSON. ${errorMessage(error)}`);
      }
    },
  );
}