"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRegexTester = registerRegexTester;
const zod_1 = require("zod");
const helpers_js_1 = require("../helpers.js");
function registerRegexTester(server) {
    server.registerTool("regex_tester", {
        description: "Test a regular expression against a string and return all matches.",
        inputSchema: zod_1.z.object({
            pattern: zod_1.z.string().min(1).describe("Regex pattern, without slashes"),
            text: zod_1.z.string().describe("The text to test the pattern against"),
            flags: zod_1.z
                .string()
                .regex(/^[dgimsuvy]*$/, "Flags may only contain: d g i m s u v y")
                .default("")
                .describe("Optional regex flags, e.g. 'gi'"),
        }),
    }, async ({ pattern, text, flags }) => {
        try {
            const allFlags = flags.includes("g") ? flags : flags + "g";
            const regex = new RegExp(pattern, allFlags);
            const matches = [...text.matchAll(regex)].map((m) => ({
                match: m[0],
                index: m.index,
                groups: m.slice(1),
            }));
            return (0, helpers_js_1.ok)(JSON.stringify({ matched: matches.length > 0, count: matches.length, matches }, null, 2));
        }
        catch (error) {
            return (0, helpers_js_1.fail)(`Invalid regular expression. ${(0, helpers_js_1.errorMessage)(error)}`);
        }
    });
}
