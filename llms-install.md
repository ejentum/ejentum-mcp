# ejentum-mcp — LLM install instructions

This file is read by LLM-driven MCP installers (e.g. [Cline](https://github.com/cline/cline)) to configure the ejentum-mcp server automatically. Follow exactly.

## What this server is

`ejentum-mcp` exposes four cognitive harness tools that return a short structured scaffold (failure pattern, procedure, suppression vectors, falsification test) for the calling LLM to absorb before producing its reply:

- `harness_reasoning` — for planning, root-cause diagnostics, tradeoff weighing
- `harness_code` — for writing, refactoring, reviewing, debugging code
- `harness_anti_deception` — for resisting pressure to validate dubious claims, soften honest assessments, or capitulate to authority appeals
- `harness_memory` — for sharpening an observation already formed about cross-turn drift

## Prerequisite: API key

Before configuring the server, ask the user for their Ejentum API key. If they do not have one:

1. Tell them: "You need a free Ejentum API key. Sign up at https://ejentum.com/pricing (free tier includes 100 calls)."
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

After restarting Cline (or reloading MCP servers), confirm the four tools registered. Ask the user to invoke a smoke test, for example:

> "Use harness_reasoning to think through whether to refactor an auth module before adding OAuth."

The model should call `harness_reasoning` with a one-sentence framing, receive a structured scaffold, and produce a response shaped by it. If the tool returns an auth error, the API key was not set correctly — recheck the `EJENTUM_API_KEY` env var (Option A) or the `Authorization` header (Option B).

## Routing notes for the calling LLM

Once installed, these tools should fire only on non-trivial tasks. Do NOT call for simple lookups, syntax questions, or file reads. The README at https://github.com/ejentum/ejentum-mcp documents the trigger patterns per tool in the Tools table.

## Troubleshooting

- **`EJENTUM_API_KEY` not set:** server starts but tool calls fail with auth error. Set the env var in the `env` block above (stdio) or the `Authorization` header (hosted).
- **`npx` command not found:** Node.js is not installed. Install Node 18+ from https://nodejs.org, then retry. Or switch to Option B (hosted HTTPS) which has no local-runtime requirement.
- **Server starts but tools do not appear in Cline:** the `mcpServers` block must be at the root of the Cline MCP config file (typically `cline_mcp_settings.json`), not nested under another key. Restart Cline after editing.
