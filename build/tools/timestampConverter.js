"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTimestampConverter = registerTimestampConverter;
const zod_1 = require("zod");
const helpers_js_1 = require("../helpers.js");
function registerTimestampConverter(server) {
    server.registerTool("timestamp_converter", {
        description: "Convert a Unix timestamp (seconds or milliseconds) into readable dates.",
        inputSchema: zod_1.z.object({
            timestamp: zod_1.z
                .number()
                .describe("Unix timestamp in seconds or milliseconds"),
            unit: zod_1.z
                .enum(["seconds", "milliseconds"])
                .default("seconds")
                .describe("Unit of the timestamp (default: seconds)"),
            timeZone: zod_1.z
                .string()
                .default("UTC")
                .describe("IANA time zone for the local time, e.g. 'Asia/Kolkata'"),
        }),
    }, async ({ timestamp, unit, timeZone }) => {
        const ms = unit === "seconds" ? timestamp * 1000 : timestamp;
        const date = new Date(ms);
        if (Number.isNaN(date.getTime())) {
            return (0, helpers_js_1.fail)("Timestamp is out of the valid date range.");
        }
        let local;
        try {
            local = new Intl.DateTimeFormat("en-GB", {
                timeZone,
                dateStyle: "full",
                timeStyle: "long",
            }).format(date);
        }
        catch {
            return (0, helpers_js_1.fail)(`Unknown time zone "${timeZone}". Use an IANA name like "UTC" or "Asia/Kolkata".`);
        }
        return (0, helpers_js_1.ok)(JSON.stringify({ iso8601: date.toISOString(), timeZone, local, unixMs: ms }, null, 2));
    });
}
