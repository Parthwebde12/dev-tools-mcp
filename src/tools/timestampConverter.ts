import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { fail, ok } from "../helpers.js";

export function registerTimestampConverter(server: McpServer) {
  server.registerTool(
    "timestamp_converter",
    {
      description:
        "Convert a Unix timestamp (seconds or milliseconds) into readable dates.",
      inputSchema: z.object({
        timestamp: z
          .number()
          .describe("Unix timestamp in seconds or milliseconds"),
        unit: z
          .enum(["seconds", "milliseconds"])
          .default("seconds")
          .describe("Unit of the timestamp (default: seconds)"),
        timeZone: z
          .string()
          .default("UTC")
          .describe("IANA time zone for the local time, e.g. 'Asia/Kolkata'"),
      }),
    },
    async ({ timestamp, unit, timeZone }) => {
      const ms = unit === "seconds" ? timestamp * 1000 : timestamp;
      const date = new Date(ms);

      if (Number.isNaN(date.getTime())) {
        return fail("Timestamp is out of the valid date range.");
      }

      let local: string;
      try {
        local = new Intl.DateTimeFormat("en-GB", {
          timeZone,
          dateStyle: "full",
          timeStyle: "long",
        }).format(date);
      } catch {
        return fail(
          `Unknown time zone "${timeZone}". Use an IANA name like "UTC" or "Asia/Kolkata".`,
        );
      }

      return ok(
        JSON.stringify(
          { iso8601: date.toISOString(), timeZone, local, unixMs: ms },
          null,
          2,
        ),
      );
    },
  );
}