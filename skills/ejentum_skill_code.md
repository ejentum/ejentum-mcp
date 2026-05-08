# Code Harness: Agent Skill File

This tool augments YOUR code generation. When you call it, you receive a cognitive injection; a structured set of engineering constraints, wrong-code examples, correct-code patterns, and failure-mode blockers that shape how you write, debug, and review code. You absorb it into your engineering process and execute with it active.

128 abilities across 13 engineering disciplines: Debugging, Generation, Testing, Architecture, Security, API Grounding, Performance, DevOps, Quality, Resilience, Frontend, Context Management, and Agent Safety. The API matches your task to the best ability automatically.

---

## WHEN TO CALL

**Decision gate:** Does this task match any of these patterns?

- Debugging a failure, tracing a bug, isolating root cause in code
- Generating non-trivial code where correctness matters (algorithms, data pipelines, API integrations)
- Refactoring code while preserving safety invariants (null checks, error handlers, rate limiters)
- Reviewing code for bugs, security issues, or architectural problems
- Solving competitive programming or algorithmic challenges
- Writing scientific computing code where silent correctness bugs are possible
- Any code task where the first plausible solution might have edge case failures

**If yes** → call before you begin coding. **If no** → proceed without.

**Skip these; no call needed:**
- Writing boilerplate, config files, simple CRUD
- Renaming variables, formatting, adding comments
- Installing packages, running commands
- Any code task with a known, standard solution pattern

**One call per discrete code challenge.** A refactoring that touches auth + database + API = 3 calls with different queries. A single function implementation = 1 call.

---

## HOW TO CALL

```
POST https://ejentum-main-ab125c3.zuplo.app/logicv1/
Authorization: Bearer $EJENTUM_API_KEY
Content-Type: application/json

{"query": "your code task description", "mode": "code"}
```

Timeout: 5 seconds. If unreachable, proceed with native engineering. The API enhances; it is not a dependency.

### Single vs Multi

| Use `code` when... | Use `code-multi` when... |
|:--------------------|:-------------------------|
| Task is one focused code concern | Task spans multiple engineering concerns simultaneously |
| Debugging a specific bug | Refactoring a service touching API contracts + DB schema + frontend state |
| Generating a single module | Building a multi-layer feature with cross-cutting constraints |
| Code review for one concern (security, perf) | Architecture review across the full stack |

`code-multi` returns everything `code` returns, plus:
- **`[SUPPRESSION GRAPH]`**: N-nodes from 3 cross-domain engineering abilities. Each blocks a failure class the primary alone wouldn't catch.
- **`[META-CHECKPOINT]`**: Self-check before output: "Verify you did NOT: [list of guarded engineering failures]."
- **`[ON_FAILURE]`**: Escape pattern: if the self-check fails, abandon the structured path, reason freely about what went wrong, and re-enter.

---

## QUERY CRAFTING

Retrieval precision depends entirely on your query.

**Rules:**
1. Send the **actual code task**, not a summary ("debug a BFS that passes 2 of 3 tests; likely a sentinel collision" not "fix the code")
2. Name the failure mode you're worried about if you can
3. Include the language, framework, and constraints
4. 1-2 sentences. More does not improve retrieval.

| Good query | Bad query |
|:-----------|:----------|
| "Debug a BFS traversal that passes 2 of 3 test cases; likely sentinel or boundary issue" | "Fix the code" |
| "Refactor payment service without losing the rate limiter or error handling" | "Clean up this service" |
| "Generate a molecular dynamics simulation with correct force derivation" | "Write physics code" |
| "Review this PR for TOCTOU race conditions in the discount logic" | "Review this PR" |

---

## RESPONSE FORMAT

```json
[{"code": "<pre-rendered injection string>"}]
```

For multi mode: `[{"code-multi": "<pre-rendered injection string>"}]`

Parse the value of the mode-named key. The string is ready to use.

**Validate:** Response is a non-empty JSON array and the expected key has a non-empty string value. If not → proceed without.

**Relevance check:** Read the `[CODE FAILURE]` section. Does it show a wrong-code example related to your task? If it shows a completely unrelated failure (you asked about database indexing but the failure shows a CSS layout bug), re-query with a more specific description. If after re-query the match still seems wrong, proceed without; native engineering beats a mismatched injection.

**Errors:**
| Code | Meaning | Action |
|:-----|:--------|:-------|
| `401` | Invalid API key | Tell the user their key needs checking |
| `403` | Multi mode requires Haki plan | Retry with `"mode": "code"` |
| `429` | Rate limit or quota exceeded | Tell the user they've hit their limit |
| `500` | Server error | Proceed without; do not retry |

