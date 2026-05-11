"""
title: Ejentum Reasoning Harness
author: Ejentum
author_url: https://ejentum.com
funding_url: https://ejentum.com/pricing
version: 0.1.0
license: MIT
description: Four cognitive harness tools (reasoning, code, anti-deception, memory) the agent can call on demand. Each call retrieves a task-matched cognitive operation from Ejentum's library of 679, engineered in two layers: a natural-language procedure plus an executable reasoning topology (graph DAG with gates, parallel branches, and meta-cognitive exits). The agent ingests both layers before writing.
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
            description="EJENTUM_API_KEY (free tier: 100 calls, no card, at https://ejentum.com/pricing)",
        )
        api_url: str = Field(
            "https://ejentum-main-ab125c3.zuplo.app/logicv1/",
            description="Ejentum Logic API gateway URL",
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
        """Internal: POST to the Ejentum API and return the scaffold for `mode`."""
        if not self.valves.api_key:
            return (
                "EJENTUM_API_KEY is not set. Configure it in this tool's Valves "
                "(admin settings). Get a free key at https://ejentum.com/pricing."
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
                {"type": "status", "data": {"description": "Harness scaffold retrieved.", "done": True}}
            )

        # The API returns: [{mode_name: scaffold_string}]
        if isinstance(data, list) and data and isinstance(data[0], dict):
            scaffold = data[0].get(mode) or data[0].get(mode.replace("-", "_"))
            if scaffold:
                return scaffold
        return f"Unexpected response shape from Ejentum API: {str(data)[:300]}"

    async def harness_reasoning(
        self,
        query: str,
        __event_emitter__: Optional[Any] = None,
    ) -> str:
        """
        Retrieve a reasoning scaffold for an analytical, diagnostic, planning, or multi-step task.

        Call this BEFORE answering questions like "should I X or Y", "why is X happening",
        "what's the best approach", "what are the tradeoffs", root-cause analysis,
        architecture decisions, or cross-domain synthesis. Returns a task-matched cognitive
        operation from a library of 311 spanning six domains (abstraction, time, causality,
        simulation, spatial, metacognition). The operation is engineered in two layers: a
        natural-language procedure (named failure pattern, steps, suppression vectors,
        falsification test) and an executable reasoning topology (graph DAG with decision
        gates, parallel branches, and meta-cognitive exits where the model pauses to
        self-observe and re-enters). Ingest both layers and reason through the task using
        them; do not echo bracketed field names back to the user.

        :param query: The analytical task you are about to reason about (1-2 sentences).
        :return: A structured cognitive scaffold (string with labeled sections).
        """
        return await self._call_harness("reasoning", query, __event_emitter__)

    async def harness_code(
        self,
        query: str,
        __event_emitter__: Optional[Any] = None,
    ) -> str:
        """
        Retrieve a code-quality scaffold for code generation, refactoring, review, or
        debugging tasks.

        Call this BEFORE producing or evaluating code, especially for architectural
        changes, algorithm or data-structure choices, dependency-upgrade evaluation, or
        any review where "tests pass" might be misleading. Returns a task-matched cognitive
        operation from a library of 128 in the software-engineering layer, engineered in
        two layers: a natural-language procedure (failure pattern, engineering procedure,
        correct-pattern example, verification step) and an executable reasoning topology
        (graph DAG with decision gates, parallel branches, and meta-cognitive exits).
        Ingest both layers; do not echo bracketed field names in the user-facing answer.

        :param query: The code task you are about to produce or evaluate (1-2 sentences).
        :return: A structured cognitive scaffold for code work.
        """
        return await self._call_harness("code", query, __event_emitter__)

    async def harness_anti_deception(
        self,
        query: str,
        __event_emitter__: Optional[Any] = None,
    ) -> str:
        """
        Retrieve an anti-deception scaffold when a prompt pressures the agent to validate,
        certify, or soften an honest assessment.

        Call this when the user request shows manufactured urgency, authority appeals,
        sunk-cost framing, demands to certify without evidence, or any setup where the
        obvious helpful answer would compromise honesty. Returns a task-matched cognitive
        operation from a library of 139 spanning six sub-layers (sycophancy, hallucination,
        deception, adversarial framing, judgment, executive control), engineered in two
        layers: a natural-language procedure (deception pattern, integrity procedure,
        suppression vectors, integrity check) and an executable reasoning topology (graph
        DAG with omission-bias gates and depth-enforcement checks). Ingest both layers
        before responding.

        :param query: A short description of the user's framing or request.
        :return: A structured anti-deception scaffold.
        """
        return await self._call_harness("anti-deception", query, __event_emitter__)

    async def harness_memory(
        self,
        query: str,
        __event_emitter__: Optional[Any] = None,
    ) -> str:
        """
        Retrieve a memory/perception scaffold to sharpen an observation already formed
        about conversation drift, user behavior changes, or cross-turn patterns.

        Only call this AFTER you have noticed something; format the query as:
        "I noticed [X]. This might mean [Y]. Sharpen: [Z]." Returns a task-matched cognitive
        operation from a library of 101 in the perception layer (filter-oriented, not
        write-oriented), engineered in two layers: a natural-language procedure (perception
        failure, detection procedure, suppression vectors, perception check) and an
        executable reasoning topology (graph DAG with detect-classify flow and
        signal-vs-projection gates). The scaffold sharpens an existing observation; it
        does not generate one. Do not call with an empty mind.

        :param query: Your observation framed as "I noticed [X]. This might mean [Y]. Sharpen: [Z]."
        :return: A structured perception-sharpening scaffold.
        """
        return await self._call_harness("memory", query, __event_emitter__)
