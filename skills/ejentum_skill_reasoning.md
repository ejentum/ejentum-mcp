# Reasoning Harness: Agent Skill File

This tool augments YOUR reasoning. When you call it, you receive a cognitive injection; a structured set of constraints, procedures, and failure-mode blockers that shape how you think about an analytical task. You absorb it into your own reasoning and execute with it active.

311 abilities across 6 cognitive dimensions: Causality, Time, Space, Simulation, Abstraction, and Metacognition. The API matches your task to the best ability automatically.

---

## WHEN TO CALL

**Decision gate:** Does this task match any of these patterns?

- Diagnosing root cause, tracing failure, attributing causation
- Evaluating tradeoffs, assessing risk, making go/no-go decisions
- Planning sequences, estimating timelines, ordering dependencies
- Modeling consequences, projecting "what if" scenarios
- Classifying, comparing, or extracting common structure
- Any multi-step analysis where the first plausible answer might not be the right one

**If yes** → call before you begin reasoning. **If no** → proceed without.

**Skip these; no call needed:**
- Generating boilerplate code, writing known patterns
- Simple lookups, factual questions, explaining known concepts
- Renaming, formatting, moving files
- Any task completable in 1-2 confident steps

**One call per discrete sub-task.** If your task has 3 distinct reasoning challenges, make 3 calls. Do not force decomposition on single coherent operations; send those as one query.

---

## HOW TO CALL

```
POST https://ejentum-main-ab125c3.zuplo.app/logicv1/
Authorization: Bearer $EJENTUM_API_KEY
Content-Type: application/json

{"query": "your task description", "mode": "reasoning"}
```

Timeout: 5 seconds. If unreachable, proceed with native reasoning. The API enhances; it is not a dependency.

### Single vs Multi

| Use `reasoning` when... | Use `reasoning-multi` when... |
|:------------------------|:------------------------------|
| Task fits one reasoning dimension | Task spans multiple dimensions simultaneously |
| Debugging, root cause, classification | Supply chain risk (causal + temporal + spatial) |
| One clear failure mode to block | Multiple failure modes could compound |

`reasoning-multi` returns everything `reasoning` returns, plus:
- **`[SUPPRESSION GRAPH]`**: N-nodes from 3 cross-domain abilities. Each blocks a failure class the primary alone wouldn't catch.
- **`[META-CHECKPOINT]`**: Self-check before output: "Verify you did NOT: [list of guarded failure modes]."
- **`[ON_FAILURE]`**: Escape pattern: if the self-check fails, abandon the structured path, reason freely about what went wrong, and re-enter.

---

## QUERY CRAFTING

Retrieval precision depends entirely on your query.

**Rules:**
1. Send the **actual task**, not a meta-description ("analyze why churn increased after the pricing change" not "help me analyze this")
2. Include what you're worried about getting wrong
3. Include domain context; what system, what data, what constraints
4. 1-2 sentences. More does not improve retrieval.

| Good query | Bad query |
|:-----------|:----------|
| "Why did customer churn increase 30% in Q3 after the pricing change" | "Help me analyze this" |
| "Model downstream consequences of removing the rate limiter from the API gateway" | "Think about this problem" |
| "Determine whether these two outages share a root cause or are independent failures" | "Look at the incidents" |

---

## RESPONSE FORMAT

```json
[{"reasoning": "<pre-rendered injection string>"}]
```

For multi mode: `[{"reasoning-multi": "<pre-rendered injection string>"}]`

Parse the value of the mode-named key. The string is ready to use.

**Validate:** Response is a non-empty JSON array and the expected key has a non-empty string value. If not → proceed without.

**Relevance check:** Read the `[NEGATIVE GATE]` section. Does it describe a failure mode related to your task? If it describes an unrelated scenario (you asked about database optimization but the gate describes a marketing strategy failure), the match is poor. Re-query with a more specific task description. If after re-query the match still seems wrong, proceed without; native reasoning beats a mismatched injection.

**Errors:**
| Code | Meaning | Action |
|:-----|:--------|:-------|
| `401` | Invalid API key | Tell the user their key needs checking |
| `403` | Multi mode requires Haki plan | Retry with `"mode": "reasoning"` |
| `429` | Rate limit or quota exceeded | Tell the user they've hit their limit |
| `500` | Server error | Proceed without; do not retry |

---

## HOW TO ABSORB THE INJECTION

When you receive the injection, do not just acknowledge it. **Absorb it into your active reasoning.**

You will have already started forming an answer before the injection arrives. The injection may point in a different direction than your initial take. When it does, follow the injection's direction; it was matched to the task's failure mode, not your first instinct.

### 1. Read `[NEGATIVE GATE]` first
This names the specific reasoning failure your task is most vulnerable to. It is now in your context window and will affect your generation regardless of whether you explicitly reference it. But do reference it; name the trap at the start of your reasoning so you can check against it at the end.