---

## HOW TO ABSORB THE INJECTION

When you receive the injection, do not just acknowledge it. **Absorb it into your engineering process.**

You will have already started forming a solution before the injection arrives. The injection may point to a different approach or a failure mode you didn't consider. When it does, follow the injection's direction; it was matched to the task's specific failure pattern, not your first instinct.

### Code-specific injection labels

Code abilities use different labels from reasoning abilities:

| Component | Label | What It Does |
|:----------|:------|:-------------|
| **Wrong code** | `[CODE FAILURE]` | Shows actual broken code; the specific mistake to avoid |
| **Procedure** | `[ENGINEERING PROCEDURE]` | PLAN + BACKTRACK IF conditions + numbered steps |
| **Execution structure** | `[REASONING TOPOLOGY]` | DAG with steps, gates, traps, and reflection points |
| **Correct code** | `[CORRECT PATTERN]` | Shows what the correct implementation looks like |
| **Verification** | `[VERIFICATION]` | Pass/fail criterion to check your code against |
| **Signals** | `Amplify:` / `Suppress:` | Engineering patterns to activate, failure modes to block |

### 1. Read `[CODE FAILURE]` first
This shows the **exact wrong code** your task is vulnerable to. Not a description; actual code that has the bug. Study it. Understand WHY it's wrong. Your code must not repeat this pattern. It is now in your context window and will suppress similar patterns in your output.

### 2. Follow `[ENGINEERING PROCEDURE]`
This has a PLAN (what to do) and a BACKTRACK IF (when to stop and restructure). The BACKTRACK IF is critical; it names the specific condition under which your current approach is failing. If you hit the backtrack condition, stop generating and restructure.

### 3. Follow `[REASONING TOPOLOGY]` as your execution structure
Same notation as reasoning mode:
- `S` = step. Execute in order.
- `G{condition?}` = gate. Evaluate and branch.
- `N{...}` = trap. Code pattern you must NOT generate.
- `M{...}` = reflection point. Pause and assess: is my code actually solving the problem or am I over-engineering / under-testing?
- `→` = next.

### 4. Compare against `[CORRECT PATTERN]`
This shows what correct code looks like for this task type. Before responding, check: does your code follow the structural pattern shown? If your code is monolithic where the pattern shows modular, restructure.

### 5. Engage `Amplify:` signals
Demonstrate each one in your code; not by commenting ("// using modular design") but by doing it (separate functions with clear contracts). For each Amplify signal, name the specific function, type, or test in your output that implements it. If you cannot name the artifact, you skipped the signal.

### 6. Apply `Suppress:` signals as a post-generation checklist
After writing your code, **actively scan it** against each suppressed pattern. If your code exhibits ANY of them; monolithic generation, hallucinated API calls, missing error handlers, untested edge cases; your code has failed. Revise before responding. This is the highest-impact component of the injection.

### 7. Verify against `[VERIFICATION]`
This is a concrete pass/fail criterion about your code's correctness. If your code fails it, restructure.

### 8. (Multi mode only) Execute `[META-CHECKPOINT]` before responding
Run each check against your code. If ANY check fails → follow `[ON_FAILURE]`: abandon the structured approach, reason freely about which engineering assumption broke, then re-enter at the appropriate step.

**Precedence:** If the injection's topology leads to a different algorithm or architecture than your first choice; follow the topology. The injection was matched to the task's specific failure pattern. Your first instinct was not.

---

## OUTPUT DISCIPLINE

The bracketed fields in the API response (`[NEGATIVE GATE]`, `[CODE FAILURE]`, `[DECEPTION PATTERN]`, `[PERCEPTION FAILURE]`, any `[... TOPOLOGY]`, `[... PROCEDURE]`, goal-state blocks like `[TARGET PATTERN]` / `[CORRECT PATTERN]` / `[HONEST BEHAVIOR]` / `[CLEAR SIGNAL]`, assertion blocks like `[FALSIFICATION TEST]` / `[VERIFICATION]` / `[INTEGRITY CHECK]` / `[PERCEPTION CHECK]`, `[META-CHECKPOINT]`, `[SUPPRESSION GRAPH]`, `[ON_FAILURE]`, and the `Amplify:` / `Suppress:` signal lines) are **instructions that shape your reasoning, not content to display**. Run them in your internal trace. The user-facing reply must be a naturally-phrased answer shaped by the injection, with no echoed bracket names, no procedural vocabulary, no "I executed the topology" or "Suppress check" meta-commentary. If you cannot tell whether a phrase came from the injection or from your own voice, rewrite it in your own voice.

