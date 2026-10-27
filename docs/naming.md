# Naming rule

Excalidraw libraries have no folders. Search is a "contains" match on the item name, and the Command Palette lists items by name. So the name does all the organising.

## Format

```
sd:<section>/ <Item name> - <search tags>
```

- `sd:` - the kit namespace. It keeps this kit apart from every other library you install. Future kits by the same author use their own code.
- `<section>/` - the section, for example `data/`, `agent/`, `tpl/`. Searching `sd:data/` shows only that section.
- `<Item name>` - Title Case, what is drawn on the card.
- `- <search tags>` - lowercase synonyms and product names, so `kafka`, `stream` or `event log` all find the same card.

## Sections in order

| # | Prefix | Section |
|---|---|---|
| 00 | `sd:guide/` | How to use, colour legend |
| 01 | `sd:note/` | Interview notes and markers |
| 02 | `sd:client/` | Starters, clients, devices, AI clients |
| 03 | `sd:edge/` | Edge and networking |
| 04 | `sd:svc/` | Services and compute |
| 05 | `sd:data/` | Databases and storage |
| 06 | `sd:cache/` | Caches |
| 07 | `sd:msg/` | Messaging and streaming |
| 08 | `sd:ai/` | AI models and inference |
| 09 | `sd:agent/` | Agents and orchestration |
| 10 | `sd:rag/` | Knowledge and retrieval |
| 11 | `sd:llmops/` | Safety, evals and LLMOps |
| 12 | `sd:ops/` | Observability, security, ops |
| 13 | `sd:ext/` | External systems |
| 14 | `sd:zone/` | Boundaries and zones |
| 15 | `sd:link/` | Arrows and connectors |
| 16 | `sd:ui/` | UI components |
| 17 | `sd:frame/` | Device frames |
| 18 | `sd:screen/` | Screen wireframes |
| 19 | `sd:pattern/` | Architecture patterns |
| 20 | `sd:agentic/` | Agentic patterns |
| 21 | `sd:tpl/` | Full interview designs |

Each section starts with a divider tile (`SD NN SECTION - ...`) so the library grid reads in blocks.

## Colours

Clients blue, edge cyan, services violet, data green, cache red, messaging yellow, AI models pink, agents purple, RAG lime, LLMOps indigo, ops grey, external orange.

## Item ids

Ids are `sdk-<slug of the name without sd:>` and stay the same across versions, so tools can find and replace this kit's items.
