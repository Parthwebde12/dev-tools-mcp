import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { fail, ok } from "../helpers.js";

export function registerUrlParser(server: McpServer) {
  server.registerTool(
    "url_parser",
    {
      description:
        "Extract the hostname, pathname and query parameters from a URL.",
      inputSchema: z.object({
        url: z.string().min(1).describe("A full URL, e.g. https://example.com/a?b=1"),
      }),
    },
    async ({ url }) => {
      let parsed: URL;
      try {
        parsed = new URL(url);
      } catch {
        return fail(
          `"${url}" is not a valid absolute URL. Include the scheme, e.g. https://example.com`,
        );
      }

      const queryParams: Record<string, string | string[]> = {};
      for (const [key, value] of parsed.searchParams) {
        const existing = queryParams[key];
        if (existing === undefined) {
          queryParams[key] = value;
        } else if (Array.isArray(existing)) {
          existing.push(value);
        } else {
          queryParams[key] = [existing, value];
        }
      }

      return ok(
        JSON.stringify(
          {
            protocol: parsed.protocol,
            hostname: parsed.hostname,
            port: parsed.port,
            pathname: parsed.pathname,
            queryParams,
            hash: parsed.hash,
          },
          null,
          2,
        ),
      );
    },
  );
}