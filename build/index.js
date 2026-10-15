"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@modelcontextprotocol/server");
const stdio_1 = require("@modelcontextprotocol/server/stdio");
const jsonFormatter_js_1 = require("./tools/jsonFormatter.js");
const regexTester_js_1 = require("./tools/regexTester.js");
const timestampConverter_js_1 = require("./tools/timestampConverter.js");
const urlParser_js_1 = require("./tools/urlParser.js");
function createServer() {
    const server = new server_1.McpServer({
        name: "dev-utils",
        version: "1.0.0",
    });
    (0, jsonFormatter_js_1.registerJsonFormatter)(server);
    (0, regexTester_js_1.registerRegexTester)(server);
    (0, timestampConverter_js_1.registerTimestampConverter)(server);
    (0, urlParser_js_1.registerUrlParser)(server);
    return server;
}
(0, stdio_1.serveStdio)(createServer, {
    onerror: (error) => console.error("dev-utils MCP server error:", error),
});
console.error("dev-utils MCP server running on stdio");
