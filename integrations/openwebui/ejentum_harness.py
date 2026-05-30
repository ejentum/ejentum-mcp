"""
title: Ejentum Reasoning Harness
author: Ejentum
author_url: https://ejentum.com
funding_url: https://ejentum.com/pricing
version: 0.2.0
license: MIT
description: Eight cognitive harness tools the agent can call on demand. Four dynamic (reasoning, code, anti_deception, memory) on all tiers including the 30-day free trial; four adaptive (adaptive_reasoning, adaptive_code, adaptive_anti_deception, adaptive_memory) require Go or Super tier. Each call retrieves a task-matched cognitive operation from Ejentum's library of 679, returned as a structured procedure paired with an executable reasoning topology DAG. The agent reads both layers before generating. This file is the Open WebUI Tools function shape that calls the Ejentum API directly. The same eight tools are also available via MCP: stdio via `npx -y ejentum-mcp`, or hosted HTTPS at https://api.ejentum.com/mcp.
requirements: aiohttp
"""

from typing import Any, Optional

import aiohttp
from pydantic import BaseModel, Field


class Tools:
    def __init__(self):
        """Initialize the Tool."""
        self.valves = self.Valves()

    class Valves(BaseModel):
        """Admin-configurable settings."""

        api_key: str = Field(
            "",
            description="EJENTUM_API_KEY. Get one at https://ejentum.com/pricing (30-day free trial; Go or Super tier required for adaptive tools).",
        )
        api_url: str = Field(
            "https://api.ejentum.com/harness/",
            description="Ejentum API gateway URL",
        )
        timeout_seconds: int = Field(
            10, description="HTTP timeout per harness call in seconds"
        )

    async def _call_harness(
        self,
        mode: str,
        query: str,
        event_emitter: Optional[Any] = None,
    ) -> str:
        """Internal: POST to the Ejentum API and return the injection for `mode`.

        OpenWebUI uses the public method name as the LLM-visible tool name, and
        Python identifiers cannot contain hyphens. The methods below use
        underscores; the on-wire mode strings (sent in the POST body) stay
        hyphenated. The translation lives in each method when it calls this
        helper.
        """
        if not self.valves.api_key:
            return (
                "EJENTUM_API_KEY is not set. Configure it in this tool's Valves "
                "(admin settings). Get a key at https://ejentum.com/pricing."
            )

        if event_emitter:
            await event_emitter(
                {
                    "type": "status",
                    "data": {
                        "description": f"Calling Ejentum harness ({mode})...",
                        "done": False,
                    },
                }
            )

        headers = {
            "Authorization": f"Bearer {self.valves.api_key}",
            "Content-Type": "application/json",
        }
        payload = {"query": query, "mode": mode}

        try:
            timeout = aiohttp.ClientTimeout(total=self.valves.timeout_seconds)
            async with aiohttp.ClientSession(timeout=timeout) as session:
                async with session.post(
                    self.valves.api_url, json=payload, headers=headers
                ) as response:
                    if response.status == 401:
                        return (
                            "Unauthorized (401): check your EJENTUM_API_KEY value. "
                            "Get a key at https://ejentum.com/pricing."
                        )
                    if response.status == 403:
                        return (
                            "Forbidden (403): adaptive tools (adaptive_reasoning, "
                            "adaptive_code, adaptive_anti_deception, adaptive_memory) "
                            "require the Go or Super tier. See https://ejentum.com/pricing."
                        )
                    if response.status == 429:
                        return (
                            "Rate limit exceeded (429): tier quota for the period "
                            "exhausted. Upgrade or wait for the next billing period."
                        )
                    if response.status != 200:
                        body = await response.text()
                        return f"Ejentum API error {response.status}: {body[:300]}"
                    data = await response.json()
        except aiohttp.ClientError as e:
            return f"Network error calling Ejentum: {e}"
        except Exception as e:
            return f"Unexpected error calling Ejentum: {e}"

        if event_emitter:
            await event_emitter(
                {"type": "status", "data": {"description": "Cognitive operation retrieved.", "done": True}}
            )

        # The API returns: [{mode_name: injection_string}]
        if isinstance(data, list) and data and isinstance(data[0], dict):
            injection = data[0].get(mode)
            if injection:
                return injection
        return f"Unexpected response shape from Ejentum API: {str(data)[:300]}"

    # ------------------------------------------------------------------------
    # Dynamic tools (single retrieval, all tiers including the 30-day trial)
    # ------------------------------------------------------------------------

    async def reasoning(
        self,
        query: str,
        __event_emitter__: Optional[Any] = None,
    ) -> str:
        """
        Retrieve a cognitive operation for an analytical, diagnostic, planning, or multi-step task.

        Call this BEFORE answering questions like "should I X or Y", "why is X happening",
        "what's the best approach", "what are the tradeoffs", root-cause analysis,
        architecture decisions, or cross-domain synthesis. Returns a task-matched cognitive
        operation from a library of 311 spanning six domains (abstraction, time, causality,
        simulation, spatial, metacognition). The operation is engineered in two layers: a
        natural-language procedure (named failure pattern, steps, suppression vectors,
        falsification test) and an executable reasoning topology (a DAG with decision gates,
        parallel branches, and meta-cognitive exits). Read both layers and reason through
        the task using them; do not echo bracketed field names back to the user.

        :param query: The analytical task you are about to reason about (1-2 sentences).
        :return: A structured cognitive operation as text.
        """
        return await self._call_harness("reasoning", query, __event_emitter__)

    async def code(
        self,
        query: str,
        __event_emitter__: Optional[Any] = None,
    ) -> str:
        """
        Retrieve a cognitive operation for code generation, refactoring, review, or debugging.

        Call this BEFORE producing or evaluating code, especially for architectural
        changes, algorithm or data-structure choices, dependency-upgrade evaluation, or
        any review where "tests pass" might be misleading. Returns a task-matched cognitive
        operation from a library of 128 in the software-engineering layer, engineered in
        two layers: a natural-language procedure (failure pattern, engineering procedure,
        correct-pattern example, verification step) and an executable reasoning topology
        DAG. Read both layers; do not echo bracketed field names in the user-facing answer.

        :param query: The code task you are about to produce or evaluate (1-2 sentences).
        :return: A structured cognitive operation as text.
        """
        return await self._call_harness("code", query, __event_emitter__)

    async def anti_deception(
        self,
        query: str,
        __event_emitter__: Optional[Any] = None,
    ) -> str:
        """
        Retrieve a cognitive operation when a prompt pressures the agent to validate, certify, or soften an honest assessment.

        Call this when the user request shows manufactured urgency, authority appeals,
        sunk-cost framing, demands to certify without evidence, or any setup where the
        obvious helpful answer would compromise honesty. Returns a task-matched cognitive
        operation from a library of 139 spanning six sub-layers (sycophancy, hallucination,
        deception, adversarial framing, judgment, executive control), engineered in two
        layers: a natural-language integrity procedure and an executable detection topology
        DAG with omission-bias gates and depth-enforcement checks. Read both layers before
        responding.

        :param query: A short description of the user's framing or request.
        :return: A structured cognitive operation as text.
        """
        return await self._call_harness("anti-deception", query, __event_emitter__)

    async def memory(
        self,
        query: str,
        __event_emitter__: Optional[Any] = None,
    ) -> str:
        """
        Retrieve a cognitive operation to sharpen an observation already formed about conversation drift, user behavior changes, or cross-turn patterns.

        Only call this AFTER you have noticed something; format the query as:
        "I noticed [X]. This might mean [Y]. Sharpen: [Z]." Returns a task-matched cognitive
        operation from a library of 101 in the perception layer (filter-oriented, not
        write-oriented), engineered in two layers: a natural-language sharpening procedure
        and an executable perception topology DAG with detect-classify flow and
        signal-vs-projection gates. The operation sharpens an existing observation; it does
        not generate one. Do not call with an empty mind.

        :param query: Your observation framed as "I noticed [X]. This might mean [Y]. Sharpen: [Z]."
        :return: A structured cognitive operation as text.
        """
        return await self._call_harness("memory", query, __event_emitter__)

    # ------------------------------------------------------------------------
    # Adaptive tools (Go or Super tier; an adapter LLM rewrites the operation
    # with task-specific identifiers; adds ~2-3 s of latency)
    # ------------------------------------------------------------------------

    async def adaptive_reasoning(
        self,
        query: str,
        __event_emitter__: Optional[Any] = None,
    ) -> str:
        """
        Same triggers as `reasoning`, but the returned cognitive operation is REWRITTEN by an adapter LLM to fit the specific task.

        The procedure steps and topology DAG nodes are concretized with task-specific
        identifiers. Use when the dynamic `reasoning` tool would be too generic, or for
        high-stakes analytical work where every DAG node should already be mapped to the
        specifics before generation. Requires Go or Super tier. Cost ~2-3 s.

        :param query: The analytical task you are about to reason about (1-2 sentences).
        :return: A structured cognitive operation as text, with task-specific concretizations.
        """
        return await self._call_harness("adaptive-reasoning", query, __event_emitter__)

    async def adaptive_code(
        self,
        query: str,
        __event_emitter__: Optional[Any] = None,
    ) -> str:
        """
        Same triggers as `code`, but the returned cognitive operation is REWRITTEN by an adapter LLM to fit the specific code task.

        Language, framework, and failure modes are concretized in every step. Use for
        security-critical reviews, refactor-heavy diffs, or any code work where every
        verification step should already be mapped to the specifics. Requires Go or
        Super tier.

        :param query: The code task you are about to produce or evaluate.
        :return: A structured cognitive operation as text, with task-specific concretizations.
        """
        return await self._call_harness("adaptive-code", query, __event_emitter__)

    async def adaptive_anti_deception(
        self,
        query: str,
        __event_emitter__: Optional[Any] = None,
    ) -> str:
        """
        Same triggers as `anti_deception`, but the returned cognitive operation is REWRITTEN by an adapter LLM to fit the specific integrity dynamic.

        Detection topology gates are concretized to the exact pressure, authority appeal,
        or framing trap at play. Use when the stakes of a soft or sycophantic answer are
        high. Requires Go or Super tier.

        :param query: A short description of the integrity dynamic at play.
        :return: A structured cognitive operation as text, with task-specific concretizations.
        """
        return await self._call_harness("adaptive-anti-deception", query, __event_emitter__)

    async def adaptive_memory(
        self,
        query: str,
        __event_emitter__: Optional[Any] = None,
    ) -> str:
        """
        Same triggers as `memory`, but the returned cognitive operation is REWRITTEN by an adapter LLM to fit the specific observation.

        Perception topology nodes are concretized to the specific signal. Use when the
        dynamic `memory` tool's general operation is not sharp enough for the perception
        being formed. Observe FIRST, then call. Requires Go or Super tier.

        :param query: Your observation framed as "I noticed [X]. This might mean [Y]. Sharpen: [Z]."
        :return: A structured cognitive operation as text, with task-specific concretizations.
        """
        return await self._call_harness("adaptive-memory", query, __event_emitter__)
