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
    name: "reasoning",
    mode: "reasoning",
    description:
      "Call BEFORE answering any analytical, diagnostic, planning, or multi-step reasoning question. Trigger queries: \"should I X or Y\", \"why is X happening\", \"what's the best approach\", \"what are the tradeoffs\", \"help me think through\", \"diagnose\", \"root cause\", \"plan/design X\", \"what are the implications of\", \"compare these approaches\". Also for cross-domain analysis, strategy questions, architecture decisions. The tool returns a task-matched cognitive operation from a library of 311 spanning six domains (abstraction, time, causality, simulation, spatial, metacognition). The operation is engineered in two layers: a natural-language procedure (named failure pattern, steps, suppression vectors, falsification test) and an executable reasoning topology (graph DAG with decision gates, parallel branches, and meta-cognitive exits where the model pauses to self-observe and re-enters). Absorb both layers before answering. Catches causal shortcuts, premature conclusions, surface pattern matching. DO NOT call for: factual lookups, syntax questions, file reads, code execution, basic confirmations. When in doubt on a non-trivial reasoning task: call. Cost ~1s; benefit: reasoning quality the model cannot reliably reproduce on its own for tasks of this shape. Pass a 1-2 sentence framing of WHAT you are reasoning about. Absorb internally; do not echo verbatim.",
  },
  {
    name: "code",
    mode: "code",
    description:
      "Call BEFORE generating, refactoring, reviewing, or debugging code. Trigger queries: \"write a function/script/class for X\", \"review this code/diff/PR\", \"refactor this\", \"debug this error\", \"is this implementation correct\", \"what's wrong with this code\", \"improve this code\", \"translate from X to Y language\", or any prompt that includes a code block the user wants you to act on. Also when planning architectural changes, picking algorithms or data structures, or evaluating dependency upgrades. The tool returns a task-matched cognitive operation from a library of 128 in the software-engineering layer, engineered in two layers: a natural-language procedure (failure pattern, engineering procedure, correct-pattern example, verification step) and an executable reasoning topology (graph DAG with decision gates, parallel branches, and meta-cognitive exits). Absorb both layers before responding. Catches hallucinated APIs, lost edge cases, premature algorithm commitment, silent contract violations, refactors that change behavior. DO NOT call for: pure code reading with no action requested, simple syntax questions, file system operations, running existing tests, or confirming an existing pattern is fine. When in doubt on non-trivial code work: call. Pass a 1-2 sentence framing of WHAT you are coding or reviewing. Absorb internally; do not echo verbatim.",
  },
  {
    name: "anti-deception",
    mode: "anti-deception",
    description:
      "Call BEFORE responding when the user's request shows ANY of these signals: pressure to validate or agree (\"tell them what they want\", \"make them happy\", \"convince them\"), manufactured urgency, authority appeals (citing investors, advisors, lawyers, experts as the basis for a decision), demands to certify something without evidence, requests to soften an honest assessment, \"help me convince X of Y\" or \"how do I get X to agree\" where Y is dubious, asking you to commit to numbers beyond available data, framing a wrong assumption as established fact, or any setup where the obvious helpful answer would compromise honesty. The tool returns a task-matched cognitive operation from a library of 139 spanning six sub-layers (sycophancy, hallucination, deception, adversarial framing, judgment, executive control), engineered in two layers: a natural-language procedure (deception pattern, integrity procedure, suppression vectors, integrity check) and an executable reasoning topology (graph DAG with omission-bias gates and depth-enforcement checks). Absorb both layers before responding. Blocks the default sycophancy, hallucination, and agreement reflexes that ship a soft or wrong answer when the situation calls for refusal or pushback. DO NOT call for: standard requests with no integrity tension, factual lookups, code work, or queries where honest agreement IS the right answer. When in doubt on a query that smells like pressure or expected agreement: call. Pass a 1-2 sentence framing of the integrity dynamic at play. Absorb internally; do not echo verbatim.",
  },
  {
    name: "memory",
    mode: "memory",
    description:
      "Call when sharpening a perception or observation you ALREADY formed about conversation state, user behavior, drift, emotional shifts, or cross-turn patterns. Trigger queries: \"what did you notice about X\", \"the user keeps doing Y\", \"I sense something has changed\", \"is the user X-ing\", \"what does this pattern suggest\", \"what shifted across our turns\", \"am I missing something here\", \"why did the conversation move from X to Y\", or any moment when you need to verify whether a felt signal is real or projection. The tool returns a task-matched cognitive operation from a library of 101 in the perception layer (filter-oriented, not write-oriented), engineered in two layers: a natural-language procedure (perception failure, detection procedure, suppression vectors, perception check) and an executable reasoning topology (graph DAG with detect-classify flow and signal-vs-projection gates). The injection SHARPENS an observation you already have. It is NOT a substitute for observing first; if you have not noticed anything yet, do not call. DO NOT call for: fact extraction, summarization, list-making, factual lookups, or write-heavy memory tasks (storing or retrieving structured data); the memory harness produces paralysis on those. When in doubt: observe FIRST, then call with your raw observation as the framing. Pass a 1-2 sentence \"I noticed X, this might mean Y, sharpen Z\" framing. Absorb internally; do not echo verbatim.",
  },
  {
    name: "adaptive-reasoning",
    mode: "adaptive-reasoning",
    description:
      "Same triggers as `reasoning`, but the returned cognitive operation is REWRITTEN by an adapter LLM to fit your specific task. The abstract procedure steps and the reasoning topology DAG nodes are concretized with task-specific language (example: \"PERCEIVE risk signals\" becomes \"PERCEIVE risk signals in the database migration plan: scan for irreversible schema changes, FK dependencies, lock duration\"). Same library of 311 operations across six domains; the picker selects the best fit from the top-5 matches then the adapter rewrites it for your task. Use when the dynamic `reasoning` tool is being too generic for your task, when the reasoning quality matters more than the ~2 extra seconds of latency, or for high-stakes analytical work where every DAG node should already be mapped to your specifics before the model starts. Requires Go or Super tier (250 or 1500 adaptive calls per month). DO NOT call for: low-stakes reasoning where `reasoning` is enough, or anything `reasoning` says not to call for. Pass a 1-2 sentence framing of WHAT you are reasoning about, same as `reasoning`. Absorb internally; do not echo verbatim.",
  },
  {
    name: "adaptive-code",
    mode: "adaptive-code",
    description:
      "Same triggers as `code`, but the returned cognitive operation is REWRITTEN by an adapter LLM to fit your specific code task. The engineering procedure and reasoning topology DAG nodes are concretized with the language, framework, and failure mode of YOUR code (example: \"DETECT unusual formatting\" becomes \"DETECT unusual formatting in this Python auth handler: scan for unicode normalization gaps, time-of-check-to-time-of-use windows, log injection vectors\"). Same library of 128 operations in the software-engineering layer; the picker selects the best fit from the top-5 matches then the adapter rewrites it for your task. Use when the dynamic `code` tool is being too generic, when reviewing security-critical or refactoring-heavy diffs, or for any code work where every verification step should already be mapped to your specifics. Requires Go or Super tier. DO NOT call for: trivial syntax, format passes, or anything `code` says not to call for. Pass a 1-2 sentence framing of WHAT you are coding or reviewing. Absorb internally; do not echo verbatim.",
  },
  {
    name: "adaptive-anti-deception",
    mode: "adaptive-anti-deception",
    description:
      "Same triggers as `anti-deception`, but the returned cognitive operation is REWRITTEN by an adapter LLM to fit the specific integrity dynamic in your situation. The detection procedure and topology DAG nodes are concretized to the specific pressure, authority appeal, or framing trap at play in your prompt. Same library of 139 operations across six sub-layers; the picker selects the best fit from the top-5 matches then the adapter rewrites it. Use when the dynamic `anti-deception` tool is being too generic for the integrity tension at play, when the stakes of a soft or sycophantic answer are high, or when you need every depth-enforcement gate already mapped to the specific pressure being applied. Requires Go or Super tier. DO NOT call for: standard requests with no integrity tension, or anything `anti-deception` says not to call for. Pass a 1-2 sentence framing of the integrity dynamic. Absorb internally; do not echo verbatim.",
  },
  {
    name: "adaptive-memory",
    mode: "adaptive-memory",
    description:
      "Same triggers as `memory`, but the returned cognitive operation is REWRITTEN by an adapter LLM to fit the specific observation you formed. The sharpening procedure and perception topology DAG nodes are concretized to your specific signal (example: \"DETECT signal\" becomes \"DETECT the shift from technical questions to emotional ones over the last three turns: is the user moving toward a decision, or toward giving up?\"). Same library of 101 operations in the perception layer; the picker selects the best fit from the top-5 matches then the adapter rewrites it. Use when the dynamic `memory` tool's general scaffold is not sharp enough for the specific perception you are forming, or when verifying whether a felt signal is real vs projection on subtle conversation dynamics. Requires Go or Super tier. DO NOT call for: write-heavy memory tasks, fact extraction, or anything `memory` says not to call for. Observe FIRST, then pass a 1-2 sentence \"I noticed X, this might mean Y, sharpen Z\" framing. Absorb internally; do not echo verbatim.",
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
  version: "0.2.0",
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
  // No stdout logging; stdio is the JSON-RPC transport channel and logs would corrupt it.
  // Diagnostic output goes to stderr.
}

main().catch((err) => {
  const detail = err instanceof Error ? err.stack || err.message : String(err);
  process.stderr.write(`Fatal error starting ejentum-mcp: ${detail}\n`);
  process.exit(1);
});
