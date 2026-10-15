"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ok = ok;
exports.fail = fail;
exports.errorMessage = errorMessage;
function ok(text) {
    return { content: [{ type: "text", text }] };
}
function fail(message) {
    return {
        content: [{ type: "text", text: `Error: ${message}` }],
        isError: true,
    };
}
function errorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
