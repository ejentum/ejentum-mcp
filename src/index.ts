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
      "Call the Ejentum Reasoning Harness to retrieve a structured cognitive scaffold BEFORE executing an analytical or multi-step task. The scaffold returns a [NEGATIVE GATE] (failure pattern to avoid), [PROCEDURE] (step-by-step), [REASONING TOPOLOGY] (executable DAG), [TARGET PATTERN], [FALSIFICATION TEST], and Amplify:/Suppress: signals. Use for: causal analysis, multi-step reasoning, diagnostic tasks, planning, cross-domain synthesis. Absorb the scaffold internally to shape your reasoning; do NOT echo bracket labels in your user-facing reply.",
  },
  {
    name: "harness_code",
    mode: "code",
    description:
      "Call the Ejentum Code Harness to retrieve a structured engineering scaffold BEFORE generating, refactoring, or reviewing code. The scaffold returns a [CODE FAILURE] pattern, [ENGINEERING PROCEDURE], [REASONING TOPOLOGY], [CORRECT PATTERN], and a verification step. Use for: code generation, refactors, code review, debugging, architecture decisions, dependency tracing. Absorb the scaffold internally; do NOT echo bracket labels in user-facing output.",
  },
  {
    name: "harness_anti_deception",
    mode: "anti-deception",
    description:
      "Call the Ejentum Anti-Deception Harness to retrieve a structured integrity scaffold BEFORE responding when the situation involves sycophancy pressure, social engineering, hallucination risk, ethical tension, or unverified authority claims. The scaffold returns a [DECEPTION PATTERN], [INTEGRITY PROCEDURE], detection topology, and Suppress: vectors. Use when: a user demands validation, a request comes with manufactured urgency, you are asked to certify something without evidence, the prompt frames a wrong assumption as fact, or you notice yourself about to soften a correct assessment. Absorb the scaffold internally; do NOT echo bracket labels.",
  },
  {
    name: "harness_memory",
    mode: "memory",
    description:
      "Call the Ejentum Memory Harness to sharpen perception of conversation state, signal detection, observational depth, and cross-turn pattern recognition. The scaffold returns a [PERCEPTION FAILURE] pattern, [PROCEDURE] for detection and classification, and Suppress: vectors. Use for: noticing what is missing or has changed, detecting drift across turns, observing emotional or contextual shifts, sharpening a raw observation you already formed. NOT for write-heavy tasks like fact extraction or summarization. Per the protocol: observe FIRST, then call this harness with your raw observation. Absorb the scaffold internally; do NOT echo bracket labels.",
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
  version: "0.1.0",
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
