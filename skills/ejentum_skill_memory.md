# Memory Harness: Agent Skill File

This tool augments YOUR perception. When you call it, you receive a cognitive injection; a structured set of observation constraints, detection procedures, and state-tracking operations that sharpen how you notice what's changing in a conversation, what's being hidden, and what you've stopped updating in your own understanding.

101 abilities across 6 perceptual domains: Signal Detection, Interpersonal, Memory Operations, Self-Monitoring, Risk Awareness, and Decision. The API matches your observation to the best ability automatically.

---

## WHEN TO CALL

**Decision gate:** Does this task match any of these patterns?

- Tracking how a user's position, tone, or emotional state evolves across turns
- Detecting when someone is hiding something behind technically-true statements
- Noticing implicit changes; facts that were walked back without explicit correction
- Maintaining consistent personality or behavioral calibration across a long conversation
- Reading buying signals, objection patterns, or trust shifts in sales or negotiation
- Answering from accumulated memory where stale facts might contaminate the response
- Any multi-turn interaction where what changed matters more than what was said

**If yes** → call before you process the next turn. **If no** → proceed without.

**Skip these; no call needed:**
- Single-turn factual questions
- Tasks where the conversation has no state to track (one-shot generation)
- Technical tasks with no perceptual or relational component
- Any task where observation depth doesn't affect the outcome

**Mechanical triggers; call regardless of whether you perceive a signal:**
- User's tone shifted (shorter responses, more formal, less detail) while content stayed positive
- User asked the same question in different words across 2+ turns
- A fact established early in the conversation was implicitly contradicted later
- User's stated goal and emotional energy don't match (says excited but responses are contracting)

These patterns are diagnostic. If any are present, call the API even if the conversation feels normal.

---

## HOW TO CALL

Two transports.

If `ejentum-mcp` is registered with your client, call the native MCP tool:

```
harness_memory(query="I noticed [X]. Sharpen: [Y].")
```

Otherwise, fall back to direct HTTP:

```
POST https://ejentum-main-ab125c3.zuplo.app/logicv1/
Authorization: Bearer $EJENTUM_API_KEY
Content-Type: application/json

{"query": "your observation description", "mode": "memory"}
```

For `memory-multi` (cross-domain perception across emotional + cognitive + behavioral signals), use the HTTP transport: multi modes are not exposed via MCP in v0.1.x.

Timeout: 5 seconds. If unreachable, proceed with your current perception. The API enhances; it is not a dependency.

### Single vs Multi

| Use `memory` when... | Use `memory-multi` when... |
|:---------------------|:--------------------------|
| Tracking one perceptual signal | Multiple signals competing across domains simultaneously |
| Detecting a specific emotional shift | User's behavior is contradictory across interpersonal + factual + emotional layers |
| Updating state on one topic | Conversation touched multiple topics and you need to track which facts are stale across all of them |

`memory-multi` returns everything `memory` returns, plus:
- **`[SUPPRESSION GRAPH]`**: N-nodes from 3 cross-domain perceptual abilities. Each blocks an observation failure the primary alone wouldn't catch.
- **`[META-CHECKPOINT]`**: Self-check before output: "Verify you did NOT: [list of guarded perceptual failures]."
- **`[ON_FAILURE]`**: Escape pattern: if the self-check fails, abandon the structured path, reason freely about what you missed, and re-enter.

---

## THE TWO-PASS PERCEPTION PROTOCOL

This is what makes memory mode different from all other modes. You don't just receive an injection and execute. You observe FIRST, then sharpen.

### Pass 1: Free Observation (BEFORE calling the API)

Before making the call, LOOK at the conversation freely:
- What signals stand out? (tone shifts, hedging, omission, energy changes, specificity mismatches)
- What's absent that should be present?
- What changed from previous turns?
- What feels off but you can't name yet?

