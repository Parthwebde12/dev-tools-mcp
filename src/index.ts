import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { registerJsonFormatter } from "./tools/jsonFormatter.js";
import { registerRegexTester } from "./tools/regexTester.js";
import { registerTimestampConverter } from "./tools/timestampConverter.js";
import { registerUrlParser } from "./tools/urlParser.js";

function createServer(): McpServer {
  const server = new McpServer({
    name: "dev-utils",
    version: "1.0.0",
  });

  registerJsonFormatter(server);
  registerRegexTester(server);
  registerTimestampConverter(server);
  registerUrlParser(server);

  return server;
}

serveStdio(createServer, {
  onerror: (error) => console.error("dev-utils MCP server error:", error),
});


console.error("dev-utils MCP server running on stdio");