/**
 * Logic API HTTP wrapper. Centralizes the bracket-access hyphen handling
 * so the `anti-deception` field name cannot silently break via dot access.
 */

const DEFAULT_API_URL = "https://ejentum-main-ab125c3.zuplo.app/logicv1/";

export type HarnessMode = "reasoning" | "code" | "anti-deception" | "memory";

export class LogicAPIError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: string,
    message: string,
  ) {
    super(message);
    this.name = "LogicAPIError";
  }
}

interface LogicAPIResponseItem {
  [key: string]: string;
}

export async function callHarness(
  query: string,
  mode: HarnessMode,
): Promise<string> {
  const apiKey = process.env.EJENTUM_API_KEY;
  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error(
      "EJENTUM_API_KEY is not set. Set it in your MCP client config (env block) and restart the client.",
    );
  }

  const apiUrl = process.env.EJENTUM_API_URL || DEFAULT_API_URL;

  let response: Response;
  try {
    response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, mode }),
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    throw new Error(`Network error calling Ejentum API at ${apiUrl}: ${detail}`);
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    if (response.status === 401) {
      throw new LogicAPIError(
        401,
        body,
        "Unauthorized (401): check your EJENTUM_API_KEY value. Get one at https://ejentum.com/dashboard.",
      );
    }
    if (response.status === 403) {
      throw new LogicAPIError(
        403,
        body,
        "Forbidden (403): your API key does not have access to this mode. Multi modes require the Haki tier.",
      );
    }
    if (response.status === 429) {
      throw new LogicAPIError(
        429,
        body,
        "Rate limit exceeded (429): you have hit your tier's request limit. See https://ejentum.com/pricing.",
      );
    }
    throw new LogicAPIError(
      response.status,
      body,
      `Ejentum API returned ${response.status}: ${body.slice(0, 200)}`,
    );
  }

  let parsed: unknown;
  try {
    parsed = await response.json();
  } catch {
    throw new Error("Ejentum API returned invalid JSON");
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error(
      `Ejentum API returned unexpected shape (expected non-empty array): ${JSON.stringify(parsed).slice(0, 200)}`,
    );
  }

  const item = parsed[0] as LogicAPIResponseItem;

  // Bracket access is required because the `anti-deception` field name contains a hyphen.
  // Dot access (item.anti-deception) would parse as `item.anti - deception` and silently break.
  const injection = item[mode];

  if (typeof injection !== "string" || injection.length === 0) {
    throw new Error(
      `Ejentum API response missing or empty "${mode}" field. Got: ${JSON.stringify(item).slice(0, 200)}`,
    );
  }

  return injection;
}
