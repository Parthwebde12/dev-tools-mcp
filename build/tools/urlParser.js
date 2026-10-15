"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUrlParser = registerUrlParser;
const zod_1 = require("zod");
const helpers_js_1 = require("../helpers.js");
function registerUrlParser(server) {
    server.registerTool("url_parser", {
        description: "Extract the hostname, pathname and query parameters from a URL.",
        inputSchema: zod_1.z.object({
            url: zod_1.z.string().min(1).describe("A full URL, e.g. https://example.com/a?b=1"),
        }),
    }, async ({ url }) => {
        let parsed;
        try {
            parsed = new URL(url);
        }
        catch {
            return (0, helpers_js_1.fail)(`"${url}" is not a valid absolute URL. Include the scheme, e.g. https://example.com`);
        }
        const queryParams = {};
        for (const [key, value] of parsed.searchParams) {
            const existing = queryParams[key];
            if (existing === undefined) {
                queryParams[key] = value;
            }
            else if (Array.isArray(existing)) {
                existing.push(value);
            }
            else {
                queryParams[key] = [existing, value];
            }
        }
        return (0, helpers_js_1.ok)(JSON.stringify({
            protocol: parsed.protocol,
            hostname: parsed.hostname,
            port: parsed.port,
            pathname: parsed.pathname,
            queryParams,
            hash: parsed.hash,
        }, null, 2));
    });
}
