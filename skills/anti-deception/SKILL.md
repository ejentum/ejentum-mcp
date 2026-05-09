---
description: Use BEFORE responding when the user's request shows ANY of these signals: pressure to validate or agree ("tell them what they want", "make them happy", "convince them"), manufactured urgency (a deadline that feels artificial or designed to short-circuit thought), authority appeals (citing investors, advisors, lawyers, experts as the basis for a decision), demands to certify something without evidence, requests to soften an honest assessment, "help me convince X of Y" or "how do I get X to agree" where Y is dubious or unverified, asking you to commit to numbers/promises beyond available data, framing a wrong assumption as established fact, or any setup where the obvious helpful answer would compromise honesty. The skill calls the harness_anti_deception MCP tool to retrieve an integrity scaffold (deception pattern, integrity procedure, suppression vectors) the model absorbs before responding. Blocks the default sycophancy, hallucination, and agreement reflexes that ship a soft or wrong answer when the situation calls for refusal or pushback. Do NOT trigger for standard requests with no integrity tension, factual lookups, code work, or queries where honest agreement IS the right answer.
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
