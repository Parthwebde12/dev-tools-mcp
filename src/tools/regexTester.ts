import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { errorMessage, fail, ok } from "../helpers.js";

export function registerRegexTester(server: McpServer) {
  server.registerTool(
    "regex_tester",
    {
      description:
        "Test a regular expression against a string and return all matches.",
      inputSchema: z.object({
        pattern: z.string().min(1).describe("Regex pattern, without slashes"),
        text: z.string().describe("The text to test the pattern against"),
        flags: z
          .string()
          .regex(/^[dgimsuvy]*$/, "Flags may only contain: d g i m s u v y")
          .default("")
          .describe("Optional regex flags, e.g. 'gi'"),
      }),
    },
    async ({ pattern, text, flags }) => {
      try {
        const allFlags = flags.includes("g") ? flags : flags + "g";
        const regex = new RegExp(pattern, allFlags);

        const matches = [...text.matchAll(regex)].map((m) => ({
          match: m[0],
          index: m.index,
          groups: m.slice(1),
        }));

        return ok(
          JSON.stringify(
            { matched: matches.length > 0, count: matches.length, matches },
            null,
            2,
          ),
        );
      } catch (error) {
        return fail(`Invalid regular expression. ${errorMessage(error)}`);
      }
    },
  );
}