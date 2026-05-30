# AutoGen Studio integration

A drop-in [AutoGen Studio](https://microsoft.github.io/autogen/stable//user-guide/autogenstudio-user-guide/index.html) gallery JSON that exposes the eight Ejentum cognitive harness tools to AutoGen agents via MCP.

## What the agent gets

A single `McpWorkbench` wrapping the [`ejentum-mcp`](https://www.npmjs.com/package/ejentum-mcp) stdio MCP server. Inside that workbench, eight tools become callable. Four dynamic tools are available on all tiers including the 30-day free trial; four adaptive tools (an adapter LLM rewrites the matched operation with task-specific identifiers) require Go or Super tier.

### Dynamic (all tiers)

| Tool | When the agent should call it |
|---|---|
| `reasoning` | Analytical, diagnostic, planning, multi-step questions |
| `code` | Code generation, refactoring, review, debugging |
| `anti-deception` | Prompts pressuring the agent to validate or soften an honest assessment |
| `memory` | Sharpening an observation already formed about cross-turn drift |

### Adaptive (Go or Super tier)

| Tool | When to prefer over the dynamic version |
|---|---|
| `adaptive-reasoning` | High-stakes analytical work where every DAG node should be mapped to the specifics |
| `adaptive-code` | Security-critical reviews, refactor-heavy diffs |
| `adaptive-anti-deception` | When the stakes of a soft or sycophantic answer are high |
| `adaptive-memory` | When the dynamic memory operation is not sharp enough for the specific perception |

Each call retrieves a task-matched cognitive operation from a library of 679. The agent reads the returned structured procedure plus the executable reasoning topology DAG, then generates its response shaped by both.

## Install

1. Open AutoGen Studio (Gallery view).
2. Click **+ Create Gallery → Import from URL**.
3. Paste this URL:

   ```
   https://raw.githubusercontent.com/ejentum/ejentum-mcp/main/integrations/autogen-studio/gallery.json
   ```

4. After import, edit the workbench's `env.EJENTUM_API_KEY` value to your actual key. Get a key at <https://ejentum.com/pricing> (30-day free trial; Go or Super tier required for adaptive tools).
5. Add the workbench to any team in your AutoGen Studio session. The eight tools appear in the team's tool palette.

## Verifying the gallery JSON locally

```bash
python -c "import json; json.load(open('gallery.json')); print('valid JSON')"
```

You can also import it into AutoGen Studio via the file picker (`Import from File`) if you want to test locally first.

## More

- Project: <https://github.com/ejentum/ejentum-mcp> (MIT)
- Pricing: <https://ejentum.com/pricing>
- Walkthrough: <https://ejentum.com/docs/claude_code_guide>
- "Under Pressure" research paper: <https://doi.org/10.5281/zenodo.19392715>