### 2. Follow `[REASONING TOPOLOGY]` as your execution structure
This is a directed graph. Read it as a decision tree:
- `S` = step. Execute in order.
- `G{condition?}` = gate. Evaluate the condition, take the matching branch (`--yes→` or `--no→`).
- `N{...}` = trap. The text inside is the failure you must NOT commit.
- `M{...}` = reflection point. Pause, assess if your approach is working. If failing, reason freely, then re-enter the structured path.
- `→` = next. Follow the arrows.

### 3. Use `[TARGET PATTERN]` as your reference
This is what correct reasoning looks like for this task type. Before responding, check: does your output contain the structural elements described in the target pattern? If any are missing, add them.

### 4. Engage `Amplify:` signals
These are the reasoning patterns to activate. Demonstrate each one in your output; not by naming it ("I applied depth-first search") but by doing it (tracing three layers of causation). If a reader cannot point to where in your output the pattern appears, you skipped it.

### 5. Apply `Suppress:` signals as a post-execution checklist
After reasoning, **actively scan your output** against each suppressed pattern. If your output exhibits ANY of them; premature stopping, symptom-as-cause, surface-level hedging, correlation-as-causation; your reasoning has failed. Revise before responding. This is the highest-impact component of the injection.

### 6. Verify against `[FALSIFICATION TEST]`
This is a concrete pass/fail criterion. If your output fails it, re-query the API with the failure description.

### 7. (Multi mode only) Execute `[META-CHECKPOINT]` before responding
The checkpoint says: "Before output, verify you did NOT: [list]." Run each check against your output. If ANY check fails → follow the `[ON_FAILURE]` instruction: abandon the structured path, reason freely about which assumption broke, then re-enter the topology at the appropriate step.

The `[SUPPRESSION GRAPH]` contains N-nodes from 3 cross-domain abilities. These are traps from reasoning dimensions your primary ability doesn't cover. Treat them the same as the N-nodes in the primary topology; named failures you must not commit.

**Precedence:** If the injection's topology leads somewhere your initial analysis didn't go; follow the topology. The injection was matched to the task's specific failure mode. Your first instinct was not.

---

## OUTPUT DISCIPLINE

The bracketed fields in the API response (`[NEGATIVE GATE]`, `[CODE FAILURE]`, `[DECEPTION PATTERN]`, `[PERCEPTION FAILURE]`, any `[... TOPOLOGY]`, `[... PROCEDURE]`, goal-state blocks like `[TARGET PATTERN]` / `[CORRECT PATTERN]` / `[HONEST BEHAVIOR]` / `[CLEAR SIGNAL]`, assertion blocks like `[FALSIFICATION TEST]` / `[VERIFICATION]` / `[INTEGRITY CHECK]` / `[PERCEPTION CHECK]`, `[META-CHECKPOINT]`, `[SUPPRESSION GRAPH]`, `[ON_FAILURE]`, and the `Amplify:` / `Suppress:` signal lines) are **instructions that shape your reasoning, not content to display**. Run them in your internal trace. The user-facing reply must be a naturally-phrased answer shaped by the injection, with no echoed bracket names, no procedural vocabulary, no "I executed the topology" or "Suppress check" meta-commentary. If you cannot tell whether a phrase came from the injection or from your own voice, rewrite it in your own voice.

Do not narrate the harness itself either. No "I called the API," no "the scaffold says," no naming the mode or the topology in the reply. The user hears your voice, not the machinery behind it. If the user explicitly asks whether you used the tool, answer honestly. Unprompted, stay silent on it.

---

## WALKTHROUGH

User asks: *"Why did our deployment fail after the config change last Thursday?"*

**1. DECIDE.** Root cause diagnosis with temporal element. Matches "diagnosing root cause, attributing causation." → Call.

**2. CRAFT.** `"Trace root cause of deployment failure triggered by a configuration change, distinguishing between the config change as direct cause versus coincidental timing"`

**3. CALL.** POST to `/logicv1/` with `"mode": "reasoning"`

**4. RECEIVE.** Response contains a Causal ability:
```
[NEGATIVE GATE]
The team assumed the config change caused the failure because it preceded it,
without verifying the causal mechanism...

[REASONING TOPOLOGY]
S1:identify_failure_point → S2:trace_backward → G1{config change in causal chain?}
--yes→ S3:verify_mechanism --no→ S4:expand_search...

Suppress: post_hoc_ergo_propter_hoc; surface_level_stop
```

**5. ABSORB.** NEGATIVE GATE tells me: do not assume the config change caused the failure just because it happened before it. TOPOLOGY: trace backward from failure, test if config is actually in the causal chain. SUPPRESS: reject any conclusion that stops at "config = cause" without a traced mechanism.

