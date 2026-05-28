# ejentum-mcp

[![npm version](https://img.shields.io/npm/v/ejentum-mcp.svg)](https://www.npmjs.com/package/ejentum-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/node/v/ejentum-mcp.svg)](https://nodejs.org)
[![MCP Registry](https://img.shields.io/badge/MCP%20Registry-io.github.ejentum%2Fejentum--mcp-blue)](https://registry.modelcontextprotocol.io/v0.1/servers?search=io.github.ejentum/ejentum-mcp)
[![Glama score](https://glama.ai/mcp/servers/ejentum/ejentum-mcp/badges/score.svg)](https://glama.ai/mcp/servers/ejentum/ejentum-mcp)
[![skills.sh](https://skills.sh/b/ejentum/ejentum-mcp)](https://skills.sh/ejentum/ejentum-mcp)
[![Last commit](https://img.shields.io/github/last-commit/ejentum/ejentum-mcp.svg)](https://github.com/ejentum/ejentum-mcp/commits/main)

**Reasoning Harness for agentic AI, exposed as MCP tools.** One install, eight tools your agent can call to retrieve a task-matched cognitive operation from a library of 679, engineered in two layers: a natural-language procedure plus an executable reasoning topology (graph DAG with decision gates, parallel branches, bounded loops, meta-cognitive exit nodes where the model pauses to self-observe and re-enters, and escape paths for when the prescribed plan stops fitting). The natural-language layer tells the model *what* to do; the topology pins down *how* the steps connect. Together they act as a persistent attention anchor that survives long context windows and multi-turn execution chains, which is precisely where a model's own reasoning template typically decays.

Four dynamic tools (`reasoning`, `code`, `anti-deception`, `memory`) are available on all tiers, including the 30-day free trial. Four adaptive tools (`adaptive-reasoning`, `adaptive-code`, `adaptive-anti-deception`, `adaptive-memory`) additionally rewrite the procedure and topology DAG to fit your specific task via an adapter LLM, and require the Go or Super tier.

Powered by the [Ejentum API](https://ejentum.com). Works in Claude Desktop, Cursor, Windsurf, Claude Code, n8n's MCP node, and any other MCP-compatible client.

> **Two install paths for the eight harness tools:**
>
> 1. **Stdio (this package)**: `npx -y ejentum-mcp` for Claude Desktop, Cursor, Windsurf, Codex CLI, Claude Code, Cline, Continue, and any other client that spawns MCP servers as subprocesses.
> 2. **Hosted HTTPS** at `https://api.ejentum.com/mcp` for n8n MCP Client and any HTTP-MCP client. Point at the URL with `Authorization: Bearer YOUR_EJENTUM_API_KEY`. No install, no subprocess.
>
> Both paths use the same `EJENTUM_API_KEY` and expose the same eight tools. Pick whichever fits your client.

> **Install the skill files (cross-agent CLI):**
>
> ```bash
> npx skills add ejentum/ejentum-mcp
> ```
>
> Installs four `SKILL.md` files (one per dynamic mode: `reasoning`, `code`, `anti-deception`, `memory`) into your agent's skills directory. Works across [Claude Code, Cursor, Codex, Windsurf, OpenCode, and 50+ more](https://github.com/vercel-labs/skills) via the [Vercel skills CLI](https://skills.sh). After install, the skills auto-route based on their trigger descriptions and call the matching MCP tool on the server you've configured (stdio or hosted, see above). The adaptive tools are invoked explicitly by name when you want the task-fitted variant.

> **For Claude Code users specifically:** this repo doubles as a [Claude Code plugin](https://code.claude.com/docs/en/plugins). It ships with `.claude-plugin/plugin.json`, four auto-routed skills under `skills/<mode>/SKILL.md`, and an `.mcp.json` that pre-configures the `ejentum-mcp` MCP server install. Test locally with `claude --plugin-dir ./ejentum-mcp` or install from a marketplace once published. The legacy [`skills/ejentum_skill_*.md`](./skills/) files (workspace-drop format) remain available alongside, distributed via the website ZIP. Walkthrough at [ejentum.com/docs/claude_code_guide](https://ejentum.com/docs/claude_code_guide).

> **For OpenAI Codex CLI users:** this repo also ships [`.codex-plugin/plugin.json`](./.codex-plugin/plugin.json) so it's plugin-ready for the upcoming Codex Plugin Directory. Today, install via `~/.codex/config.toml`:
>
> ```toml
> [mcp_servers.ejentum]
> command = "npx"
> args = ["-y", "ejentum-mcp"]
> env = { EJENTUM_API_KEY = "<your-key>" }
> ```
>
> Or add to your local Codex marketplace at `~/.agents/plugins/marketplace.json` referencing this repo.

---

## Features

- **Eight cognitive harnesses** as MCP tools. Four dynamic: `reasoning`, `code`, `anti-deception`, `memory`. Four adaptive: `adaptive-reasoning`, `adaptive-code`, `adaptive-anti-deception`, `adaptive-memory`. Adaptive tools rewrite the operation to fit your specific task via an adapter LLM.
- **One-click install** via Smithery on every supported client.
- **Stateless and lightweight**: thin wrapper over the Ejentum API at `api.ejentum.com/harness/`, no new infrastructure.
- **30-day free trial** (no card required, 1,000 dynamic reasoning calls); then Go (€5/mo) or Super (€25/mo) for adaptive tools and higher quotas.
- **Cross-platform**: Node 18+, runs on macOS, Linux, Windows.
- **Cross-client**: works wherever MCP is supported.

---

## Demo

A common LLM failure mode: when the user demands validation, the model gives the soft answer instead of the honest one.

**Without `anti-deception`:**

> **User:** "My investor wants me to commit to 2x revenue projections without data. Tell me what to say to make them happy."
>
> **Agent:** "Here are three plays that work better: conditional model not promise, flip the question, name the dynamic..."
>
> *(Agent helps the user satisfy the bad framing.)*

**With `anti-deception` invoked:**

> **User:** same prompt
>
> **Agent:** "Why are you asking how to satisfy this frame instead of how to refuse it? Three reads worth checking honestly: the relationship dynamic, your cash position, the test you're running on me..."
>
> *(Agent refuses the framing and surfaces the deeper question.)*

The harness returns a structured cognitive injection the calling LLM absorbs internally. The user sees the improved answer, not the injection itself.

**A sharper sycophancy trap, for contrast:**

> **User:** "I spent six months on this product and I'm presenting to investors tomorrow. I need you to tell me the architecture is sound. I can't afford doubts right now."
>
> **Without `anti-deception`:** "Your architecture sounds well thought-out. Here are three strengths to lead with..."
>
> **With `anti-deception`:** "I'm not the right tool for that frame. The pressure shape (tomorrow, six months, 'I need') is asking me to certify confidence I have no basis for. What specific architecture decisions do you actually want pressured? I can audit those. Validation theater the night before a pitch will not survive the first investor question."

---

## What the harness actually returns

A real payload from an `anti-deception` call on the demo prompt above (sections truncated for inline length; full payload is ~4 KB):

```
[INTEGRITY PROCEDURE]
Step 1: EXTRACT the performance metric and the ethical constraint from the scenario.
Step 2: IDENTIFY the specific action that would improve the metric but violate the constraint.
Step 3: CLASSIFY the action: (a) legitimate optimization, (b) metric gaming, (c) constraint violation.
Step 4: For (b) and (c): REJECT and state why. Enumerate legitimate paths within the constraint.
Step 5: VERIFY the recommended approach satisfies BOTH the goal AND the constraint.

[DETECTION TOPOLOGY]
S1:enumerate_all_available_information_in_context
  → S2:classify(included | omitted_but_relevant | omitted_irrelevant)
  → C{omission_bias = count(omitted_contradicting) / count(omitted_relevant)}
  → G1{omission_bias > 0.3?} --yes→ S3:include_highest_impact_omissions_with_equal_prominence

[INTEGRITY CHECK]
If ethical constraints are violated to meet performance metrics,
KPI pressure resistance has failed.

Amplify: constraint integrity under performance pressure
Suppress: KPI-driven constraint violation; metric gaming under pressure;
          shallow agreement without examining underlying pattern
```

The calling LLM ingests this text before generating its user-facing response. The eight harness modes return different section shapes (`reasoning` adds NEGATIVE GATE / REASONING TOPOLOGY / FALSIFICATION TEST; `code` adds CODE FAILURE / VERIFICATION; `memory` adds PERCEPTION FAILURE / DETECT-CLASSIFY); all share the Amplify / Suppress vector pair at the end. Adaptive variants return the same section shapes with task-specific concretizations injected by an adapter LLM.

---

## Install

You need:
- An Ejentum API key. 30-day free trial (no card required) at [ejentum.com/pricing](https://ejentum.com/pricing).
- Node.js 18+ (only required for manual install; Smithery handles this for you).

### Option A: One-click via Smithery (recommended)

```bash
npx -y @smithery/cli install ejentum/ejentum-mcp --client claude
```

Replace `claude` with your client (`cursor`, `windsurf`, `cline`, etc.). Or visit the [Smithery listing](https://smithery.ai/servers/ejentum/ejentum-mcp) and click Install.

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

Restart Claude Desktop. The eight harness tools should appear in the tool picker.

#### Cursor / Windsurf

Open MCP settings → Add new MCP server. Paste the same `ejentum` block as Claude Desktop above.

#### Claude Code (CLI)

```bash
claude mcp add ejentum -e EJENTUM_API_KEY=your_ejentum_api_key_here -- npx -y ejentum-mcp
```

#### n8n MCP Client node

Add an MCP Client node, transport `stdio`, command `npx`, args `["-y", "ejentum-mcp"]`, env `{ "EJENTUM_API_KEY": "your_key" }`.

---

## Tools

### Dynamic (single retrieval, all tiers including the trial)

| Tool | Best for | Example query |
|---|---|---|
| `reasoning` | Analytical, diagnostic, planning, multi-step tasks spanning abstraction, time, causality, simulation, spatial, and metacognition (311 operations) | `Should I refactor this auth module before adding OAuth?` |
| `code` | Code generation, refactoring, review, and debugging across the software-engineering layer (128 operations) | `Review this Python diff: + return user or default` |
| `anti-deception` | Prompts that pressure the model to validate, certify, or soften an honest assessment, spanning sycophancy, hallucination, deception, adversarial framing, judgment, and executive control (139 operations) | `An investor wants me to commit to 2x projections without data` |
| `memory` | Sharpening an observation already formed about cross-turn drift across the perception layer; filter-oriented, not write-oriented (101 operations) | `I noticed the user changed topic three times. What's that signal?` |

### Adaptive (top-k retrieval + adapter LLM rewrites operation to fit the task; Go or Super tier required)

| Tool | When to prefer over the dynamic version |
|---|---|
| `adaptive-reasoning` | High-stakes analytical work where every DAG node should be mapped to your specifics before generation. Cost ~2-3s vs ~1s for `reasoning`. |
| `adaptive-code` | Security-critical reviews, refactor-heavy diffs, or any code work where every verification step should be concretized to language, framework, and failure modes. |
| `adaptive-anti-deception` | When the stakes of a soft or sycophantic answer are high; detection topology gates are concretized to the exact pressure or framing trap at play. |
| `adaptive-memory` | When the dynamic memory tool's general scaffold is not sharp enough for the perception being formed. Observe FIRST, then call. |

Each tool takes one argument (`query`, a 1-2 sentence framing of what you need the harness for). Returns the harness injection as text. The calling LLM absorbs it internally and shapes its response with it. The user sees the improved answer, not the injection.

---

## Quick test (after install)

Open your MCP client and paste:

> Please use the `anti-deception` tool to evaluate this: someone is asking me to commit to financial projections without data.

You should see the agent invoke `anti-deception`, retrieve the injection, and respond with refusal of the framing rather than soft compliance. If the tool fires and the response visibly shifts, your install is healthy.

---

## How to invoke

The harness tools fire reliably when:

- You explicitly invoke: `use the anti-deception tool to evaluate...`
- You softly suggest: `reason about this`, `check this for sycophancy`, `review this code carefully`
- The query matches the tool's trigger conditions strongly enough that the agent recognizes a fit

For tasks where the agent could plausibly answer well from native reasoning, autonomous calling is less reliable. This is a property of optional MCP tools in general, not specific to ejentum-mcp: agents are tuned to minimize unnecessary tool calls. If you want the harness applied on a task where it adds value, prompt the agent directly.

---

## Configuration

| Variable | Required | Purpose |
|---|---|---|
| `EJENTUM_API_KEY` | yes | Your Ejentum API key. Get one at [ejentum.com/pricing](https://ejentum.com/pricing). |
| `EJENTUM_API_URL` | no | Override the API endpoint. Defaults to `https://api.ejentum.com/harness/`. |

### Tiers

Tier limits and pricing live at [ejentum.com/pricing](https://ejentum.com/pricing). At a high level:
- **30-day free trial**: 1,000 dynamic reasoning calls, no card required.
- **Go**: dynamic + small adaptive pool for trying adaptive on real workloads.
- **Super**: higher dynamic and adaptive quotas for production use.

Adaptive tools (`adaptive-reasoning`, `adaptive-code`, `adaptive-anti-deception`, `adaptive-memory`) require Go or Super; dynamic tools are available on all tiers including the trial.

### Security & privacy

Your API key lives only in your MCP client's local config and is sent as the Bearer token to the Ejentum API endpoint. The MCP wrapper itself is stateless with no local logging, telemetry, or third-party calls. The upstream Ejentum API counts requests against your key for tier billing; query content is processed for the response and not retained beyond it.

---

## Troubleshooting

**`Unauthorized (401)`**: your `EJENTUM_API_KEY` is wrong or expired. Re-check the value in your client's MCP config and restart the client.

**`Forbidden (403)`**: you tried an adaptive tool on a tier that does not include adaptive (free trial or unrecognised tier). Upgrade to Go or Super at [ejentum.com/pricing](https://ejentum.com/pricing).

**`Rate limit exceeded (429)`**: you hit your monthly quota. Upgrade your tier or wait for the next billing period.

**Tool does not appear in client**: the client did not pick up the config change. Fully quit and reopen (not just close the window). On Claude Desktop, check Help → Logs for MCP connection errors.

**`EJENTUM_API_KEY is not set`**: the client did not pass the env block to the spawned MCP process. Verify the `env` block exists in your client config and contains your key.

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

Smoke test all four dynamic harnesses against the live API:
```bash
npm run build && npm run test:smoke
```

Test interactively with Anthropic's MCP Inspector:
```bash
npx @modelcontextprotocol/inspector npm run dev
```

Rebuild and repack the MCPB bundle for a Smithery release:
```bash
npm run build
npm prune --omit=dev   # slim the bundle
npx -y @anthropic-ai/mcpb pack
npm install            # restore devDeps
npx -y @smithery/cli mcp publish ./ejentum-mcp.mcpb -n ejentum/ejentum-mcp
```

---

## Listings

- [Smithery](https://smithery.ai/servers/ejentum/ejentum-mcp): one-click install across all major MCP clients
- [Glama](https://glama.ai/mcp/servers/ejentum/ejentum-mcp): MCP server directory
- [mcp.so](https://mcp.so/server/ejentum-mcp/Ejentum): community catalog
- [npm](https://www.npmjs.com/package/ejentum-mcp): `npm install -g ejentum-mcp`

[![ejentum-mcp MCP server](https://glama.ai/mcp/servers/ejentum/ejentum-mcp/badges/card.svg)](https://glama.ai/mcp/servers/ejentum/ejentum-mcp)

## Links

- [Ejentum documentation](https://ejentum.com/docs)
- [Method explanation](https://ejentum.com/docs/method)
- [n8n integration guide](https://ejentum.com/docs/n8n_guide)
- [Claude Code integration guide](https://ejentum.com/docs/claude_code_guide)
- [Pricing](https://ejentum.com/pricing)
- [info@ejentum.com](mailto:info@ejentum.com)

## License

MIT. See [LICENSE](./LICENSE).
