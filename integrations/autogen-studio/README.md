# AutoGen Studio integration

A drop-in [AutoGen Studio](https://microsoft.github.io/autogen/stable//user-guide/autogenstudio-user-guide/index.html) gallery JSON that exposes the four Ejentum cognitive harnesses to AutoGen agents via MCP.

## What the agent gets

A single `McpWorkbench` wrapping the [`ejentum-mcp`](https://www.npmjs.com/package/ejentum-mcp) stdio MCP server. Inside that workbench, four tools become callable:

| Tool | When the agent should call it |
|---|---|
| `harness_reasoning` | Analytical, diagnostic, planning, multi-step questions |
| `harness_code` | Code generation, refactoring, review, debugging |
| `harness_anti_deception` | Prompts pressuring the agent to validate or soften an honest assessment |
| `harness_memory` | Sharpening an observation already formed about cross-turn drift |

Each call retrieves a task-matched scaffold from a library of 679 cognitive operations engineered in natural language. The agent ingests the scaffold (failure pattern, executable procedure, suppression vectors, falsification test) and writes from it.

## Install

1. Open AutoGen Studio (Gallery view).
2. Click **+ Create Gallery → Import from URL**.
3. Paste this URL:

   ```
   https://raw.githubusercontent.com/ejentum/ejentum-mcp/main/integrations/autogen-studio/gallery.json
   ```

4. After import, edit the workbench's `env.EJENTUM_API_KEY` value to your actual key. Get a free key (100 calls, no card) at <https://ejentum.com/pricing>.
5. Add the workbench to any team in your AutoGen Studio session. The four harness tools appear in the team's tool palette.

## Verifying the gallery JSON locally

```bash
python -c "import json; json.load(open('gallery.json')); print('valid JSON')"
```

You can also import it into AutoGen Studio via the file picker (`Import from File`) if you want to test locally first.

## More

- Project: <https://github.com/ejentum/ejentum-mcp> (MIT)
- Pricing & free tier: <https://ejentum.com/pricing>
- Walkthrough: <https://ejentum.com/docs/claude_code_guide>
- "Under Pressure" research paper: <https://doi.org/10.5281/zenodo.19392715>
