# ejentum-mcp — LLM install instructions

This file is read by LLM-driven MCP installers (e.g. [Cline](https://github.com/cline/cline)) to configure the ejentum-mcp server automatically. Follow exactly.

## What this server is

`ejentum-mcp` exposes eight tools that return a task-matched cognitive operation (a structured procedure plus an executable reasoning topology DAG) for the calling LLM to read before producing its reply.

Four dynamic tools (available on all tiers including the 30-day free trial):

- `reasoning`: planning, root-cause diagnostics, tradeoff weighing
- `code`: writing, refactoring, reviewing, debugging code
- `anti-deception`: resisting pressure to validate dubious claims, soften honest assessments, or capitulate to authority appeals
- `memory`: sharpening an observation already formed about cross-turn drift

Four adaptive tools (Go or Super tier required; an adapter LLM rewrites the matched operation with task-specific identifiers, adds ~2-3 s of latency):

- `adaptive-reasoning`
- `adaptive-code`
- `adaptive-anti-deception`
- `adaptive-memory`

## Prerequisite: API key

Before configuring the server, ask the user for their Ejentum API key. If they do not have one:

1. Tell them: "You need an Ejentum API key. Sign up at https://ejentum.com/pricing (30-day free trial, no card; adaptive tools require Go or Super tier)."
2. Wait for them to paste the key.

Do NOT proceed to configuration without an API key. The server will start but every tool call will return an auth error.

## Configuration: two transport options

Pick ONE. Stdio is the default for Cline.

### Option A — Stdio (default, recommended for Cline)

```json
{
  "mcpServers": {
    "ejentum": {
      "command": "npx",
      "args": ["-y", "ejentum-mcp"],
      "env": {
        "EJENTUM_API_KEY": "PASTE_USERS_KEY_HERE"
      }
    }
  }
}
```

Requires Node.js 18+ on the user's machine. Cline will spawn the server as a subprocess on demand.

### Option B — Hosted HTTPS (no local install)

```json
{
  "mcpServers": {
    "ejentum": {
      "url": "https://api.ejentum.com/mcp",
      "transport": "streamable-http",
      "headers": {
        "Authorization": "Bearer PASTE_USERS_KEY_HERE"
      }
    }
  }
}
```

No npm install, no subprocess. Pick this if the user does not have Node.js or prefers a hosted endpoint.

## Post-install verification

After restarting Cline (or reloading MCP servers), confirm the eight tools registered. Ask the user to invoke a smoke test, for example:

> "Use the `reasoning` tool to think through whether to refactor an auth module before adding OAuth."

The model should call `reasoning` with a one-sentence framing, receive a structured cognitive operation, and produce a response shaped by it. If the tool returns an auth error, the API key was not set correctly: recheck the `EJENTUM_API_KEY` env var (Option A) or the `Authorization` header (Option B).

## Routing notes for the calling LLM

Once installed, these tools should fire only on non-trivial tasks. Do NOT call for simple lookups, syntax questions, or file reads. Prefer the dynamic tool (`reasoning`, `code`, `anti-deception`, `memory`) by default; reach for the adaptive variant (`adaptive-*`) when the stakes are high or the dynamic version's general operation would be too generic for the specific task. The README at https://github.com/ejentum/ejentum-mcp documents the trigger patterns per tool in the Tool inventory section.

## Troubleshooting

- **`EJENTUM_API_KEY` not set:** server starts but tool calls fail with auth error. Set the env var in the `env` block above (stdio) or the `Authorization` header (hosted).
- **`npx` command not found:** Node.js is not installed. Install Node 18+ from https://nodejs.org, then retry. Or switch to Option B (hosted HTTPS) which has no local-runtime requirement.
- **Server starts but tools do not appear in Cline:** the `mcpServers` block must be at the root of the Cline MCP config file (typically `cline_mcp_settings.json`), not nested under another key. Restart Cline after editing.
- **Adaptive tool returns 403:** the API key is on a tier that does not include adaptive (trial or unrecognised). Upgrade to Go or Super at https://ejentum.com/pricing, or use the dynamic variant of the same mode.