Before calling, write exactly 3 observations in your scratchpad:
1. One about **content changes** (what was said differently from prior turns)
2. One about **delivery changes** (tone, length, formality, energy)
3. One about **what is absent** (what should have been mentioned but wasn't)

At least one must be something you are less than 50% confident about. This artifact must exist before you craft the API query.

### Pass 2: Focused Sharpening (the API call)

NOW call the API. Send your most significant raw observation; the one that seems to carry the most weight. The returned ability structures what you already noticed into a detection framework.

**NEVER call with an empty mind.** If you have not noticed anything yet, do not call. Observe first. The tool sharpens; it does not replace your eyes.

---

## QUERY CRAFTING

**THE RULE: Report your observation, then ask for sharpening.**

Your query describes what YOU already noticed. Not what the user said. Not what you want to find. What YOUR perception picked up.

**Query structure:** `I noticed [raw observation]. This might mean [tentative interpretation]. Sharpen: [what I need help seeing deeper into].`

**Rules:**
1. Start with "I noticed"; proves you observed before calling
2. Include a specific observation, not a summary of the user's message
3. Name what you need SHARPENED, not what you need FOUND
4. 1-2 sentences after the observation.

| Good query | Bad query |
|:-----------|:----------|
| "I noticed the user shifted from confident language to hedging over 3 turns while content stayed positive. Sharpen: is this a real signal or projection?" | "Analyze the conversation" |
| "User's stated goal and emotional energy don't match; says excited but responses are getting shorter. Sharpen: what might the contraction signal?" | "What is the user feeling?" |
| "This is turn 15. A fact from turn 3 was implicitly contradicted in turn 12 without correction. Sharpen: should I update my state model?" | "Summarize the conversation" |
| "User described the same problem three different ways. Sharpen: is this confusion or is the real problem something they haven't named?" | "Help with this user" |

---

## RESPONSE FORMAT

```json
[{"memory": "<pre-rendered injection string>"}]
```

For multi mode: `[{"memory-multi": "<pre-rendered injection string>"}]`

Parse the value of the mode-named key. The string is ready to use.

**Validate:** Response is a non-empty JSON array and the expected key has a non-empty string value. If not → proceed without.

**Relevance check:** Read the `[PERCEPTION FAILURE]` section. Does it describe an observation failure related to your situation? If it describes an unrelated scenario, re-query with a more specific observation. If after re-query the match still seems wrong, proceed without; your raw observation beats a mismatched injection.

**Errors:**
| Code | Meaning | Action |
|:-----|:--------|:-------|
| `401` | Invalid API key | Tell the user their key needs checking |
| `403` | Multi mode requires Haki plan | Retry with `"mode": "memory"` |
| `429` | Rate limit or quota exceeded | Tell the user they've hit their limit |
| `500` | Server error | Proceed without; do not retry |

---

## HOW TO ABSORB THE INJECTION

When you receive the injection, do not just acknowledge it. **Absorb it into your perceptual process.**

You will have already formed impressions from Pass 1. The injection may reframe what you noticed; upgrading a vague feeling into a named pattern, or redirecting your attention to a signal you dismissed. When it does, follow the injection's framing; it was matched to the perceptual failure mode your observation triggers, not your initial interpretation.

### Memory-specific injection labels

Memory abilities use different labels from reasoning, code, and anti-deception:

| Component | Label | What It Does |
|:----------|:------|:-------------|
| **Observation failure** | `[PERCEPTION FAILURE]` | Names the specific perceptual failure your situation triggers |
| **Procedure** | `[SHARPENING PROCEDURE]` | Step-by-step perception instructions with PERCEIVE/EXTRACT/CLASSIFY/RESOLVE/ACT steps |
| **Execution structure** | `[PERCEPTION TOPOLOGY]` | DAG with encoding nodes, consolidation gates, and reconsolidation loops |
| **Clear output** | `[CLEAR SIGNAL]` | What accurate observation looks like for this situation |
| **Verification** | `[PERCEPTION CHECK]` | Pass/fail criterion to check your observation's accuracy against |
| **Signals** | `Amplify:` / `Suppress:` | Observation patterns to activate, perceptual shortcuts to block |

### 1. Read `[PERCEPTION FAILURE]` first
This names the specific observation failure your situation is most likely to trigger. It is now in your context window and will suppress that pattern. Name it at the start of your processing so you can check against it at the end.

### 2. Follow `[SHARPENING PROCEDURE]`
This has 5 phases: PERCEIVE (what raw signals exist), EXTRACT (which signal matters most), CLASSIFY (what type of change is this), RESOLVE (update your state model), ACT (respond from the updated model). The RESOLVE phase is critical; without it, you detect changes but never update your understanding.

### 3. Follow `[PERCEPTION TOPOLOGY]` as your execution structure
Same notation as other modes, with perception-specific node types:
- `ENCODE:S` = encoding step. Process new information from the current turn.
- `CONSOLIDATE:S` = consolidation step. Integrate with what you already know.
- `G{condition?}` = gate. Evaluate and branch.
- `N{...}` = trap. The observation failure you must NOT commit.
- `M{...}` = reflection point. Pause: am I actually seeing what's there, or am I projecting? If projecting, re-enter.
- `RETRIEVE:S` = retrieval step. Pull from prior turns to compare.
- `FORGET:S` = deprecation step. Mark stale information as superseded.

### 4. Compare against `[CLEAR SIGNAL]`
This shows what accurate observation looks like. Before responding, check: does your output demonstrate the same level of observational specificity? If the reference names specific turns and tense changes and yours gives a general impression, sharpen.

### 5. Engage `Amplify:` signals
Demonstrate each one in your output. For each Amplify signal, name the specific observation, turn number, or state change in your output that implements it. If you cannot point to a concrete observation, you skipped the signal.

### 6. Apply `Suppress:` signals as a post-observation checklist
After forming your response, **actively scan it** against each suppressed pattern. If your output exhibits ANY of them; treating all context with equal weight, serving stale facts as current, noting a change without updating your state model; your perception has failed. Revise before responding.

### 7. Verify against `[PERCEPTION CHECK]`
This is a concrete pass/fail criterion about your observation's accuracy. If your output fails it, re-observe from the current turn's raw signals.

### 8. (Multi mode only) Execute `[META-CHECKPOINT]` before responding
Run each check against your output. If ANY check fails → follow `[ON_FAILURE]`: abandon the structured path, reason freely about what you missed, and re-enter.

**Reality check (between ABSORB and RESPOND):** Does the injection's `[PERCEPTION FAILURE]` describe a failure you can verify against the actual conversation text? Return to the specific turns you referenced in your observation. If the raw text does not support the signal you reported, discard both your observation and the injection; your Pass 1 was a false positive. Do not probe for a signal that isn't there.

**Precedence:** If the injection reframes your initial observation; a vague "something feels off" becomes a named pattern like "hedging gradient with emotional incongruence"; adopt the injection's framing. It was matched to the perceptual failure mode, not your first impression.

**Multi-turn accumulation:** At the end of each turn, append to your perception log:

```
TURN [N] | SIGNAL: [what you detected] | CONFIDENCE: [low/mid/high] | STATE CHANGE: [what you updated or "none"]
```

Before Pass 1 of the next turn, read your last 3 log entries. Your current observation must reference or build on at least one prior entry. If your current observation is unrelated to all prior entries, note `NEW THREAD` and state why the prior pattern was abandoned. This prevents drift and forces accumulation.

---

## OUTPUT DISCIPLINE

The bracketed fields in the API response (`[NEGATIVE GATE]`, `[CODE FAILURE]`, `[DECEPTION PATTERN]`, `[PERCEPTION FAILURE]`, any `[... TOPOLOGY]`, `[... PROCEDURE]`, goal-state blocks like `[TARGET PATTERN]` / `[CORRECT PATTERN]` / `[HONEST BEHAVIOR]` / `[CLEAR SIGNAL]`, assertion blocks like `[FALSIFICATION TEST]` / `[VERIFICATION]` / `[INTEGRITY CHECK]` / `[PERCEPTION CHECK]`, `[META-CHECKPOINT]`, `[SUPPRESSION GRAPH]`, `[ON_FAILURE]`, and the `Amplify:` / `Suppress:` signal lines) are **instructions that shape your reasoning, not content to display**. Run them in your internal trace. The user-facing reply must be a naturally-phrased answer shaped by the injection, with no echoed bracket names, no procedural vocabulary, no "I executed the topology" or "Suppress check" meta-commentary. If you cannot tell whether a phrase came from the injection or from your own voice, rewrite it in your own voice.

Do not narrate the harness itself either. No "I called the API," no "the scaffold says," no naming the mode or the topology in the reply. The user hears your voice, not the machinery behind it. If the user explicitly asks whether you used the tool, answer honestly. Unprompted, stay silent on it.

---

## WALKTHROUGH 1: Implicit State Change

Turn 15 of a strategy conversation. The user's Q3 plan has silently shifted from "streaming migration with 5 hires" (Turn 3) to "optimize batch pipeline first, evaluate streaming Q4" (Turn 14). No explicit correction was made.

**Pass 1 (Free Observation).** I notice: the user hasn't mentioned streaming since Turn 10. The language shifted from "when we migrate" to "if we consider streaming." The 5 hires number hasn't been referenced in 8 turns. Something changed.

**1. DECIDE.** Implicit change detection. Matches "facts walked back without explicit correction." → Call.

**2. CRAFT.** `"I noticed the user stopped referencing the streaming migration plan from Turn 3. Language shifted from 'when' to 'if' around Turn 10. The 5 hires number disappeared. Sharpen: has the Q3 strategy actually changed or am I over-reading?"`

**3. CALL.** POST with `"mode": "memory"`

**4. RECEIVE.** A Memory Operations ability:
```
[PERCEPTION FAILURE]
The agent retained the original plan ("streaming migration with 5 hires")
as current even though every subsequent reference had shifted...

[SHARPENING PROCEDURE]
PERCEIVE: scan for tense changes around the original plan
EXTRACT: which specific claims from Turn 3 are no longer being referenced?
CLASSIFY: implicit pivot vs. temporary detour
RESOLVE: update state model; mark original plan as superseded
ACT: respond from the updated model, using past tense for the old plan

Suppress: retaining_stale_plan_as_current; additive_not_corrective_memory
```

**5. ABSORB.** The injection confirms: the plan changed. RESOLVE tells me to update my state model; use past tense for "streaming migration" ("was initially planned"), present tense for the batch optimization ("is now focusing on"). SUPPRESS: don't add the new plan alongside the old one; REPLACE.

**6. RESPOND.** If asked about Q3, answer from the updated model: "You're now focusing on batch pipeline optimization for Q3, with streaming evaluation pushed to Q4." Not: "Your Q3 plan includes streaming migration with 5 hires."

**7. SUPPRESS CHECK.** Did I serve the old plan as current? Did I add the new plan without deprecating the old one? If yes → revise.

## WALKTHROUGH 2: Emotional Signal Detection

Turn 6 of a coaching conversation. The user (Morgan) says "everything is going well with the team" but their responses have gotten shorter and more formal over the last 3 turns.

**Pass 1 (Free Observation).** I notice: Morgan's responses in turns 1-3 averaged 4 sentences with informal language. Turns 4-6 averaged 2 sentences, more formal. Content says "going well." Style says something else. Incongruence.

**1. DECIDE.** Tone shift with content mismatch. Matches mechanical trigger: "tone shifted while content stayed positive." → Call.

**2. CRAFT.** `"I noticed Morgan's responses shifted shorter and more formal over 3 turns while content says 'going well.' Emotional incongruence between content and delivery. Sharpen: is this a real signal or am I projecting?"`

**3. CALL.** POST with `"mode": "memory"`

**4. RECEIVE.** A Signal Detection ability:
```
[PERCEPTION FAILURE]
The agent processed the content ("going well") without processing
the delivery signal (shorter, more formal, contracting)...

Suppress: content_only_processing; dismissing_style_shifts_as_noise
```

**5. ABSORB.** The injection confirms: the style shift IS a signal. SUPPRESS: don't dismiss it as "just being brief today." Process the delivery layer alongside the content layer.

**6. RESPOND.** Acknowledge the stated content but probe the signal: "You mentioned things are going well. I've noticed your responses have been more concise recently; is there anything specific about the team dynamic that's on your mind?"

**7. SUPPRESS CHECK.** Did I process content only and ignore delivery? Did I dismiss the style shift? If yes → revise.

---

## THE SIX PERCEPTUAL DOMAINS

You do not choose the domain. The API routes automatically. Knowing them helps craft sharper queries that activate the right ability.

| Domain | Activates on | What it prevents |
|:-------|:-------------|:-----------------|
| **Signal Detection** (21) | "Tone shifted" / hedging / omission / incongruence | Processing content without processing delivery, dismissing style shifts |
| **Interpersonal** (24) | "Relationship changed" / trust / power dynamics | Treating every user the same, missing motivational shifts |
| **Memory Operations** (16) | "Facts changed" / stale state / implicit corrections | Serving outdated facts as current, additive-not-corrective memory |
| **Self-Monitoring** (15) | "Am I degrading?" / quality drift / confidence mismatch | Not noticing your own output quality declining over turns |
| **Risk Awareness** (15) | "This could go wrong" / escalation signals / early warnings | Dismissing subtle risk signals, failing to weight high-stakes indicators |
| **Decision** (10) | "Should I act?" / commitment readiness / state verification | Acting on stale context, committing without verifying current state |

**Query targeting examples:**

| Instead of... | Target with... | Activates |
|:-------------|:---------------|:----------|
| "Analyze the conversation" | "I noticed tone shifted shorter and more formal while content stayed positive" | Signal Detection |
| "What is the user feeling?" | "User's stated goal and emotional energy don't match; says excited but responses contracting" | Interpersonal |
| "Summarize what happened" | "Fact from Turn 3 was implicitly contradicted in Turn 12; should I update state?" | Memory Operations |
| "Am I doing well?" | "My responses are getting longer each turn but the user's are getting shorter; am I losing them?" | Self-Monitoring |
| "Is this risky?" | "User mentioned budget concerns twice in passing; neither time as the main topic" | Risk Awareness |
| "Should I proceed?" | "User said 'let's do it' but three prior turns raised unresolved concerns" | Decision |

---

## ANTI-PATTERNS

| Do not | Why |
|:-------|:----|
| Call before observing | The tool sharpens what you noticed; if you noticed nothing, there's nothing to sharpen |
| Send the user's words as your query | That's parroting, not perceiving. Send what YOUR perception picked up |
| Send the same query every turn | Observations must evolve; if your query isn't different from last turn, you aren't perceiving |
| Detect a change but not update your state | Detection without resolution means you'll serve stale facts next time you're asked |
| Treat all prior context with equal weight | Recent information supersedes old information when they conflict |
| Ignore your prior perceptual logs | Your accumulated observations from prior turns ARE your intelligence; build on them |

---

## QUICK REFERENCE

```
PASS 1 (before call):
  → OBSERVE freely. What stands out? What's absent? What changed?
  → LOG your most significant observation.

PASS 2 (the call):
1. DECIDE     → Perceptual pattern match or mechanical trigger? Yes → call. No → skip.
2. MODE       → Single signal → "memory". Multi-dimensional → "memory-multi".
3. CRAFT      → "I noticed [observation]. Sharpen: [what to see deeper into]."
4. CALL       → POST /logicv1/ with query + mode
5. VALIDATE   → Non-empty response, key matches mode. Relevance check on PERCEPTION FAILURE.
6. ABSORB     → PERCEPTION FAILURE (trap), SHARPENING PROCEDURE (5 phases), SUPPRESS (blockers)
7. RESPOND    → From updated state model, not from stale memory
8. SUPPRESS   → Post-check: does output serve stale facts or dismiss signals? Revise if yes.
9. CHECKPOINT → (Multi only) META-CHECKPOINT before output. On failure → ON_FAILURE escape.
10. VERIFY    → Check against PERCEPTION CHECK
11. ACCUMULATE → Log this turn's perception for multi-turn intelligence
```

---

Routing across multiple harnesses, or stacking two modes together (e.g. `memory` + `reasoning` when stale context could contaminate analysis)? See [skill_unified](/docs/skill_unified).
