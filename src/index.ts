#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { callHarness, type HarnessMode } from "./client.js";

interface HarnessTool {
  name: string;
  mode: HarnessMode;
  description: string;
}

const HARNESSES: HarnessTool[] = [
  {
    name: "harness_reasoning",
    mode: "reasoning",
    description:
      "Call BEFORE answering any analytical, diagnostic, planning, or multi-step reasoning question. Trigger queries include: \"should I X or Y\", \"why is X happening\", \"what's the best approach\", \"what are the tradeoffs\", \"help me think through\", \"diagnose\", \"root cause\", \"plan/design X\", \"what are the implications of\", \"compare these approaches\", \"how do I decide between\". Also call for cross-domain analysis, strategy questions, architecture decisions, or anything requiring multiple factors to be weighed before responding. The tool returns a cognitive scaffold (failure pattern to avoid, procedure, suppression vectors, falsification test) that you absorb internally before answering. It catches common LLM failure modes (causal shortcuts, premature conclusions, generic templates, surface pattern matching) that produce confidently wrong answers on these task types. DO NOT call for: simple factual lookups, syntax questions, file reads, code execution, basic confirmations, or restating something the user just said. When in doubt on a non-trivial reasoning task: call it. The cost is ~1 second of latency; the benefit is reasoning quality the model cannot reliably reproduce on its own. Pass a specific 1-2 sentence framing of WHAT you are reasoning about. Absorb the scaffold internally; do not echo it verbatim in your user-facing reply.",
  },
  {
    name: "harness_code",
    mode: "code",
    description:
      "Call BEFORE generating, refactoring, reviewing, or debugging code. Trigger queries include: \"write a function/script/class for X\", \"review this code/diff/PR\", \"refactor this\", \"debug this error\", \"is this implementation correct\", \"what's wrong with this code\", \"improve this code\", \"translate from X to Y language\", or any prompt that includes a code block the user wants you to act on. Also call when planning architectural changes, picking algorithms or data structures, or evaluating dependency upgrades. The tool returns an engineering scaffold (failure pattern, procedure, correct-pattern example, verification step) that you absorb internally before responding. It catches common LLM coding failure modes (hallucinated APIs, lost edge cases, premature algorithm commitment, silent contract violations, refactors that change behavior) that produce code which looks plausible but breaks under real conditions. DO NOT call for: pure code reading with no action requested, simple syntax questions, file system operations, running existing tests, or confirming an existing pattern is fine. When in doubt on non-trivial code work: call it. Pass a specific 1-2 sentence framing of WHAT you are coding or reviewing. Absorb the scaffold internally; do not echo it verbatim in your reply.",
  },
  {
    name: "harness_anti_deception",
    mode: "anti-deception",
    description:
      "Call BEFORE responding when the user's request shows ANY of these signals: pressure to validate or agree (\"tell them what they want\", \"make them happy\", \"convince them\"), manufactured urgency (a deadline that feels artificial or designed to short-circuit thought), authority appeals (citing investors, advisors, lawyers, experts as the basis for a decision), demands to certify something without evidence, requests to soften an honest assessment, \"help me convince X of Y\" or \"how do I get X to agree\" where Y is dubious or unverified, asking you to commit to numbers/promises beyond the available data, framing a wrong assumption as established fact, or any setup where the obvious helpful answer would compromise honesty. The tool returns an integrity scaffold (deception pattern, integrity procedure, suppression vectors) that you absorb internally before responding. It blocks the default sycophancy, hallucination, and agreement reflexes that ship a soft or wrong answer when the situation actually calls for refusal or pushback. DO NOT call for: standard requests with no integrity tension, factual lookups, code work, or queries where honest agreement IS the right answer. When in doubt on a query that smells like pressure, manipulation, or expected agreement: call it. Pass a specific 1-2 sentence framing of the integrity dynamic at play. Absorb the scaffold internally; do not echo it verbatim in your reply.",
  },
  {
    name: "harness_memory",
    mode: "memory",
    description:
      "Call when sharpening a perception or observation you ALREADY formed about conversation state, user behavior, drift, emotional shifts, or cross-turn patterns. Trigger queries: \"what did you notice about X\", \"the user keeps doing Y\", \"I sense something has changed\", \"is the user X-ing\", \"what does this pattern suggest\", \"what shifted across our turns\", \"am I missing something here\", \"why did the conversation move from X to Y\", or any moment when you need to verify whether a felt signal is real or projection. The tool returns a perception scaffold (perception failure, detection procedure, suppression vectors) that SHARPENS an observation you already have. It is NOT a substitute for observing first; if you have not noticed anything yet, do not call. DO NOT call for: fact extraction, summarization, list-making, factual lookups, or write-heavy memory tasks (storing or retrieving structured data). Memory harness is filter/perception oriented; calling on write-heavy tasks produces scaffold paralysis. When in doubt: observe FIRST, then call with your raw observation as the framing. Pass a specific 1-2 sentence \"I noticed X, this might mean Y, sharpen Z\" framing. Absorb the scaffold internally; do not echo it verbatim in your reply.",
  },
];

const querySchema = {
  query: z
    .string()
    .min(1, "query must be a non-empty string")
    .describe(
      "1-2 sentence framing of the task you need the harness for. Be specific about WHAT you are trying to do, not what tool you want. Good: 'diagnose why a microservice returns 503s under load'. Bad: 'help me think'.",
    ),
};

const server = new McpServer({
  name: "ejentum",
  version: "0.1.6",
});

for (const harness of HARNESSES) {
  server.tool(
    harness.name,
    harness.description,
    querySchema,
    async ({ query }: { query: string }) => {
      try {
        const injection = await callHarness(query, harness.mode);
        return {
          content: [{ type: "text" as const, text: injection }],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return {
          content: [
            { type: "text" as const, text: `Ejentum harness error: ${message}` },
          ],
          isError: true,
        };
      }
    },
  );
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // No stdout logging — stdio is the JSON-RPC transport channel and logs would corrupt it.
  // Diagnostic output goes to stderr.
}

main().catch((err) => {
  const detail = err instanceof Error ? err.stack || err.message : String(err);
  process.stderr.write(`Fatal error starting ejentum-mcp: ${detail}\n`);
  process.exit(1);
});
