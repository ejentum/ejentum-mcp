# OpenAI Agents SDK + Ejentum Reasoning Harness

Connects an OpenAI Agents SDK `Agent` to the hosted Ejentum MCP server over Streamable HTTP (`https://api.ejentum.com/mcp`) with bearer auth. The agent decides when to call one of the eight tools (four dynamic, four adaptive) to retrieve a task-matched cognitive operation; the model reads the returned injection internally before producing its response.

The OpenAI Agents SDK has first-class MCP support, so no wrapper package is needed: point `MCPServerStreamableHttp` at the hosted endpoint and add bearer auth via the `headers` field.

## Run it

```bash
uv run python examples/openai-agents-python/main.py
```

Or with pip:

```bash
pip install openai-agents
python examples/openai-agents-python/main.py
```

## Prerequisites

- `OPENAI_API_KEY` set for the model calls.
- `EJENTUM_API_KEY` set for the harness server. Get one at <https://ejentum.com/pricing>. The 30-day free trial covers all dynamic tools; adaptive tools require Go or Super tier.

## What the example does

1. Configures `MCPServerStreamableHttp` with the hosted MCP URL and bearer-auth headers.
2. Creates an `Agent` whose instructions enumerate the eight tools (four dynamic plus four adaptive) and describe when each should be called.
3. Runs a representative prompt about a 50M-row users-table NOT NULL migration. The agent typically routes to `reasoning` (or `adaptive-reasoning` if it judges the stakes high) for the planning step, and may route to `anti-deception` if the prompt framing pressures a fast conclusion.
4. Traces are visible at the URL printed at the start of the run.

## Tool inventory exposed by the MCP server

| Tool | Tier | Description (LLM-visible, abbreviated) |
|---|---|---|
| `reasoning` | all | Analytical, diagnostic, planning, multi-step tasks across 311 operations. |
| `code` | all | Code generation, refactoring, review, debugging across 128 operations. |
| `anti-deception` | all | Pressure-to-validate / sycophancy / hallucination across 139 operations. |
| `memory` | all | Cross-turn drift perception across 101 operations (filter-oriented). |
| `adaptive-reasoning` | Go or Super | `reasoning` + adapter LLM rewrites procedure and topology DAG for the task. |
| `adaptive-code` | Go or Super | `code` + same adapter step. |
| `adaptive-anti-deception` | Go or Super | `anti-deception` + same adapter step. |
| `adaptive-memory` | Go or Super | `memory` + same adapter step. |

Each tool takes one parameter, `query: str` (1-2 sentences describing the task). Returns the injection as text.

## Reusing the wiring for any authenticated streamable-HTTP MCP server

To repoint this example at a different authenticated streamable-HTTP MCP server, change `EJENTUM_MCP_URL` and the `headers` dict in `main.py`. The rest of the wiring (retry config, session timeouts, agent + Runner) is reusable.

## Related

- Source repo: <https://github.com/ejentum/ejentum-mcp>
- Full wire contract, field structure, DAG syntax, and a canonical dynamic-vs-adaptive comparison: [ejentum-mcp README](https://github.com/ejentum/ejentum-mcp#wire-contract).
- npm install for stdio clients: `npx -y ejentum-mcp`.
- 12 native framework integrations on PyPI / npm for callers who prefer language-native imports over MCP: see the main repo README.
- Docs: <https://ejentum.com/docs/api_reference>.
