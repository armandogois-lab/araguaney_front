/**
 * Thrown by apiFetch on non-OK responses.
 *
 * Lives in its own file (not lib/api/client.ts) because client.ts is
 * server-only — Client Components can throw/catch ApiError without
 * pulling the server-only fetch wrapper into the browser bundle.
 */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: unknown,
  ) {
    super(`API error ${status}`);
    this.name = 'ApiError';
  }
}
