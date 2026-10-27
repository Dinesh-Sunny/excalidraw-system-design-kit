<a id="top"></a>

<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="previews/hero-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="previews/hero.png">
  <img alt="System Design & AI Architecture Kit for Excalidraw - preview of templates, agent patterns, UI screens and AI clients" src="previews/hero.png" width="100%">
</picture>

# System Design & AI Architecture Kit

**Draw any system design or agentic AI architecture on Excalidraw in minutes, by typing instead of dragging.**

[![Latest release](https://img.shields.io/github/v/release/Dinesh-Sunny/excalidraw-system-design-kit?label=release&color=5b57d1)](https://github.com/Dinesh-Sunny/excalidraw-system-design-kit/releases/latest)
[![Items](https://img.shields.io/badge/items-292-2f9e44)](docs/catalog.md)
[![Full designs](https://img.shields.io/badge/full%20designs-21-e67700)](#-whats-inside)
[![Agentic patterns](https://img.shields.io/badge/agentic%20patterns-12-9c36b5)](#-whats-inside)
[![Excalidraw](https://img.shields.io/badge/made%20for-Excalidraw-6965db)](https://excalidraw.com)
[![License: MIT](https://img.shields.io/badge/license-MIT-1971c2)](LICENSE)
[![Sponsor](https://img.shields.io/badge/sponsor-%E2%99%A5-e8590c)](https://dinesh-sunny.github.io/excalidraw-system-design-kit/sponsor/)
[![Stars](https://img.shields.io/github/stars/Dinesh-Sunny/excalidraw-system-design-kit?style=flat&color=ffd43b)](https://github.com/Dinesh-Sunny/excalidraw-system-design-kit/stargazers)
<!-- featured:start --><!-- featured:end -->

[**Browse all items**](https://dinesh-sunny.github.io/excalidraw-system-design-kit/) ·
[**Download**](https://github.com/Dinesh-Sunny/excalidraw-system-design-kit/releases/latest) ·
[Quick start](#-quick-start-60-seconds) ·
[Interview playbook](docs/interview-playbook.md) ·
[Catalog](docs/catalog.md) ·
[Changelog](CHANGELOG.md)

</div>

<br>

<div align="center">
  <img src="previews/demo.gif" alt="Demo: Cmd/Ctrl + Shift + P, type 'first request - ai', Enter inserts the starter; the library search 'sd:agent/' lists agent parts; 'tpl/ rag pipeline' inserts a full RAG design" width="90%">
  <br>
  <sub><b>Real recording.</b> Command Palette inserts a starter, <code>sd:agent/</code> filters the library, <code>tpl/ rag pipeline</code> drops a whole design.</sub>
</div>

<br>

> [!TIP]
> Already have it? Press <kbd>Cmd</kbd>/<kbd>Ctrl</kbd> + <kbd>/</kbd> on any Excalidraw board, type `kafka`, press <kbd>Enter</kbd>. That's the whole idea.

<details>
<summary><b>Table of contents</b></summary>

- [The problem](#-the-problem)
- [The solution](#-the-solution)
- [What's inside](#-whats-inside)
- [Quick start (60 seconds)](#-quick-start-60-seconds)
- [How to use it](#-how-to-use-it)
- [Search cheat sheet](#-search-cheat-sheet)
- [How it's organised](#-how-its-organised)
- [See every section](#-see-every-section)
- [Why this kit](#-why-this-kit)
- [How it's built](#-how-its-built)
- [Roadmap](#-roadmap)
- [FAQ](#-faq)
- [Contributing](#-contributing)
- [License](#-license)

</details>

---

## 😩 The problem

System design interviews and architecture reviews happen on whiteboards, and whiteboards are slow.

| What happens | What it costs |
|---|---|
| You drag a rectangle, resize it, type "Load Balancer", hunt for an arrow, fix the alignment | 5-10 minutes of a 45-minute interview spent **drawing** instead of **designing** |
| Every diagram looks different: random colours, mixed shapes, unlabeled arrows | The interviewer has to decode your picture before they can judge your thinking |
| Public Excalidraw libraries are mostly loose **icons** | You still build the cards, labels, arrows and layout yourself |
| **AI systems** (agents, MCP, RAG, guardrails, evals) are what everyone is asked about now | Until now there was no Excalidraw library for them at all[^gap] |
| You join someone else's shared board | Your own shapes and templates aren't there |

## 💡 The solution

A single Excalidraw library where **every item is a finished, labelled, colour-coded building block with a searchable name**.

- ⌨️ **Insert by typing.** Every item is named, so the Command Palette (<kbd>Cmd</kbd>/<kbd>Ctrl</kbd> + <kbd>/</kbd>) finds it. No dragging, no resizing.
- 🧱 **Finished pieces.** Cards come with icon, label and colour. Patterns and full designs come with bound arrows, labels and a "key decisions" note to talk through.
- 🤖 **Agentic AI built in.** Models, agents, sub-agents, MCP, A2A, memory, human approval, RAG, guardrails, evals, plus the agent workflow patterns.
- 🎨 **One visual language.** 12 category colours with a legend, so every diagram reads the same way.
- 🗂️ **Organised like code.** Names follow `sd:<section>/ Item - tags`. Search `sd:` for the kit, `sd:data/` for one section, or any keyword.
- 🌍 **Works on any board.** The library lives in your browser, so it also works on other people's live-collaboration boards.

<p align="right"><a href="#top">back to top ↑</a></p>

## 📦 What's inside

| Area | Prefix | What you get |
|---|---|---|
| Interview notes | `sd:note/` | Requirements, capacity estimates, API design, data model tables, trade-offs, latency and capacity cheat sheets, step markers 1-9 |
| Clients and devices | `sd:client/` | **First-request starters**, mobile, laptop, tablet, web, TV, watch, voice, car, kiosk, partner API, and **AI clients** (chat app, agent, MCP client, IDE copilot, voice AI, browser agent) |
| Building blocks | `sd:edge/` `sd:svc/` `sd:data/` `sd:cache/` `sd:msg/` `sd:ops/` `sd:ext/` | DNS, CDN, load balancer, gateway, services, workers, SQL/NoSQL/vector stores, Redis, Kafka, queues, monitoring, third-party APIs |
| AI models | `sd:ai/` | LLM, small/local model, multimodal, speech-to-text, text-to-speech, embeddings, reranker, GPU serving, AI gateway |
| Agents | `sd:agent/` | Agent, supervisor, sub-agent, planner, tools, MCP server, A2A, short/long-term memory, checkpoints, human approval, sandbox, workflow engine |
| RAG | `sd:rag/` | Loaders, chunker, embedding pipeline, vector and BM25 indexes, hybrid retriever, knowledge graph, context builder, citations |
| LLMOps | `sd:llmops/` | Guardrails, PII redaction, prompt registry, evals, LLM-as-judge, tracing, token and cost metering, red teaming, fallback |
| Boundaries and arrows | `sd:zone/` `sd:link/` | Region, AZ, VPC, subnets, trust boundary; REST, gRPC, WebSocket, async, replication arrows |
| UI/UX | `sd:ui/` `sd:frame/` `sd:screen/` | 31 UI parts, device frames, 13 ready screens (login, feed, chat, ride booking, checkout, admin dashboard, AI assistant...) |
| Patterns | `sd:pattern/` `sd:agentic/` | Cache-aside, sharding, CQRS, saga, outbox, multi-region; prompt chaining, routing, orchestrator-workers, evaluator-optimizer, multi-agent, agentic RAG, MCP, A2A |
| Full designs | `sd:tpl/` | URL shortener, rate limiter, chat, news feed, video streaming, ride sharing, notifications, web crawler, payments, autocomplete, file sync, ticket booking, proximity, LLM chat app, RAG, AI agent platform, coding agent, deep research agent, support agent, realtime voice agent, enterprise AI gateway |

## 🚀 Quick start (60 seconds)

**1. Get the library** - pick one:

| Option | How |
|---|---|
| One click | Open the kit on [libraries.excalidraw.com](https://libraries.excalidraw.com) and press **Add to Excalidraw** (listing in review: [excalidraw-libraries#2967](https://github.com/excalidraw/excalidraw-libraries/pull/2967)) |
| File | Download `system-design-ai-kit.excalidrawlib` from the [latest release](https://github.com/Dinesh-Sunny/excalidraw-system-design-kit/releases/latest) |

**2. Import it** (file option): in Excalidraw open **Library** (book icon, top right) > **⋯** > **Open**, or simply drag the file onto the canvas.

**3. Insert something:** click the canvas, press <kbd>Cmd</kbd>/<kbd>Ctrl</kbd> + <kbd>/</kbd>, type `first request`, press <kbd>Enter</kbd>.

> [!NOTE]
> Excalidraw stores libraries in your browser. Import once per browser and it stays there, across every board you open.

<p align="right"><a href="#top">back to top ↑</a></p>

## 🧭 How to use it

<details open>
<summary><b>In a system design interview</b></summary>

1. Drop `sd:note/ Requirements` and `sd:note/ Capacity Estimates`. Fill them while you ask questions.
2. Drop a starter: `sd:client/ First Request - classic` or `- AI`.
3. Build to the right with `sd:edge/`, `sd:svc/`, `sd:data/`, `sd:cache/`, `sd:msg/` blocks, or adapt a full design from `sd:tpl/`.
4. Number the request path with `sd:note/ Step 1..9`.
5. Close with `sd:note/ Bottleneck` and `sd:note/ Trade-offs`.

Minute-by-minute plan: [45-minute interview playbook](docs/interview-playbook.md).

```mermaid
flowchart LR
  A["Requirements<br/>0-5 min"] --> B["Estimates<br/>5-10"] --> C["API<br/>10-15"] --> D["Data model<br/>15-20"] --> E["High-level design<br/>20-30"] --> F["Deep dives<br/>30-40"] --> G["Wrap-up<br/>40-45"]
  style E fill:#d0bfff,stroke:#6741d9,color:#1e1e1e
```

</details>

<details>
<summary><b>For an AI / agent design question</b></summary>

1. Start with `sd:client/ First Request - AI`.
2. Pick the shape from `sd:agentic/`. A fixed workflow (prompt chaining, routing, parallelization) is simpler and cheaper than an autonomous agent, so say why you need one.
3. Add knowledge with `sd:rag/` (hybrid retrieval, reranker, citations).
4. Add safety and quality with `sd:llmops/` (guardrails, PII redaction, evals, tracing, token budgets, fallback).
5. Finish on cost and latency: streaming, semantic cache, routing to cheaper models.

</details>

<details>
<summary><b>On someone else's shared board</b></summary>

Join their Excalidraw live-collaboration link and insert from your own library as usual. Everyone sees the items. Import the kit the day before, on the laptop and browser you'll use.

</details>

<details>
<summary><b>In Obsidian</b></summary>

With the [Excalidraw plugin](https://github.com/zsviczian/obsidian-excalidraw-plugin), put the `.excalidrawlib` file in your library folder (default `Excalidraw/Libraries/`). The plugin loads it automatically.

</details>

<details>
<summary><b>Editing what you inserted</b></summary>

| Want | Do |
|---|---|
| Rename a box | Double-click to enter the group, double-click the text |
| Pull one card out of a design | Double-click to enter the group and drag, or <kbd>Cmd</kbd>/<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>G</kbd> to ungroup |
| Keep an arrow attached | Drag its end onto a box until the box highlights |
| Fit everything on screen | <kbd>Shift</kbd> + <kbd>1</kbd> |

</details>

## 🔎 Search cheat sheet

| Type in the Command Palette or Library search | You get |
|---|---|
| `sd:` | the whole kit, in order |
| `sd:data/` · `sd:agent/` · `sd:tpl/` | one section |
| `client` / `ai client` | every client / only AI clients |
| `queue`, `geo`, `jwt`, `vector`, `rag` | items tagged with that idea |
| `tpl/ chat`, `tpl/ payment`, `tpl/ coding agent` | a full design |
| `first request` | the two starters |

<p align="right"><a href="#top">back to top ↑</a></p>

## 🗂️ How it's organised

Excalidraw libraries have no folders, and search matches any part of a name. So the **name does the organising**:

```text
sd:data/ Vector DB - pgvector pinecone weaviate qdrant embeddings ann
└┬┘ └─┬─┘ └───┬───┘   └──────────────────────┬──────────────────────┘
 │    │       │                              └ search tags (synonyms, products)
 │    │       └ item name (what the card says)
 │    └ section
 └ kit namespace: keeps this kit apart from any other library you install
```

```mermaid
mindmap
  root((sd: kit))
    Foundations
      guide
      note
      client
      zone
      link
    Building blocks
      edge
      svc
      data
      cache
      msg
      ops
      ext
    AI
      ai
      agent
      rag
      llmops
    UI/UX
      ui
      frame
      screen
    Designs
      pattern
      agentic
      tpl
```

Every section starts with a divider tile (`SD NN SECTION - ...`), and every card is colour-coded:

| Colour | Means | Colour | Means |
|---|---|---|---|
| 🟦 blue | clients | 🟪 violet | services |
| 🩵 cyan | edge / network | 🟩 green | data stores |
| 🟥 red | caches | 🟨 yellow | messaging |
| 🩷 pink | AI models | 💜 purple | agents |
| 🍏 lime | RAG / knowledge | 🔷 indigo | LLMOps / safety |
| ⬜ grey | ops / security | 🟧 orange | external systems |

Full rules: [docs/naming.md](docs/naming.md).

## 🖼️ See every section

Or browse and search them all on the [showcase page](https://dinesh-sunny.github.io/excalidraw-system-design-kit/).

<details><summary><b>Full interview designs</b> (<code>sd:tpl/</code>, 21)</summary><img src="previews/tpl.png" alt="Full designs"></details>
<details><summary><b>Agentic patterns</b> (<code>sd:agentic/</code>, 12)</summary><img src="previews/agentic.png" alt="Agentic patterns"></details>
<details><summary><b>Agents</b> (<code>sd:agent/</code>)</summary><img src="previews/agent.png" alt="Agents"></details>
<details><summary><b>AI models</b> (<code>sd:ai/</code>)</summary><img src="previews/ai.png" alt="AI models"></details>
<details><summary><b>RAG</b> (<code>sd:rag/</code>)</summary><img src="previews/rag.png" alt="RAG"></details>
<details><summary><b>LLMOps</b> (<code>sd:llmops/</code>)</summary><img src="previews/llmops.png" alt="LLMOps"></details>
<details><summary><b>Clients, devices and starters</b> (<code>sd:client/</code>)</summary><img src="previews/client.png" alt="Clients"></details>
<details><summary><b>Services</b> (<code>sd:svc/</code>)</summary><img src="previews/svc.png" alt="Services"></details>
<details><summary><b>Data stores</b> (<code>sd:data/</code>)</summary><img src="previews/data.png" alt="Data"></details>
<details><summary><b>Edge, cache, messaging, ops, external</b></summary><img src="previews/edge.png" alt="Edge"><img src="previews/cache.png" alt="Cache"><img src="previews/msg.png" alt="Messaging"><img src="previews/ops.png" alt="Ops"><img src="previews/ext.png" alt="External"></details>
<details><summary><b>Architecture patterns</b> (<code>sd:pattern/</code>)</summary><img src="previews/pattern.png" alt="Patterns"></details>
<details><summary><b>UI parts, frames and screens</b></summary><img src="previews/ui.png" alt="UI"><img src="previews/frame.png" alt="Frames"><img src="previews/screen.png" alt="Screens"></details>
<details><summary><b>Notes, zones and arrows</b></summary><img src="previews/note.png" alt="Notes"><img src="previews/zone.png" alt="Zones"><img src="previews/link.png" alt="Arrows"></details>

<p align="right"><a href="#top">back to top ↑</a></p>

## ⚖️ Why this kit

| | Typical icon library | This kit |
|---|:---:|:---:|
| Ready labelled cards (icon + name + colour) | ❌ | ✅ |
| Insert by typing (named for Command Palette) | some | ✅ every item |
| Section filtering (`sd:data/`) | ❌ | ✅ |
| Full interview designs with key-decision notes | ❌ | ✅ 21 |
| Agentic AI parts and patterns | ❌ | ✅ 64 items |
| UI/UX wireframe screens | rarely | ✅ 13 screens |
| Consistent colour language + legend | ❌ | ✅ |
| Versioned releases + changelog | rarely | ✅ |
| Reproducible from source | ❌ | ✅ |

## 🛠️ How it's built

Nothing is hand-dragged. The whole library is generated from code, so every item shares the same sizes, colours and naming, and a change is one edit plus a rebuild.

```mermaid
flowchart LR
  A["Item data<br/>(cards, layouts, screens)"] --> B["Excalidraw's own<br/>convertToExcalidrawElements"]
  B --> C["Headless Chromium<br/>(real fonts, bound arrows)"]
  C --> D[".excalidrawlib"]
  C --> E["SVG previews +<br/>contact sheets"]
  D --> F{"Checks"}
  F -->|"Excalidraw loader<br/>loads every item"| G["Release"]
  E -->|"visual review"| G
```

Details and how to add items: [generator/README.md](generator/README.md).

## 🗺️ Roadmap

- [x] Core system design blocks, notes and 16 classic designs (v1.0)
- [x] Devices, AI clients and first-request starters (v1.1)
- [x] Agents, RAG, LLMOps and agentic patterns (v1.2)
- [x] `sd:` namespace and public release (v1.3)
- [x] A distinct icon for every block, new site with install guide (v1.4)
- [ ] Listed on libraries.excalidraw.com ([#2967](https://github.com/excalidraw/excalidraw-libraries/pull/2967))
- [ ] Cloud-provider variants (AWS / GCP / Azure names on the same cards)
- [ ] More AI designs: eval pipeline, fine-tuning platform, agent marketplace
- [ ] Dark-theme tuned colour set

Have an idea? [Request an item](../../issues/new?template=item-request.md).

## ❓ FAQ

<details>
<summary><b>Is it free for work and commercial use?</b></summary>

Yes. MIT licence: use it, change it, ship it.

</details>

<details>
<summary><b>Will updating create duplicates?</b></summary>

Item ids are stable (`sdk-...`). For a clean update, remove the old kit items in the Library (select > delete), then import the new file.

</details>

<details>
<summary><b>Does it work on Excalidraw+, Obsidian or other Excalidraw apps?</b></summary>

Anything that opens `.excalidrawlib` files works. Obsidian: drop the file into the Excalidraw plugin's library folder. Miro, FigJam and tldraw can't read Excalidraw libraries; copy from an Excalidraw tab and paste.

</details>

<details>
<summary><b>The Command Palette doesn't show my item.</b></summary>

Click on an empty part of the canvas first so the board has focus, then press <kbd>Cmd</kbd>/<kbd>Ctrl</kbd> + <kbd>/</kbd> (or <kbd>Cmd</kbd>/<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>). Library items only appear in the palette in recent Excalidraw versions.

</details>

<details>
<summary><b>Why are there no AWS / GCP logos?</b></summary>

The cards use generic icons drawn from shapes, so they work for any stack and carry no trademark issues. Put the product name in the label (for example "Order Cache (ElastiCache)").

</details>

## 💖 Sponsors

The kit is free and MIT, and it stays that way. Sponsors pay for new blocks, new designs and updates.

<!-- sponsors:start -->
<div align="center">

<a href="https://dinesh-sunny.github.io/excalidraw-system-design-kit/sponsor/#companies"><img src="https://img.shields.io/badge/your%20logo-here-f8f9fa?style=for-the-badge&labelColor=e9ecef" alt="Your logo here"></a>
<br/>

</div>
<!-- sponsors:end -->

| For you | For your company |
|---|---|
| [Coffee $5](https://ko-fi.com/dineshsunny) · [Backer $5/mo](https://buy.stripe.com/3cI7sK1F0g9yf5EfJrgjC05?client_reference_id=readme_backer) · [Supporter $15/mo](https://buy.stripe.com/aFabJ097saPecXw0OxgjC04?client_reference_id=readme_supporter) | [Featured $600/mo](https://buy.stripe.com/14A28qgzU3mMf5E68RgjC00?client_reference_id=readme_featured) · [Gold $300/mo](https://buy.stripe.com/4gMdR8erM6yYf5E0OxgjC01?client_reference_id=readme_gold) · [Silver $150/mo](https://buy.stripe.com/4gMdR8erM2iI8HggNvgjC02?client_reference_id=readme_silver) · [Bronze $50/mo](https://buy.stripe.com/bJe7sK83o1eE2iS9l3gjC03?client_reference_id=readme_bronze) |
| Pay by card above, or [sponsor on GitHub](https://github.com/sponsors/Dinesh-Sunny) · [Buy me a coffee](https://ko-fi.com/dineshsunny) | [See tiers and perks](https://dinesh-sunny.github.io/excalidraw-system-design-kit/sponsor/#companies) |

> [!TIP]
> Pay by card (no GitHub account needed) or on GitHub, and your logo shows up here and on the [site](https://dinesh-sunny.github.io/excalidraw-system-design-kit/sponsor/) within a day, automatically. Sponsors get [live stats](https://dinesh-sunny.github.io/excalidraw-system-design-kit/sponsor/stats/) and a monthly report.

## 🤝 Contributing

- 🗨️ **Questions and ideas:** ask in [Discussions](../../discussions)
- 💬 **Request an item or design:** [open a request](../../issues/new?template=item-request.md)
- 🐛 **Something looks wrong:** [report a problem](../../issues/new?template=bug.md)
- 🧩 **Add items yourself:** edit `generator/src`, rebuild, open a pull request. See [CONTRIBUTING.md](CONTRIBUTING.md); the naming rule in [docs/naming.md](docs/naming.md) keeps things findable.

If the kit saves you time in an interview, a ⭐ helps other people find it.

<a href="https://star-history.com/#Dinesh-Sunny/excalidraw-system-design-kit&Date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=Dinesh-Sunny/excalidraw-system-design-kit&type=Date&theme=dark">
    <img alt="Star history" src="https://api.star-history.com/svg?repos=Dinesh-Sunny/excalidraw-system-design-kit&type=Date" width="560">
  </picture>
</a>

## 📄 License

[MIT](LICENSE) © 2026 [Dinesh Sunny](https://github.com/Dinesh-Sunny)

<p align="right"><a href="#top">back to top ↑</a></p>

[^gap]: Checked 27 Oct 2026 against the public excalidraw-libraries index: no library name or path mentioned agents or LLMs. The two most-downloaded architecture libraries there have about 202k and 87k downloads.
