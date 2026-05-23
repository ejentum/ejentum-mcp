# OpenAI Agents SDK + Ejentum Reasoning Harness

Connects an OpenAI Agents SDK `Agent` to the hosted [Ejentum](https://ejentum.com) cognitive harness over the Streamable HTTP transport (`https://api.ejentum.com/mcp`) with bearer auth. The agent decides when to call one of the four `harness_*` tools (`harness_reasoning`, `harness_code`, `harness_anti_deception`, `harness_memory`) to retrieve a task-matched cognitive scaffold the model reads internally before producing its user-facing answer.

The OpenAI Agents SDK has first-class MCP support, so no wrapper package is needed: just point `MCPServerStreamableHttp` at the hosted endpoint and add bearer auth via the `headers` field.

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
- `EJENTUM_API_KEY` set for the harness server. Free and paid tiers at <https://ejentum.com/pricing>.

## What the example does

1. Configures `MCPServerStreamableHttp` with the hosted MCP URL and bearer-auth headers.
2. Creates an `Agent` with instructions that route to `harness_reasoning` for analytical planning and to `harness_anti_deception` when a prompt pressures a fast conclusion.
3. Runs a representative prompt: "we have a 50M-row users table and want to add a NOT NULL column with a backfilled default; recommend a specific migration path." The agent calls the appropriate harness tool, reads the scaffold internally, then returns its user-facing recommendation.
4. Traces are visible at the URL printed at the start of the run.

## Reusing the wiring for any authenticated streamable-HTTP MCP server

To repoint this example at a different authenticated streamable-HTTP MCP server, change `EJENTUM_MCP_URL` and the `headers` dict in `main.py`. The rest of the wiring (retry config, session timeouts, agent + Runner) is reusable.

## Related

- Source repo: <https://github.com/ejentum/ejentum-mcp>
- npm install for stdio clients: `npx -y ejentum-mcp`
- 12 native framework integrations on PyPI / npm if you prefer language-native imports over MCP: see the main repo README.
- Docs: <https://ejentum.com/docs/api_reference>