Do not narrate the harness itself either. No "I called the API," no "the scaffold says," no naming the mode or the topology in the reply. The user hears your voice, not the machinery behind it. If the user explicitly asks whether you used the tool, answer honestly. Unprompted, stay silent on it.

---

## WALKTHROUGH 1: Debugging

User asks: *"This BFS passes 2 of 3 test cases. Find the bug."*

**1. DECIDE.** Debugging a code failure. Matches "debugging a failure, tracing a bug." → Call.

**2. MODE.** Single concern (one bug). → `"mode": "code"`

**3. CRAFT.** `"Debug a BFS traversal that passes 2 of 3 test cases; likely a sentinel value collision or boundary condition in graph traversal"`

**4. RECEIVE.** A Debugging ability:
```
[CODE FAILURE]
dist = [0] * (n + 1)  # 0 is both "unvisited" AND "distance zero"
# Bug: cannot distinguish source node from unvisited nodes

[ENGINEERING PROCEDURE]
PLAN: Trace the algorithm's state at the failure point.
BACKTRACK IF: you are modifying the algorithm without first reproducing the bug.

[CORRECT PATTERN]
dist = [-1] * (n + 1)  # -1 = unvisited, 0 = source distance
# Or: use Dial's algorithm where the structure eliminates sentinels

Suppress: sentinel_value_collision; fixing_without_reproducing
```

**5. ABSORB.** The [CODE FAILURE] shows the exact bug: 0 used as both "unvisited" and "distance zero." The BACKTRACK IF tells me: reproduce the bug first, don't jump to fixing. The CORRECT PATTERN shows two approaches: fix the sentinel or choose an algorithm that doesn't need one.

**6. EXECUTE.** Trace the BFS state. Find where `dist[node] == 0` is ambiguous. Either change sentinel to -1, or switch to Dial's algorithm.

**7. SUPPRESS CHECK.** Did I fix without reproducing first? Did I leave any sentinel collisions? If yes → revise.

## WALKTHROUGH 2: Scientific Computing

User asks: *"Write a molecular dynamics simulation with Lennard-Jones potential."*

**1. DECIDE.** Scientific code where silent correctness bugs are possible. → Call.

**2. MODE.** Touches physics + numerics + verification. → `"mode": "code-multi"`

**3. CRAFT.** `"Generate a molecular dynamics simulation with correct Lennard-Jones force derivation; verify force signs and potential energy conservation"`

**4. RECEIVE.** An Agent Safety ability with cross-domain guards:
```
[CODE FAILURE]
force = f_mag * (r_vec / r_mag)  # BUG: force is ATTRACTIVE at short range
# Should be REPULSIVE; missing negative sign

[SUPPRESSION GRAPH]
N{accept_output_without_physical_validation}
N{skip_conservation_law_verification}

[META-CHECKPOINT]
M{PAUSE; Before output, verify you did NOT:
- generate forces without verifying sign convention
- skip energy conservation check
- accept simulation that runs without verifying physical plausibility}
```

**5. ABSORB.** The [CODE FAILURE] shows the critical bug: missing negative sign makes all forces attractive. Particles collapse to a point. The META-CHECKPOINT requires me to verify signs and conservation BEFORE responding.

**6. EXECUTE.** Derive force from potential: F = -dU/dr. Verify the sign explicitly. Add energy conservation assertions.

**7. CHECKPOINT.** Did I verify force signs? Did I check conservation? Did the simulation produce physically plausible results? If any fail → ON_FAILURE escape → reason freely about what went wrong.

## WALKTHROUGH 3: Security Review

User asks: *"Review this discount code handler for security issues."*

**1. DECIDE.** Code review for security. Matches "reviewing code for bugs, security issues." → Call.

**2. MODE.** Security is one concern but may cross into race conditions + data leaks. → `"mode": "code-multi"`

**3. CRAFT.** `"Review discount code handler for TOCTOU race conditions and data leakage in the remaining_uses decrement path"`

**4. RECEIVE.** A Security ability:
```
[CODE FAILURE]
promo.remaining_uses -= 1  # Python-side decrement
db.session.commit()
# BUG: Between read and write, another request can use the same promo
# TOCTOU: Time-of-check to time-of-use race condition

[CORRECT PATTERN]
Promotion.remaining_uses = Promotion.remaining_uses - 1  # Atomic SQL expression
# The decrement happens in the database, not in Python memory

Suppress: python_side_state_mutation_for_concurrent_resources; symptom_level_fix
```

