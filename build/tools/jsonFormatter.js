"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerJsonFormatter = registerJsonFormatter;
const zod_1 = require("zod");
const helpers_js_1 = require("../helpers.js");
function registerJsonFormatter(server) {
    server.registerTool("json_formatter", {
        description: "Validate a JSON string and return it pretty-printed.",
        inputSchema: zod_1.z.object({
            json: zod_1.z.string().min(1).describe("The JSON text to validate and format"),
            indent: zod_1.z
                .number()
                .int()
                .min(0)
                .max(8)
                .default(2)
                .describe("Spaces per indentation level (0-8, default 2)"),
        }),
    }, async ({ json, indent }) => {
        try {
            const parsed = JSON.parse(json);
            return (0, helpers_js_1.ok)(JSON.stringify(parsed, null, indent));
        }
        catch (error) {
            return (0, helpers_js_1.fail)(`Invalid JSON. ${(0, helpers_js_1.errorMessage)(error)}`);
        }
    });
}
