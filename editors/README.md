# Editor rules for ejentum-mcp

Drop-in rules files that teach Cursor, Windsurf, and Cline when to call the
four `ejentum-mcp` cognitive harness tools (`harness_reasoning`,
`harness_code`, `harness_anti_deception`, `harness_memory`).

These are the editor-native equivalent of the `skills/` directory, which
targets Claude Code's SKILL.md format.

## Cursor

Copy [`cursor/.cursorrules`](cursor/.cursorrules) to your project root.
Cursor loads it automatically as agent context.

Install the MCP server: Cursor Settings → MCP → Add MCP server →
`npx -y ejentum-mcp` with env `EJENTUM_API_KEY=<your_key>`.

## Windsurf

Copy [`windsurf/.windsurfrules`](windsurf/.windsurfrules) to your project
root for project-scoped rules, or paste the contents into `global_rules.md`
for Windsurf-wide application.

Install the MCP server: Windsurf Settings → Cascade → MCP Servers → add
`npx -y ejentum-mcp` with env `EJENTUM_API_KEY=<your_key>`.

## Cline

Copy [`cline/.clinerules`](cline/.clinerules) to your project root, or
place it in a `.clinerules/` directory at the workspace root for
workspace-wide application.

Install the MCP server: Cline sidebar → MCP Servers → Edit MCP Settings →
add an `ejentum` entry under `mcpServers` with command `npx`, args
`["-y", "ejentum-mcp"]`, env `{ "EJENTUM_API_KEY": "<your_key>" }`.

## Get an API key

Free tier (100 calls, no card): https://ejentum.com/pricing

## Background

Full walkthrough with screenshots:
https://ejentum.com/docs/claude_code_guide

The harnesses are documented in the project root README and the
[`skills/`](../skills) directory.
