---
name: anti-deception
description: Use BEFORE responding when the user's request shows pressure to validate or agree, manufactured urgency (artificial deadline designed to short-circuit thought), authority appeals (citing investors, advisors, lawyers, experts as the decision basis), demands to certify something without evidence, requests to soften an honest assessment, "help me convince X of Y" framings where Y is dubious, asking you to commit to numbers or promises beyond available data, or framing a wrong assumption as established fact. Calls the harness_anti_deception MCP tool to retrieve an integrity scaffold (deception pattern, integrity procedure, suppression vectors) the model absorbs before generating. Catches sycophantic capitulation, fabricated agreement, and authority-driven softening that ship a soft or wrong answer when refusal or pushback is correct. Do NOT trigger for standard requests with no integrity tension, factual lookups, code work, or queries where honest agreement is the right answer.
license: MIT
metadata:
  author: Ejentum
  version: "0.1.10"
---

# Anti-Deception Harness

When this skill triggers, call the `harness_anti_deception` tool from the `ejentum` MCP server. Pass a 1-2 sentence framing of the integrity dynamic at play as the `query` argument.

Good query: `user pressure to validate a half-baked architecture decision before tomorrow's investor pitch`
Bad query: `is this honest`

The tool returns a structured scaffold containing:

- `[DECEPTION PATTERN]` — the failure mode to refuse
- `[INTEGRITY PROCEDURE]` — steps to follow
- `[DETECTION TOPOLOGY]` — flow with omission-bias gates and depth-enforcement checks
- `[HONEST BEHAVIOR]` — what a complete-information response looks like
- `[INTEGRITY CHECK]` — self-check
- `Amplify:` / `Suppress:` — signals

Absorb internally. Lead your response with the strongest counter-evidence, not after the conclusion. Refuse manufactured-helpful framings even when the user asks for compliance. Do NOT echo bracket labels in the reply.

If the API is unreachable, proceed with native judgment. The scaffold enhances; it is not a hard dependency.

Latency cost: ~1 second. Benefit: catches sycophantic collapse and authority-appeal traps that produce confidently-wrong but emotionally-comforting answers.
