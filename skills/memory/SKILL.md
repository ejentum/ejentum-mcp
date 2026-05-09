---
description: Use when sharpening a perception or observation you ALREADY formed about conversation state, user behavior, drift, emotional shifts, or cross-turn patterns. Trigger phrases include "what did you notice about X", "the user keeps doing Y", "I sense something has changed", "is the user X-ing", "what does this pattern suggest", "what shifted across our turns", "am I missing something here", "why did the conversation move from X to Y", or any moment requiring verification of whether a felt signal is real or projection. The skill calls the harness_memory MCP tool to retrieve a perception scaffold (perception failure, detection procedure, suppression vectors) that SHARPENS an observation you already have. It is NOT a substitute for observing first. Do NOT trigger for fact extraction, summarization, list-making, factual lookups, or write-heavy memory tasks (storing/retrieving structured data). Memory harness is filter/perception oriented; calling on write-heavy tasks produces scaffold paralysis.
---

# Memory Harness

When this skill triggers, you MUST observe first. Do not call the tool with an empty mind. If you have not formed an observation about conversation state, drift, or pattern, do not invoke this skill.

Once you have a raw observation, call the `harness_memory` tool from the `ejentum` MCP server. Pass a 1-2 sentence framing in the format `"I noticed [observation]. This might mean [tentative interpretation]. Sharpen: [what I need help seeing deeper into]."` as the `query` argument.

Good query: `I noticed the user changed topic three times in this turn. This might mean they are avoiding the original question. Sharpen: whether the avoidance pattern is real or my projection.`
Bad query: `what does the user mean`

The tool returns a structured scaffold containing:

- `[PERCEPTION FAILURE]` — perceptual failure mode to avoid
- `[SHARPENING PROCEDURE]` — observe → classify steps
- `[PERCEPTION TOPOLOGY]` — DETECT-CLASSIFY flow
- `[CLEAR SIGNAL]` — what a sharpened perception looks like
- `[PERCEPTION CHECK]` — self-check
- `Amplify:` / `Suppress:` — signals

Absorb internally. The scaffold sharpens an existing observation; it does not generate one. Do NOT echo bracket labels.

If the API is unreachable, proceed with your current perception. The scaffold enhances; it is not a hard dependency.

Latency cost: ~1 second. Benefit: distinguishes real cross-turn signals from projection.
