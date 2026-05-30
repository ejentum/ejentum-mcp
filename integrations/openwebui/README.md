# Open WebUI integration

A single-file Python tool that exposes the eight Ejentum cognitive harness tools as agent-callable tools inside [Open WebUI](https://openwebui.com).

## What it gives the agent

Eight tools the agent can call when a task matches their trigger conditions. Four dynamic tools are available on all tiers including the 30-day free trial; four adaptive tools (an adapter LLM rewrites the matched operation with task-specific identifiers, ~2-3 s extra latency) require Go or Super tier.

### Dynamic (all tiers)

| Method | When the agent should call it |
|---|---|
| `reasoning` | Analytical, diagnostic, planning, multi-step questions; root-cause analysis; architecture decisions |
| `code` | Code generation, refactoring, review, debugging; algorithm or data-structure choices |
| `anti_deception` | Prompts that pressure the agent to validate, certify, or soften an honest assessment |
| `memory` | Sharpening an observation already formed about cross-turn drift |

### Adaptive (Go or Super tier)

| Method | When to prefer over the dynamic version |
|---|---|
| `adaptive_reasoning` | High-stakes analytical work where every DAG node should be mapped to the specifics before generation |
| `adaptive_code` | Security-critical reviews, refactor-heavy diffs, or any code work where every verification step should be concretized |
| `adaptive_anti_deception` | When the stakes of a soft or sycophantic answer are high |
| `adaptive_memory` | When the dynamic `memory` operation is not sharp enough for the specific perception being formed |

Each call retrieves a task-matched cognitive operation from Ejentum's library of 679. The agent reads the returned structured procedure plus the executable reasoning topology DAG, then generates its response shaped by both.

Open WebUI uses the public method name as the LLM-visible tool name. Python identifiers cannot contain hyphens, so the methods above use underscores (`anti_deception`, `adaptive_anti_deception`); the on-wire API mode strings (sent in the POST body) stay hyphenated.

## Install

1. In Open WebUI, go to **Workspace → Tools → +** (or **Admin Panel → Tools** for global install).
2. Paste the contents of [`ejentum_harness.py`](./ejentum_harness.py) into the editor.
3. Save. The eight tools appear in your tool palette.
4. Click the tool's **gear icon** to open Valves. Set `api_key` to your `EJENTUM_API_KEY`. Get one at <https://ejentum.com/pricing> (30-day free trial; Go or Super tier required for adaptive tools).

Alternatively, import via URL: in the Tools workspace, click **Import → Import from URL** and paste:

```
https://raw.githubusercontent.com/ejentum/ejentum-mcp/main/integrations/openwebui/ejentum_harness.py
```

## Configuration

| Valve | Default | Notes |
|---|---|---|
| `api_key` | (empty) | Required. Bearer token for the Ejentum API. |
| `api_url` | `https://api.ejentum.com/harness/` | Override only if you self-host. |
| `timeout_seconds` | `10` | Per-call HTTP timeout. |

## More

- Project: <https://github.com/ejentum/ejentum-mcp> (MIT)
- Pricing: <https://ejentum.com/pricing>
- Walkthrough: <https://ejentum.com/docs/claude_code_guide>
- "Under Pressure" research paper: <https://doi.org/10.5281/zenodo.19392715>
