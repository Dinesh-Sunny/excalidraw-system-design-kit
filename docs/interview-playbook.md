# 45-minute system design interview playbook

How to run a system design round with this kit. Times are a guide.

| Minutes | Step | Insert | Say out loud |
|---|---|---|---|
| 0-5 | Requirements | `sd:note/ Requirements` | Who uses it, the 3-4 core features, what is out of scope. Then scale, latency, availability, consistency. |
| 5-10 | Estimates | `sd:note/ Capacity Estimates`, `sd:note/ Capacity Cheat Sheet` | Daily users, read/write QPS, peak, storage per day and per 5 years, bandwidth. Round numbers. |
| 10-15 | API | `sd:note/ API Design` | 3-5 endpoints, request and response, auth, pagination, idempotency. |
| 15-20 | Data model | `sd:note/ Data Model` items | Main tables or documents, keys, how you partition. SQL vs NoSQL and why. |
| 20-30 | High-level design | `sd:client/ First Request` starter, then `sd:edge/` `sd:svc/` `sd:data/` `sd:cache/` `sd:msg/` blocks, or a `sd:tpl/` design | Walk one request end to end. Number it with `sd:note/ Step 1..9`. |
| 30-40 | Deep dives | `sd:pattern/` and `sd:agentic/` diagrams, `sd:note/ Deep Dive` | Pick the 1-2 hardest parts (hot keys, fan-out, consistency, agent loop safety) and go deep. |
| 40-45 | Wrap-up | `sd:note/ Bottleneck`, `sd:note/ Trade-offs` | Single points of failure, what breaks at 10x, monitoring, what you would do next. |

## AI and agent rounds

For "design an AI assistant / RAG system / agent" questions:

1. Start with `sd:client/ First Request - AI`.
2. Decide the shape with `sd:agentic/`: a fixed workflow (prompt chaining, routing, parallelization) is simpler and cheaper than an autonomous agent. Say why you chose one.
3. Add knowledge with `sd:rag/` (hybrid retrieval + reranker + citations).
4. Add safety and quality with `sd:llmops/`: guardrails, PII redaction, evals, tracing, token budgets, fallback.
5. Close with cost and latency: streaming, caching (semantic cache), model routing to cheaper models.

## Habits that score well

- Ask before you draw. Write the answers into the Requirements note.
- Keep left-to-right flow: clients on the left, data on the right.
- Label every arrow with what travels on it (`HTTPS`, `event`, `replication`).
- Use colour consistently. The legend item shows the code.
- Name trade-offs explicitly: "I chose X, which costs Y, because Z."
