export function ok(text: string) {
  return { content: [{ type: "text" as const, text }] };
}

export function fail(message: string) {
  return {
    content: [{ type: "text" as const, text: `Error: ${message}` }],
    isError: true,
  };
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}