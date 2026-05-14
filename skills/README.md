# Ejentum Skills

Four [Agent Skills](https://agentskills.io) for autonomously routing to the Ejentum harnesses. Once installed, the host agent picks the right harness based on the prompt's shape (analytical, code, pressure dynamics, perceptual signal) without needing an explicit `Use the harness_X tool` instruction.

The MCP server in this repo's parent directory (`ejentum-mcp`) provides the same harnesses as plain MCP tools. Skills are the **autonomous-routing layer on top**. They follow the [agentskills.io open standard](https://agentskills.io/specification) and validate against `skills-ref`.

## Directory layout

```
skills/
├── anti-deception/SKILL.md
├── code/SKILL.md
├── memory/SKILL.md
└── reasoning/SKILL.md
```

Each skill is a spec-compliant directory containing one `SKILL.md` with YAML frontmatter (`name`, `description`, `license`, `metadata`) plus the routing instructions.

## What's in each skill

| Skill | Mode | When the host agent invokes it (autonomous trigger) |
|---|---|---|
| `reasoning` | `harness_reasoning` | Multi-step analysis, planning, diagnostics, cross-domain synthesis |
| `code` | `harness_code` | Code generation, refactoring, review, debugging, architecture decisions |
| `anti-deception` | `harness_anti_deception` | Pressure to validate, manufactured urgency, authority appeals, agreement reflexes |
| `memory` | `harness_memory` | Cross-turn drift, perception sharpening, signal vs projection |

## Compatibility

These skills follow the [agentskills.io specification](https://agentskills.io/specification) and pass `skills-ref validate`. The following clients implement compatible skill loading and can discover skills in this format:

- Claude Code, Claude
- Cursor, GitHub Copilot, VS Code
- OpenAI Codex, Gemini CLI
- JetBrains Junie, Roo Code, Amp, Kiro
- OpenHands, OpenCode, Mux, Emdash, Factory
- Letta, Hermes Agent, nanobot, fast-agent, Goose
- TRAE, Mistral AI Vibe, Snowflake Cortex Code, Databricks Genie Code

End-to-end load behavior has been verified on Claude Code; other clients are listed by spec compatibility, not by direct test. See your client's documentation for the install path (typically `skills/` or `.claude/skills/`).

## Install paths for Claude Code

### (A) User-scope (global, all projects)

```
~/.claude/skills/
├── anti-deception/SKILL.md
├── code/SKILL.md
├── memory/SKILL.md
└── reasoning/SKILL.md
```

### (B) Workspace drop (per-project)

Copy the four skill directories into the project's `.claude/skills/` directory and add a `CLAUDE.md` to the project root pointing Claude Code at them. The [Claude Code walkthrough](https://ejentum.com/docs/claude_code_guide) shows the exact pattern.

## Validation

Validate each skill against the agentskills.io spec:

```bash
pip install -e https://github.com/agentskills/agentskills.git#subdirectory=skills-ref
skills-ref validate ./anti-deception
skills-ref validate ./code
skills-ref validate ./memory
skills-ref validate ./reasoning
```

All four pass at the current version.

## API key

The skills route to `ejentum-mcp` tools, which require `EJENTUM_API_KEY`. Either:

- Set it in the MCP server config (env block when adding `ejentum-mcp` as an MCP server in your client), OR
- Set it as a shell environment variable before launching the client

Free tier: 100 calls. Get a key at https://ejentum.com.

## Source

Canonical install walkthrough (Claude Code, with screenshots): [ejentum.com/docs/claude_code_guide](https://ejentum.com/docs/claude_code_guide).
