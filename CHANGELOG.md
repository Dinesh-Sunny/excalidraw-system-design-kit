# Changelog

All notable changes to the kit. Versions follow [Semantic Versioning](https://semver.org): new items = minor, renames or removals = major.

## [Unreleased]
- Learn inside the block preview (pilot: Redis). Open Redis and read from simple to deep: what it is with a friendly sticky-note analogy, how it works inside (6 steps you can tap or play, lit up on a diagram), numbers worth knowing (with sources), a hands-on cache playground (request keys, watch hits, misses and LRU or LFU evictions, play a busy minute), choices you'll make, what to use instead, when it breaks and how you'd notice, its job in real interview designs, lines to say in the interview with the follow-ups they ask next, and a gentle check-yourself. The picture on the left follows what you read; a section bar keeps your place.
- In real systems, for every block: what it usually comes after and talks to (a small map you can tap), and its job in each interview design that uses it, with a link to practise that design.
- Practice start card: the setup screen is now one card with a sentence - "Practise the Classic version with any interviewer, at my pace" - where each highlighted word is a choice. Defaults are ready, so it is one tap to start. No more lists of labels, counts and step chips.
- Practice step bar: when the steps don't fit, they fold into the current step name plus a row of step dots (tap any dot to jump), so the canvas never gets pushed off screen at laptop widths.
- Layout check across every page at 320 to 1440 px, light and dark: header fits at 768 px, the board bar fits small phones, menus open as a bottom sheet on phones, the scorecard reads well before you answer anything, and the design camera no longer shows half of the title while you build.
- One website: Blocks and Practice now share the same header (a Blocks | Practice switch on every page, plus Sponsor, Star and Get the kit) and the same footer (Blocks · Practice · 45-min playbook · Sponsor), including the sponsor pages.
- Blocks to Practice: a "Continue practising" row on the home page with your progress, a Practise button and progress badge on every design card, "Practise them step by step" on the Designs row, and every block preview lists the interview questions that use it (Redis shows URL Shortener, Rate Limiter, Chat System...). The design preview shows the level and your progress, and the closing band and Interview starter pack lead to practice.
- Practice to Blocks: search (press /), Surprise me, Copy and Save on every question card, and "Questions that use <block>" filtering. In the design step, every block you place or tap can be opened in the blocks, saved to your board or copied. A ⋯ menu holds Copy, Save to board, Open in the blocks, Share, Copy as image, Download .excalidraw and Suggest a change; the scorecard gains Save to board and Helpful? feedback. Practice questions show up in Recently viewed, and your board is shared across both.
- Practice, set up your interview: before you start, pick a scenario (Classic plus two real-world twists per question, like "Celebrity scale" or "Realtime feed" for News Feed), an interviewer (Amazon, Google, Meta, Microsoft, Uber, Stripe, Apple - each with what they care about and their typical follow-ups) and a mode (Learn, or Mock with the 45-minute timer running). Scenarios add their own requirements, estimates, deep dives and extra blocks to the design; scenario and interviewer items are tagged on the board. Change it any time from the chip next to the title.
- Practice freshness: every question gains a "2026 upgrades" step (today's defaults, like two-stage ML ranking, lakehouse analytics, passkeys) and one question-specific step (for example "Abuse & safety" for URL Shortener, "Ranking" for News Feed), so no two questions play the same. Content reviewed Oct 2026 and kept fresh by the monthly trends check.
- Practice design step: back to the side panel with the camera following the flow, plus zoom out, Fit and zoom in buttons on the canvas.
- Practice layout pass: one focal point per step. The board builds in the middle and the "Your turn" card sits right under the last answer, so your eyes and cursor stay in one place; on the design step the card floats over the canvas just under the blocks, and the camera keeps the blocks above it. Back and the main button sit together in the centre of the bottom bar. Empty board headings are hidden until something lands. The scorecard now counts first-try answers when you skip the self-rating.
- Practice: every step now plays like the design step. Requirements land as sticky notes (what it does / how well), estimates as you pick the right order of magnitude (with the calculator beside them), API calls fill a code card, data models become table cards, deep-dive answers and wrap-up notes collect on the board. One tap per answer, a thinking prompt when it's wrong ("That one comes from Customer Support Agent. Picture someone using Chat System: what do they actually do?", "Too big. A day has about 100,000 seconds..."), the right option glows after two misses, progress per step and "right first time" counts.
- Practice design step rebuilt: tap the block you think comes next and it lands on the canvas at once (no second click), with the reason right beside it. A wrong pick shakes, crosses out and gives a thinking prompt ("Follow the request: what does Users talk to next to GET /{code}?") instead of the answer; after two misses the right block glows. The canvas camera glides to fit the blocks placed so far, so they read large, and the new block pulses. Tap any block on the canvas to see why it is there. Progress bar per block (green first try, orange after a retry), "6 of 7 right first time" at the end, keys 1-4 to pick.
- Practice tools for every step: build your requirements as chips, a live back-of-envelope calculator (users, writes, reads, size, years → QPS, peaks, storage), an API builder, a data model builder (tables, fields, store type, partition key), and "Your move: which block comes next?" while the design builds, with instant feedback. Hints one at a time, "Compare with a strong answer" marks what you covered and what's worth adding, a "How did you do?" rating on every step, and a scorecard at the end that sends you back to your weakest step.
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
