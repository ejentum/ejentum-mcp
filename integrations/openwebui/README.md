# Open WebUI integration

A single-file Python tool that exposes the four Ejentum cognitive harnesses as agent-callable tools inside [Open WebUI](https://openwebui.com).

## What it gives the agent

Four tools the agent can call when a task matches their trigger conditions:

| Tool | When the agent should call it |
|---|---|
| `harness_reasoning` | Analytical, diagnostic, planning, multi-step questions; root-cause analysis; architecture decisions |
| `harness_code` | Code generation, refactoring, review, debugging; algorithm or data-structure choices |
| `harness_anti_deception` | Prompts that pressure the agent to validate, certify, or soften an honest assessment |
| `harness_memory` | Sharpening an observation already formed about cross-turn drift |

Each call retrieves a task-matched scaffold from Ejentum's library of 679 cognitive operations engineered in natural language. The agent ingests the scaffold (failure pattern, executable procedure, suppression vectors, falsification test) and writes from it.

## Install

1. In Open WebUI, go to **Workspace → Tools → +** (or **Admin Panel → Tools** for global install).
2. Paste the contents of [`ejentum_harness.py`](./ejentum_harness.py) into the editor.
3. Save. The four tools appear in your tool palette.
4. Click the tool's **gear icon** to open Valves. Set `api_key` to your `EJENTUM_API_KEY` (free tier: 100 calls, no card, at <https://ejentum.com/pricing>).

Alternatively, import via URL: in the Tools workspace, click **Import → Import from URL** and paste:

```
https://raw.githubusercontent.com/ejentum/ejentum-mcp/main/integrations/openwebui/ejentum_harness.py
```

## Configuration

| Valve | Default | Notes |
|---|---|---|
| `api_key` | (empty) | Required. Bearer token for the Ejentum Logic API. |
| `api_url` | `https://ejentum-main-ab125c3.zuplo.app/logicv1/` | Override only if you self-host. |
| `timeout_seconds` | `10` | Per-call HTTP timeout. |

## More

- Project: <https://github.com/ejentum/ejentum-mcp> (MIT)
- Pricing & free tier: <https://ejentum.com/pricing>
- Walkthrough: <https://ejentum.com/docs/claude_code_guide>
- "Under Pressure" research paper: <https://doi.org/10.5281/zenodo.19392715>