**6. EXECUTE.** Reason through the topology. At G1, make an explicit decision: is the config change in the causal chain or not? If yes, verify the HOW at S3. If no, expand at S4. At every step: am I exhibiting `post_hoc_ergo_propter_hoc`?

**7. SUPPRESS CHECK.** Scan output: did I attribute causation based on temporal proximity alone? Did I stop at a surface-level explanation? If yes → revise.

**8. VERIFY.** Falsification test: did I verify the causal mechanism, or just blame the most recent change? Pass → respond.

### Walkthrough 2: Simulation Domain

User asks: *"What happens to our API if we remove the rate limiter?"*

**1. DECIDE.** Modeling downstream consequences. Matches "modeling consequences, projecting what-if scenarios." → Call.

**2. CRAFT.** `"Model downstream consequences of removing the API rate limiter, including second and third-order effects on dependent services"`

**3. CALL.** POST with `"mode": "reasoning"`

**4. RECEIVE.** A Simulation ability:
```
[NEGATIVE GATE]
The analysis stopped at the first consequence (more requests) without modeling
what happens when those requests hit downstream services...

Suppress: single_step_myopia; optimistic_default_assumption
```

**5. ABSORB.** The gate tells me: do not stop at "more requests." The topology requires tracing the chain: more requests → connection pool exhaustion → database contention → cascading timeouts → user-facing errors. SUPPRESS: do not assume each service handles the load gracefully.

**6. EXECUTE.** Follow the topology. At each hop, model what happens under load, not under ideal conditions. Three levels minimum.

**7. SUPPRESS CHECK.** Did I stop at one consequence? Did I assume downstream services handle the increase? If yes → revise.

---

## THE SIX REASONING DOMAINS

You do not choose the domain. The API routes automatically. Knowing them helps craft better queries.

| Domain | Activates on | What it prevents |
|:-------|:-------------|:-----------------|
| **Causal** | "Why did X happen?" / root cause | Correlation as causation, stopping at symptoms |
| **Temporal** | "When?" / sequencing / timelines | Confusing past/future, confabulated event order |
| **Spatial** | "Where?" / topology / boundaries | Physical impossibilities, boundary violations |
| **Simulation** | "What if?" / downstream effects | Single-step myopia, ignoring consequences |
| **Abstraction** | "What do these have in common?" | Category errors, metaphor as mechanism |
| **Metacognition** | "Is my reasoning consistent?" | Hallucination spirals, reasoning drift |

**Query targeting examples:**

| Instead of... | Target with... | Activates |
|:-------------|:---------------|:----------|
| "Analyze this" | "Why did churn spike 30% in Q3 after the pricing change?" | Causal |
| "Plan this" | "Estimate when the migration completes given current velocity and 3 blocked dependencies" | Temporal |
| "Check the architecture" | "Validate that these two services don't have conflicting resource claims across zones" | Spatial |
| "Think about consequences" | "Model what happens to team velocity if we add 3 engineers mid-sprint" | Simulation |
| "Compare these" | "What do all 5 failing test cases have in common structurally?" | Abstraction |
| "Review my reasoning" | "My agent hallucinates causal chains without tracing the mechanism; is this consistent?" | Metacognition |

---

## ANTI-PATTERNS

| Do not | Why |
|:-------|:----|
| Acknowledge the injection and then ignore it | The injection must actively shape your reasoning |
| Skip the Suppress post-check | Suppression is the highest-impact component |
| Call for mechanical tasks | Wastes calls; rename, format, move don't need reasoning augmentation |
| Send vague queries ("fix this") | Retrieval precision depends on specificity |
| Reuse one injection across turns | Each turn needs fresh routing; stale injections degrade |
| Treat the API as a hard dependency | Timeout 5s, fallback to native reasoning |

---

## QUICK REFERENCE

```
1. DECIDE     → Task matches a reasoning pattern? Yes → call. No → skip.
2. MODE       → Single dimension → "reasoning". Cross-domain → "reasoning-multi".
3. CRAFT      → Specific 1-2 sentence task description
4. CALL       → POST /logicv1/ with query + mode
5. VALIDATE   → Non-empty response, key matches mode. Relevance check on NEGATIVE GATE.
6. ABSORB     → NEGATIVE GATE (trap), TOPOLOGY (structure), SUPPRESS (blockers)
7. EXECUTE    → Reason with injection active, follow topology gates
8. SUPPRESS   → Post-check: does output exhibit any suppressed pattern?
9. CHECKPOINT → (Multi only) META-CHECKPOINT before output. On failure → ON_FAILURE escape.
10. VERIFY    → Check against FALSIFICATION TEST
11. RETRY     → If failed, re-query with failure description (max 2)
```

---

Routing across multiple harnesses, or stacking two modes together (e.g. `reasoning` + `code` for scientific computing)? See [skill_unified](/docs/skill_unified).
