# Changelog

All notable changes to the kit. Versions follow [Semantic Versioning](https://semver.org): new items = minor, renames or removals = major.

## [Unreleased]
- Sponsors: a sponsor page (tiers for people and companies, founding offer, FAQ), a Sponsor button on the site and in the repo, a thank-you step after download, a "Backed by" row, README sponsors section and BACKERS.md. All driven by `generator/sponsor.json`.

## [1.5.0] - 2026-10-27
- Canvas fit: groups and flows now fit next to the rest of your design. Clients Group and AI Clients Group are a 2 x 2 grid. Long one-row flows (Transactional Outbox, Write-Through, Prompt Chaining, Evaluator-Optimizer, Orchestrator-Workers, Parallelization, Human-in-the-Loop, 3-Tier, First Request) wrap into compact shapes.
- Notes sit under each diagram instead of beside it, so items grow down, not sideways.
- Every block is 160 x 100 (120 with a two-line title) and snaps to the 20 px grid; one block height per diagram.
- Subtitles use 20 px, in line with the Excalidraw type scale. New "Canvas fit rules" in CONTRIBUTING.md.
- Item names are unchanged, so search and existing boards keep working.

## [1.4.0] - 2026-10-27
- Icons: every block now has its own icon (about 55 new ones), so no two blocks look alike. Databases show PG / My, caches show Redis vs Memcached, and AI, RAG, agent and LLMOps blocks each get a clear symbol.
- Section tiles widen to fit long titles.
- Item names are unchanged, so search and existing boards keep working.
- Site: light / dark toggle, GitHub star button, a Get the kit guide for excalidraw.com, Obsidian and Excalidraw+, a live demo, self-hosted fonts, and fixes for small screens.

## [1.3.0] - 2026-10-27
First public release.
- Namespace: every item now starts with `sd:` (`sd:<section>/ <Item> - <tags>`) so the kit never mixes with other libraries.
- Sections renumbered 00-21 with divider tiles `SD NN SECTION - ...`.
- Removed the plain arrow item (too simple to be useful).

## [1.2.0] - 2026-10-27
- AI area: `ai/` models (13), `agent/` agents and orchestration (17), `rag/` retrieval (11), `llmops/` safety and evals (11).
- `agentic/` patterns (12): prompt chaining, routing, parallelization, orchestrator-workers, evaluator-optimizer, autonomous agent, multi-agent supervisor, agentic RAG, memory, human-in-the-loop, MCP architecture, A2A.
- 5 new full designs: coding agent, deep research agent, customer support agent, realtime voice agent, enterprise AI gateway.

## [1.1.0] - 2026-10-27
- Devices: laptop, tablet, smart TV, smartwatch, voice speaker, car, kiosk, partner API/SDK, bot.
- AI clients: AI chat app, AI agent, MCP client, IDE copilot, voice AI, browser agent, automation/webhook, CLI.
- Starters: Clients Group, AI Clients Group, First Request (classic), First Request (AI).
- Laptop device frame. `client` and `clients` now find every client item.

## [1.0.0] - 2026-10-27
- 232 items: interview notes, building blocks, zones, arrows, UI parts, device frames, 13 screens, 12 patterns, 16 full designs.
