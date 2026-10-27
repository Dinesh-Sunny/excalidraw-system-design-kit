# System Design & AI Architecture Kit for Excalidraw

![System Design & AI Architecture Kit](previews/hero.png)

A free, searchable [Excalidraw](https://excalidraw.com) library for **system design interviews**, **architecture diagrams** and **agentic AI systems**. 292 ready-made items in 22 sections: building blocks, AI and agent components, UI wireframes, patterns and 21 complete interview designs.

Built so you never drag boxes together live: press **Cmd/Ctrl + /**, type `kafka` or `tpl/ chat`, press Enter, and it is on the board.

**Version 1.3.0** · [Browse every item](https://dinesh-sunny.github.io/excalidraw-system-design-kit/) · [Changelog](CHANGELOG.md) · [Catalog](docs/catalog.md) · MIT licence

---

## What's inside

| Area | Prefix | What you get |
|---|---|---|
| Interview notes | `sd:note/` | Requirements, capacity estimates, API design, data model tables, trade-offs, latency and capacity cheat sheets, step markers |
| Clients and devices | `sd:client/` | Mobile, laptop, tablet, web, TV, watch, voice, car, kiosk, partner API, **AI clients** (chat app, agent, MCP client, IDE copilot, voice AI, browser agent) and **first-request starters** |
| Building blocks | `sd:edge/` `sd:svc/` `sd:data/` `sd:cache/` `sd:msg/` `sd:ops/` `sd:ext/` | DNS, CDN, load balancer, gateway, services, workers, SQL/NoSQL/vector stores, Redis, Kafka, queues, monitoring, third-party APIs |
| AI models | `sd:ai/` | LLM, small/local model, multimodal, speech-to-text, text-to-speech, embeddings, reranker, GPU serving, AI gateway |
| Agents | `sd:agent/` | Agent, supervisor, sub-agent, planner, tools, MCP server, A2A, short/long-term memory, checkpoints, human approval, sandbox, workflow engine |
| RAG | `sd:rag/` | Loaders, chunker, embedding pipeline, vector and BM25 indexes, hybrid retriever, knowledge graph, context builder, citations |
| LLMOps | `sd:llmops/` | Guardrails, PII redaction, prompt registry, evals, LLM-as-judge, tracing, token and cost metering, red teaming, fallback |
| Boundaries and arrows | `sd:zone/` `sd:link/` | Region, AZ, VPC, subnets, trust boundary; REST, gRPC, WebSocket, async, replication arrows |
| UI/UX | `sd:ui/` `sd:frame/` `sd:screen/` | 31 UI parts, device frames, 13 ready screens (login, feed, chat, ride booking, checkout, admin dashboard, AI assistant...) |
| Patterns | `sd:pattern/` `sd:agentic/` | Cache-aside, sharding, CQRS, saga, outbox, multi-region; prompt chaining, routing, orchestrator-workers, evaluator-optimizer, multi-agent, agentic RAG, MCP, A2A |
| Full designs | `sd:tpl/` | URL shortener, rate limiter, chat, news feed, video streaming, ride sharing, notifications, web crawler, payments, autocomplete, file sync, ticket booking, proximity, LLM chat app, RAG, AI agent platform, coding agent, deep research agent, support agent, realtime voice agent, enterprise AI gateway |

Every card is colour-coded by category (legend item included) and every multi-part item is grouped, so it moves as one piece and you double-click to rename.

## Install

**Option A - one click** (submitted, in review: [excalidraw-libraries#2967](https://github.com/excalidraw/excalidraw-libraries/pull/2967)): once approved, open the kit on [libraries.excalidraw.com](https://libraries.excalidraw.com) and press **Add to Excalidraw**.

**Option B - import the file** (works now, everywhere):
1. Download `system-design-ai-kit.excalidrawlib` from the [latest release](../../releases/latest) (or from [`library/`](library/system-design-ai-kit.excalidrawlib)).
2. In Excalidraw open the **Library** (book icon, top right) > **...** > **Open**, and pick the file. Or drag the file onto the canvas.

**Obsidian:** with the [Excalidraw plugin](https://github.com/zsviczian/obsidian-excalidraw-plugin), put the file in your library folder (default `Excalidraw/Libraries/`).

The library lives in your browser, not in a board, so it also works on **other people's shared whiteboards**: join their live-collaboration link and insert items from your own library.

## Use it fast

| Want | Do |
|---|---|
| Insert anything without dragging | **Cmd/Ctrl + /** (or **Cmd/Ctrl + Shift + P**), type part of a name, **Enter** |
| See the whole kit | Library search: `sd:` |
| See one section | Library search: `sd:data/`, `sd:agent/`, `sd:tpl/`... |
| Find by idea | Library search: `queue`, `geo`, `jwt`, `rag`, `ai client`... (every name carries search tags) |
| Start a design | Insert `sd:client/ First Request - classic` or `- AI`, then build to the right |
| Rename a box | Double-click to enter the group, double-click the text |
| Keep arrows attached | Drag an arrow end onto a box until it highlights |

More in [How to use](docs/how-to-use.md) and the [45-minute interview playbook](docs/interview-playbook.md).

## Naming rule

Every item is named `sd:<section>/ <Item> - <search tags>`. The `sd:` namespace keeps this kit separate from any other library you install, so "Server" from this kit never gets mixed up with someone else's "Server". See [Naming](docs/naming.md).

## Updates

The kit is maintained and versioned. Each release is listed in the [Changelog](CHANGELOG.md) and published as a GitHub release with the library file attached. Watch this repo (Releases only) to be told about new versions. Re-importing a new version adds the changed items; item ids are stable (`sdk-...`).

## Request an item or report a problem

Open an issue: [request an item](../../issues/new?template=item-request.md) or [report a problem](../../issues/new?template=bug.md).

## Build it yourself

The whole library is generated from code (Excalidraw's own `convertToExcalidrawElements`, rendered and checked headless). See [generator/README.md](generator/README.md).

## Licence

MIT - free for personal and commercial use. Made by [Dinesh Sunny](https://github.com/Dinesh-Sunny).
