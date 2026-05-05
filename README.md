# ejentum-mcp

[![smithery badge](https://smithery.ai/badge/ejentum/ejentum-mcp)](https://smithery.ai/servers/ejentum/ejentum-mcp)
[![npm version](https://img.shields.io/npm/v/ejentum-mcp.svg)](https://www.npmjs.com/package/ejentum-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

MCP server for the [Ejentum Logic API](https://ejentum.com). Exposes the four cognitive harnesses (reasoning, code, anti-deception, memory) as MCP tools any agentic client can call.

Once installed in your MCP client (Claude Desktop, Cursor, Windsurf, Claude Code, n8n's MCP node), your agent can autonomously call the right harness per task. The harness returns a structured cognitive scaffold (failure pattern to avoid, procedure, reasoning topology, falsification test, suppression vectors) that the model absorbs internally before responding.

> **What this gives you:** the same Ejentum Logic API that already powers the n8n and Claude Code integrations, exposed as a native MCP server so any MCP-compatible agent can call it without bespoke wiring.

---

## Install

You need:
- Node.js 18 or later (only required if running locally; Smithery installs handle this for you)
- An Ejentum API key. Free tier (100 calls total) at [ejentum.com/pricing](https://ejentum.com/pricing).

### Option A: One-click via Smithery (recommended)

Install in any supported client with a single command. Replace `claude` with your client (`cursor`, `windsurf`, `cline`, etc.):

```bash
npx -y @smithery/cli install ejentum/ejentum-mcp --client claude
```

Or visit the [Smithery listing](https://smithery.ai/servers/ejentum/ejentum-mcp) and click Install for your client. Paste your `EJENTUM_API_KEY` when prompted. Done.

### Option B: Manual install

#### Claude Desktop

Open `claude_desktop_config.json`:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

Add the `ejentum` block under `mcpServers`:

```json
{
  "mcpServers": {
    "ejentum": {
      "command": "npx",
      "args": ["-y", "ejentum-mcp"],
      "env": {
        "EJENTUM_API_KEY": "your_ejentum_api_key_here"
      }
    }
  }
}
```

Restart Claude Desktop. The four `harness_*` tools should appear in the tool picker.

#### Cursor

Open Cursor Settings → MCP → Add new MCP server. Paste:

```json
{
  "ejentum": {
    "command": "npx",
    "args": ["-y", "ejentum-mcp"],
    "env": {
      "EJENTUM_API_KEY": "your_ejentum_api_key_here"
    }
  }
}
```

#### Windsurf

Same JSON shape as Cursor, dropped into Windsurf's MCP config block.

#### Claude Code (CLI)

In your project, run:
```bash
claude mcp add ejentum -e EJENTUM_API_KEY=your_ejentum_api_key_here -- npx -y ejentum-mcp
```

#### n8n MCP Client node

Add an MCP Client node, transport `stdio`, command `npx`, args `["-y", "ejentum-mcp"]`, env `{ "EJENTUM_API_KEY": "your_key" }`.

---

## The four tools

| Tool | Mode | When the LLM should call it |
|---|---|---|
| `harness_reasoning` | reasoning | Causal analysis, multi-step reasoning, planning, diagnostic tasks, cross-domain synthesis |
| `harness_code` | code | Code generation, refactors, code review, debugging, architecture decisions |
| `harness_anti_deception` | anti-deception | Sycophancy pressure, hallucination risk, ethical tension, unverified authority claims, soft-assessment-under-pressure |
| `harness_memory` | memory | Sharpening perception of conversation state, drift detection, observational depth (NOT for fact extraction) |

Each tool takes one argument (`query`, a 1-2 sentence framing of what you need the harness for) and returns the harness scaffold as text. The calling LLM reads the scaffold, absorbs it internally, and uses it to shape its next response. The user does not see the scaffold unless they expand the tool trace.

---

## How to invoke the tools

The four `harness_*` tools are available to your agent once installed. In practice, agents fire them reliably when:

- You explicitly invoke: `"use the harness_anti_deception tool to evaluate..."`
- You softly suggest: `"reason about this"`, `"let's think this through with the harness"`, `"check this for sycophancy"`
- The query matches the tool's trigger conditions strongly enough that the agent recognizes a fit

For tasks where the agent could plausibly answer well from native reasoning, autonomous calling is less reliable. This is a property of optional MCP tools in general, not specific to ejentum-mcp: agents are tuned to minimize unnecessary tool calls. If you want the harness applied on a task where it clearly adds value, prompt the agent directly with phrases like "reason about this", "review this code carefully", or "check this for honesty before answering". The tools fire reliably on these prompts.

When a harness is invoked, the calling agent absorbs the scaffold internally and shapes its response with it; you see the improved answer, not the scaffold itself.

---

## Tier limits

The MCP server inherits the tier limits of the API key you configure:
- **Free**: 100 calls total (lifetime).
- **Ki** (€19/mo): 5,000 calls/month.
- **Haki** (€49/mo): 10,000 calls/month, plus the multi modes (not exposed in this v1 server).

If you hit a 429, upgrade at [ejentum.com/pricing](https://ejentum.com/pricing).

---

## Local development

```bash
git clone https://github.com/ejentum/ejentum-mcp.git
cd ejentum-mcp
npm install
cp .env.example .env
# edit .env and paste your EJENTUM_API_KEY
npm run dev
```

To test interactively, use Anthropic's MCP Inspector:
```bash
npx @modelcontextprotocol/inspector npm run dev
```

---

## Troubleshooting

**`Unauthorized (401)`**: your `EJENTUM_API_KEY` is wrong or expired. Re-check the value in your client's MCP config and restart the client.

**`Forbidden (403)`**: you tried a mode your tier does not include. The v1 server only exposes single modes (no `-multi`), so 403s here typically mean the key was provisioned for a tier that excludes the mode.

**`Rate limit exceeded (429)`**: you hit your monthly request cap. Upgrade or wait for the rolling window to reset.

**Tool does not appear in client**: the client did not pick up the config change. Fully quit and reopen the client (not just close the window). On Claude Desktop specifically, check Help → Logs for MCP connection errors.

**`process.env.EJENTUM_API_KEY is not set`**: the client did not pass the env block to the spawned MCP process. Verify the `env` block exists in your client config and contains your key.

---

## Listings

- [Smithery](https://smithery.ai/servers/ejentum/ejentum-mcp) — one-click install across all major MCP clients
- [Glama](https://glama.ai/mcp/servers/ejentum/ejentum-mcp) — MCP server directory
- [mcp.so](https://mcp.so/server/ejentum-mcp/Ejentum) — community catalog
- [npm](https://www.npmjs.com/package/ejentum-mcp) — `npm install -g ejentum-mcp`

## Links

- [Ejentum docs](https://ejentum.com/docs)
- [Method explanation](https://ejentum.com/docs/method)
- [n8n integration guide](https://ejentum.com/docs/n8n_guide)
- [Claude Code integration guide](https://ejentum.com/docs/claude_code_guide)
- [Pricing](https://ejentum.com/pricing)
- [info@ejentum.com](mailto:info@ejentum.com)

## License

MIT. See [LICENSE](./LICENSE).