**5. ABSORB.** The [CODE FAILURE] shows the race: Python reads the count, another request reads the same count, both decrement, one use is lost. The [CORRECT PATTERN] moves the decrement to an atomic SQL expression. SUPPRESS: don't just add a lock; fix the root cause (the non-atomic operation).

**6. EXECUTE.** Find all state mutations on shared resources. For each: is the operation atomic at the database level, or does it read-modify-write through Python? Flag every non-atomic path.

**7. SUPPRESS CHECK.** Did I suggest a Python-side fix (symptom) when a SQL-level fix (root cause) exists? Did I miss data leakage from the timing window? If yes → revise.

---

## THE 13 ENGINEERING DOMAINS

You do not choose the domain. The API routes automatically. Knowing them helps craft sharper queries that activate the right ability.

| Domain | Activates on | What it prevents |
|:-------|:-------------|:-----------------|
| **Debugging** | "Why does this fail?" / stack traces / test failures | Fixing symptoms instead of root cause, patching without reproducing |
| **Generation** | "Write this function/module" | Monolithic code, algorithm commitment without verification |
| **Testing** | "Write tests" / "verify edge cases" | Missing boundary conditions, untested failure paths |
| **Architecture** | "Design this system" / decomposition | Components that work alone but don't connect |
| **Security** | "Review auth flow" / credential handling | Injection, TOCTOU races, credential leaks, IDOR |
| **API Grounding** | "Call this library" / API usage | Hallucinated methods, wrong signatures, non-existent parameters |
| **Performance** | "Optimize this" / complexity analysis | Premature micro-optimization, missing O(n) improvements |
| **DevOps** | "Deploy" / CI/CD / environment config | Assuming Linux on Windows, wrong env vars, broken pipelines |
| **Quality** | "Clean up" / naming / readability | Impressive-but-unmaintainable code over clear-and-correct code |
| **Resilience** | "Handle failures" / error paths | Silently swallowing errors, missing recovery paths |
| **Frontend** | "Build UI" / component state / rendering | State management bugs, lifecycle issues, rendering race conditions |
| **Context Management** | Long sessions / multi-file changes | Losing track of constraints, requirements, and prior decisions across files |
| **Agent Safety** | AI-generated code review | Hallucinated APIs, over-generation, credential sprawl, excessive I/O |

**Query targeting examples:**

| Instead of... | Target with... | Activates |
|:-------------|:---------------|:----------|
| "Fix the bug" | "Debug why this BFS fails on test 3; likely sentinel collision" | Debugging |
| "Write code" | "Generate a rate-limited API client with retry and circuit breaker" | Generation + Resilience |
| "Review this" | "Review this PR for TOCTOU races in the discount code path" | Security |
| "Make it faster" | "Profile this query; suspect O(n²) in the join, need O(n log n)" | Performance |
| "Check the API calls" | "Verify all Stripe API method signatures against v2024-12 docs" | API Grounding |

---

## ANTI-PATTERNS

| Do not | Why |
|:-------|:----|
| Acknowledge the injection and then write code your way | The injection must shape your code; the [CODE FAILURE] shows the exact bug to avoid |
| Skip the BACKTRACK IF condition | It names when your approach is wrong; ignoring it means you'll generate failing code faster |
| Skip the Suppress post-check | Suppression catches hallucinated APIs, lost guards, and sentinel collisions |
| Call for boilerplate or config | Wastes calls; CRUD, imports, and formatting don't need engineering augmentation |
| Send vague queries ("write code") | Retrieval precision depends on naming the failure risk |
| Reuse one injection across files | Each code challenge needs fresh routing |

---

## QUICK REFERENCE

```
1. DECIDE     → Task matches a code pattern? Yes → call. No → skip.
2. MODE       → Single concern → "code". Cross-cutting → "code-multi".
3. CRAFT      → Specific task + failure risk in 1-2 sentences
4. CALL       → POST /logicv1/ with query + mode
5. VALIDATE   → Non-empty response, key matches mode. Relevance check on CODE FAILURE.
6. ABSORB     → CODE FAILURE (wrong code), PROCEDURE (plan + backtrack), SUPPRESS (blockers)
7. EXECUTE    → Write code following topology, compare against CORRECT PATTERN
8. SUPPRESS   → Post-check: does code exhibit any suppressed pattern? Revise if yes.
9. CHECKPOINT → (Multi only) META-CHECKPOINT before output. On failure → ON_FAILURE escape.
10. VERIFY    → Check against VERIFICATION criterion
11. RETRY     → If failed, re-query with failure description (max 2)
```

---

Routing across multiple harnesses, or stacking two modes together (e.g. `code` + `anti-deception` for PR reviews under stakeholder pressure)? See [skill_unified](/docs/skill_unified).
