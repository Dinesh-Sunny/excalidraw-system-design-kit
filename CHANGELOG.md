# Changelog

All notable changes to the kit. Versions follow [Semantic Versioning](https://semver.org): new items = minor, renames or removals = major.

## [Unreleased]
- Practice redesign: a full-screen workspace with the steps as tabs at the top, one centred column to read and answer in, and one action button always in the same place at the bottom right (Show answer, then Next). The design step fills the screen with the canvas and a one-line reason per block; deep dives come one question at a time. Less text everywhere. Enter or the right arrow moves on, the left arrow goes back.
- Practice mode (`/practice/`): all 21 full designs as guided interviews in 7 steps - requirements, estimates, API, data model, the high-level design built one block at a time (with why each block is there), deep dives as tap-to-reveal questions, and wrap-up with a self-check. Every step shows what the interviewer checks and a line to say out loud. 45-minute timer, progress saved in your browser, filters by track, level and company (from public candidate reports), and Copy to Excalidraw at the end. Linked from the top bar and from every design's preview.
- Block preview zoom: click the picture to zoom in where you clicked (click again to fit), scroll or pinch to zoom up to 800%, drag to move around, zoom buttons with the current %, full screen, and + / - / 0 keys. Zooming switches to the vector picture so text stays sharp.
- Site design pass: calmer hero (one quiet trust line, fewer chips), one "Made in the open" row with Star, Share and Follow menus, stories only when real ones exist, a single sponsor slot when there are none, a tidier block preview (Copy to Excalidraw, Copy image, Copy SVG, More menu, one-line "Helpful?"), a lighter "Keep exploring", and the badge snippet moved to the README. Links with #i=, #pack= and section hashes now work without a reload.
- Site: a "New" pill under the toolbar, live trust line (stars and downloads once they pass a threshold, last updated), "Paste into" strip, and a "Made in the open" section: stories from people using the kit (`docs/love.json`, real quotes only), share buttons, a "Made with System Design Kit" badge, release notifications (Watch, RSS) and who makes it.
- Site: one gentle "Share" nudge after your second copy; share on the download thank-you; structured data for search engines.
- Sponsor page: secure checkout and public stats called out, plus a live audience line.
- Site: "How is this block?" in every preview - one tap opens a short GitHub form with the block already filled in (or say it's useful with a heart). New issue forms: block feedback, request a block, something to polish.
- Site: help links go straight to the right place (Q&A for questions, Ideas for ideas); end-of-list links to request a block, show what you built and share an idea.
- Site: gentle motion (content rises in as you scroll, hover lifts, smoother pop-ups and FAQ), off when your system asks for reduced motion.
- Site: the board bar's close button now just hides the bar (your board stays saved); clearing lives on the board page with Undo.
- Sponsor page: "Backed by" is centred, and Questions sit beside a short intro with ways to reach us.
- Site: copy any block straight to Excalidraw (paste with Cmd/Ctrl V, also in Excalidraw+ and Obsidian), copy as image (Docs, Slides, Notion, Slack) or SVG (Figma), download PNG, SVG or .excalidraw.
- Site: 12 starter packs (Interview starter, Classic web backend, RAG starter, AI agents and MCP and more) that paste as one laid-out board.
- Site: save blocks to your own board, then copy or download them all at once; share a board or a block by link.
- Site: a new block preview with browse arrows, keyboard keys (arrows, C, S), swipe on phones, "More like this" and the packs it belongs to.
- Site: lists end with "Keep exploring" (next section, packs, every section, surprise me) instead of stopping; recently viewed row; back to top.
- Sponsors: a contextual sponsor spot in the block preview and at the end of each list (a sponsor can target sections with `cats`).
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
