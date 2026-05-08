# Ejentum Skill Files

Five skill files for **Claude Code** that turn the Ejentum harnesses into autonomously-routed tools. Once installed, Claude Code recognizes which harness to call based on the prompt's shape (analytical task, code work, pressure dynamics, perceptual signal) without an explicit `Use the harness_X tool` instruction.

The MCP server in this repo's parent directory (`ejentum-mcp`) provides the same harnesses as plain MCP tools. Skill files are the *autonomous-routing layer on top*. They are most useful for Claude Code; for Claude Desktop / Cursor / Windsurf / n8n, the MCP alone is sufficient and these files are not needed.

## Install paths

Pick one. Both work; `(B)` is the canonical Claude Code install per [our walkthrough](https://ejentum.com/docs/claude_code_guide).

### (A) Workspace drop (per-project)

Copy the five `ejentum_skill_*.md` files into your project root (or into the project's `.claude/` directory). Add a `CLAUDE.md` to the project root that points Claude Code at them; the [claude_code_guide](https://ejentum.com/docs/claude_code_guide) shows the exact pattern.

### (B) User-scope install (global, all projects)

Place each skill file inside its own subdirectory at `~/.claude/skills/`:

```
~/.claude/skills/
├── ejentum-unified/SKILL.md
├── ejentum-reasoning/SKILL.md
├── ejentum-code/SKILL.md
├── ejentum-anti-deception/SKILL.md
└── ejentum-memory/SKILL.md
```

The `SKILL.md` filename is required by Claude Code's user-scope skill convention. Rename `ejentum_skill_unified.md` to `ejentum-unified/SKILL.md` (etc.) when copying.

## What's in each file

| File | Mode | Use case (autonomous trigger) |
|---|---|---|
| `ejentum_skill_unified.md` | router | Picks the right harness; documents stacking patterns when two modes apply at once |
| `ejentum_skill_reasoning.md` | reasoning | Multi-step analysis, planning, diagnostics, cross-domain synthesis |
| `ejentum_skill_code.md` | code | Code generation, refactoring, review, debugging, architecture decisions |
| `ejentum_skill_anti_deception.md` | anti-deception | Pressure to validate, manufactured urgency, authority appeals, agreement reflexes |
| `ejentum_skill_memory.md` | memory | Cross-turn drift, perception sharpening, signal vs projection |

## API key

All five skill files expect `EJENTUM_API_KEY` to be available in Claude Code's environment. Either:

- Set it globally via `~/.claude/settings.json` `env` block (recommended for user-scope install), OR
- Set it as a shell environment variable before running `claude`, OR
- Define it inline in your project's `CLAUDE.md` (workspace install)

Free tier: 100 calls, no card. Get a key at https://ejentum.com/pricing.

## Source

These files are the skill bundle distributed at [ejentum.com/wp-content/themes/ejentum/guides/claude_code/ejentum_skills.zip](https://ejentum.com/wp-content/themes/ejentum/guides/claude_code/ejentum_skills.zip), extracted as their own directory in this repo for review and reproducibility. The canonical install walkthrough (with screenshots and a three-turn demo proving all four harnesses route autonomously) is at [ejentum.com/docs/claude_code_guide](https://ejentum.com/docs/claude_code_guide), which also links the ZIP directly so end users do not need to memorize the WordPress theme path.
