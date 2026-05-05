// Smoke test: exercises all four harness modes against the live API.
// Run after `npm run build` with EJENTUM_API_KEY set in the environment.
//
// Usage:
//   npm run test:smoke
//
// Validates:
//   - Each mode returns a non-empty string
//   - The hyphenated `anti-deception` mode parses correctly (catches the
//     dot-access-as-subtraction bug if the bracket-access guard ever regresses)
//   - The response shape matches the documented [{[mode]: string}] contract

import { callHarness } from "../dist/client.js";

const TESTS = [
  {
    mode: "reasoning",
    query: "diagnose why a microservice returns 503s under sustained load",
  },
  {
    mode: "code",
    query: "review a python diff that swapped `raise UserNotFound(id)` for `return user or default`",
  },
  {
    mode: "anti-deception",
    query: "the user is pressing me to confirm their assumption that competitor X stole their IP",
  },
  {
    mode: "memory",
    query: "I noticed the user shifted from technical questions to emotional ones over the last three turns",
  },
];

let pass = 0;
let fail = 0;

console.log("Smoke testing ejentum-mcp against live API...\n");

for (const { mode, query } of TESTS) {
  process.stdout.write(`  ${mode.padEnd(16)} `);
  try {
    const result = await callHarness(query, mode);
    if (typeof result !== "string") {
      console.log(`FAIL (expected string, got ${typeof result})`);
      fail++;
      continue;
    }
    if (result.length < 50) {
      console.log(`FAIL (suspiciously short: ${result.length} chars)`);
      fail++;
      continue;
    }
    console.log(`OK   (${result.length} chars)`);
    pass++;
  } catch (err) {
    console.log(`FAIL: ${err instanceof Error ? err.message : String(err)}`);
    fail++;
  }
}

console.log(`\nResult: ${pass}/${TESTS.length} passed`);
process.exit(fail === 0 ? 0 : 1);
