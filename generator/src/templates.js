// Full interview answers (tpl/) and reusable patterns (pattern/).
// node: [id, title, icon, theme, col, row, width?]   edge: [from, to, label, {dash, dot, both, via:[[c,r]]}]
const D = { dash: true }, B = { both: true };

export const TEMPLATES = [
  { name: "URL Shortener - tinyurl bitly", spec: {
    title: "URL Shortener", sub: "100M new URLs/day · read:write 100:1 · p99 redirect < 50 ms",
    nodes: [["u", "Users", "users", "client", 0, 1], ["lb", "Load Balancer", "lb", "edge", 1.1, 1], ["api", "Shortener API", "service", "svc", 2.2, 1],
      ["id", "ID Generator\n(Snowflake)", "hash", "svc", 2.2, 2.3], ["c", "Redis\n(hot codes)", "cache", "cache", 3.5, 0], ["db", "Key-Value DB\n(code -> URL)", "db", "data", 3.5, 1.3],
      ["k", "Kafka\n(click events)", "stream", "msg", 3.5, 2.6], ["w", "Analytics\nWarehouse", "warehouse", "data", 4.8, 2.6]],
    edges: [["u", "lb", "GET /{code}"], ["lb", "api"], ["api", "c", "1. lookup"], ["api", "db", "2. on miss"], ["api", "id", "new id"], ["api", "k", "click", D], ["k", "w", "", D]],
    notes: "Key decisions\n- Base62 of a 64-bit id: 7 chars = 3.5T codes\n- 301 = cacheable, 302 = can track clicks\n- Read heavy: cache hot codes (80/20)\n- KV store partitioned by code\n- Custom alias: check-and-set on insert" } },

  { name: "Rate Limiter - throttling api limits", spec: {
    title: "Rate Limiter", sub: "Distributed limiter at the gateway · per user / IP / API key",
    nodes: [["u", "Clients", "users", "client", 0, 1], ["gw", "API Gateway\n+ Rate Limiter", "gauge", "edge", 1.3, 1], ["s", "Services", "service", "svc", 2.8, 1],
      ["r", "Redis\n(counters, Lua)", "cache", "cache", 1.3, 2.4], ["cfg", "Rules Config", "key", "svc", 1.3, -0.4], ["x", "Rejected\n429 + Retry-After", "breaker", "ops", 2.8, 2.4, 180]],
    edges: [["u", "gw", "request"], ["gw", "s", "allowed"], ["gw", "r", "INCR + check"], ["cfg", "gw", "limits", D], ["gw", "x", "over limit"]],
    notes: "Algorithms\n- Token bucket: allows bursts (most common)\n- Leaky bucket: smooth constant rate\n- Fixed window: simple, edge bursts\n- Sliding window log: exact, memory heavy\n- Sliding window counter: good balance\nDistributed: atomic Lua script in Redis,\nheaders X-RateLimit-Remaining" } },

  { name: "Chat System - whatsapp messenger realtime", spec: {
    title: "Chat System", sub: "1:1 + group chat · online presence · delivery receipts",
    nodes: [["a", "User A", "mobile", "client", 0, 0.3], ["b", "User B", "mobile", "client", 0, 2.6], ["w1", "Chat Server\n(WebSocket)", "ws", "svc", 1.4, 0.3], ["w2", "Chat Server\n(WebSocket)", "ws", "svc", 1.4, 2.6],
      ["k", "Message Queue\n(Kafka)", "stream", "msg", 2.8, 1.45], ["p", "Presence\n(Redis)", "cache", "cache", 2.8, 0], ["db", "Message Store\n(Cassandra)", "db", "data", 4.2, 0.6], ["push", "Push Service\n(offline)", "bell", "svc", 4.2, 2.3], ["s3", "Media\n(S3 + CDN)", "bucket", "data", 2.8, 2.9]],
    edges: [["a", "w1", "WebSocket", B], ["b", "w2", "WebSocket", B], ["w1", "k", "send"], ["k", "w2", "deliver"], ["k", "db", "persist"], ["k", "push", "if offline", D], ["w1", "p", "heartbeat"], ["w2", "s3", "media", D]],
    notes: "Key decisions\n- WebSocket for 2-way realtime\n- Per-chat message ids for ordering\n- Cassandra: partition chat_id, sort msg_id\n- Sent / delivered / read = acks\n- Offline: push + sync on reconnect\n- Groups: fan-out through the queue" } },

  { name: "News Feed - twitter timeline social", spec: {
    title: "News Feed", sub: "300M DAU · feed load < 200 ms · hybrid fan-out",
    nodes: [["u", "Users", "users", "client", 0, 1.5], ["gw", "API Gateway", "gateway", "edge", 1.2, 1.5], ["post", "Post Service", "service", "svc", 2.5, 0.5], ["feed", "Feed Service", "service", "svc", 2.5, 2.5],
      ["pdb", "Posts DB", "db", "data", 3.8, -0.4], ["k", "Kafka\n(new posts)", "stream", "msg", 3.8, 1], ["fo", "Fan-out\nWorkers", "gear", "svc", 5.1, 1], ["g", "Social Graph\n(followers)", "graph", "data", 5.1, -0.4],
      ["fc", "Feed Cache\n(Redis lists)", "cache", "cache", 3.8, 2.5], ["cdn", "CDN (media)", "globe", "edge", 1.2, 2.9]],
    edges: [["u", "gw"], ["gw", "post", "POST /posts"], ["gw", "feed", "GET /feed"], ["post", "pdb", "write"], ["post", "k", "event"], ["k", "fo"], ["fo", "g", "followers"], ["fo", "fc", "push ids"], ["feed", "fc", "read"], ["u", "cdn", "images", D]],
    notes: "Key decisions\n- Fan-out on write for most users\n- Pull at read time for celebrities\n- Cache stores post ids, hydrate later\n- Cursor pagination\n- Optional ranking service" } },

  { name: "Video Streaming - youtube netflix vod", spec: {
    title: "Video Streaming", sub: "Upload, transcode, stream · adaptive bitrate · CDN heavy",
    nodes: [["cr", "Creator", "user", "client", 0, 0], ["up", "Upload Service", "video", "svc", 1.3, 0], ["raw", "Raw Video\n(S3)", "bucket", "data", 2.6, 0], ["q", "Transcode\nQueue", "queue", "msg", 3.9, 0],
      ["tr", "Transcoders\n(workers)", "gear", "svc", 5.2, 0], ["seg", "Segments\n(S3, HLS/DASH)", "bucket", "data", 5.2, 1.5], ["cdn", "CDN", "globe", "edge", 3.9, 3],
      ["v", "Viewer", "user", "client", 0, 3], ["api", "Video API", "service", "svc", 1.3, 4.3], ["meta", "Metadata DB", "db", "data", 2.6, 4.3]],
    edges: [["cr", "up", "upload"], ["up", "raw", "pre-signed URL"], ["raw", "q", "job"], ["q", "tr"], ["tr", "seg", "multi-bitrate"], ["seg", "cdn", "origin"], ["v", "cdn", "stream segments"], ["v", "api", "GET /watch"], ["api", "meta"]],
    notes: "Key decisions\n- Upload direct to S3 (pre-signed, resumable)\n- Transcode DAG: split, encode, merge\n- HLS/DASH, many bitrates\n- CDN serves almost all bytes\n- Push popular videos to edges" } },

  { name: "Ride Sharing - uber lyft dispatch geo", spec: {
    title: "Ride Sharing", sub: "Realtime driver locations · matching · ETA",
    nodes: [["r", "Rider App", "mobile", "client", 0, 0.3], ["d", "Driver App", "mobile", "client", 0, 2.7], ["gw", "Gateway +\nWebSocket", "ws", "edge", 1.3, 1.5], ["t", "Trip Service", "service", "svc", 2.6, 0.3],
      ["l", "Location Service", "pin", "svc", 2.6, 2.7], ["m", "Matching\n(dispatch)", "gear", "svc", 3.9, 1.5], ["geo", "Geo Index\n(Redis GEO / H3)", "cache", "cache", 3.9, 2.9], ["tdb", "Trips DB", "db", "data", 2.6, -1],
      ["maps", "Maps / ETA", "pin", "ext", 5.2, 1.5], ["pay", "Payment Service", "card", "svc", 3.9, 0.1]],
    edges: [["r", "gw", "request ride"], ["d", "gw", "location / 4s"], ["gw", "t"], ["gw", "l"], ["l", "geo", "update"], ["t", "m", "find driver"], ["m", "geo", "nearby"], ["m", "maps", "ETA"], ["t", "tdb"], ["t", "pay", "on finish", D]],
    notes: "Key decisions\n- 1M drivers / 4s = 250k writes/s:\n  keep locations in memory, not a DB\n- Geohash / H3 cells for nearby search\n- Lock the driver while offering a trip\n- Push updates over WebSocket" } },

  { name: "Notification System - push email sms", spec: {
    title: "Notification System", sub: "Push, SMS, email · 10M+/day · retries and preferences",
    nodes: [["s", "Services\n(triggers)", "service", "svc", 0, 1.5], ["n", "Notification\nService", "bell", "svc", 1.3, 1.5], ["pref", "Prefs + Device\nTokens", "db", "data", 1.3, 0], ["tpl", "Templates", "doc", "data", 1.3, 3],
      ["q1", "iOS Queue", "queue", "msg", 2.6, 0], ["q2", "Android Queue", "queue", "msg", 2.6, 1], ["q3", "SMS Queue", "queue", "msg", 2.6, 2], ["q4", "Email Queue", "queue", "msg", 2.6, 3],
      ["w", "Workers\n(retry + DLQ)", "gear", "svc", 3.9, 1.5],
      ["p1", "APNs", "bell", "ext", 5.2, 0], ["p2", "FCM", "bell", "ext", 5.2, 1], ["p3", "SMS Provider", "mail", "ext", 5.2, 2], ["p4", "Email Provider", "mail", "ext", 5.2, 3]],
    edges: [["s", "n", "send"], ["n", "pref"], ["n", "tpl"], ["n", "q1"], ["n", "q2"], ["n", "q3"], ["n", "q4"], ["q1", "w"], ["q2", "w"], ["q3", "w"], ["q4", "w"], ["w", "p1"], ["w", "p2"], ["w", "p3"], ["w", "p4"]],
    notes: "Key decisions\n- One queue per channel (isolation)\n- Retry with backoff, then DLQ\n- Idempotency key: no duplicates\n- Respect opt-out + quiet hours\n- Track sent / delivered / opened" } },

  { name: "Web Crawler - search engine spider", spec: {
    title: "Web Crawler", sub: "1B pages/month (~400 pages/s) · polite · deduplicated",
    nodes: [["seed", "Seed URLs", "doc", "data", 0, 1], ["f", "URL Frontier\n(priority queues)", "queue", "msg", 1.3, 1], ["fe", "Fetchers", "gear", "svc", 2.6, 1], ["dns", "DNS Resolver\n(cached)", "dns", "edge", 2.6, -0.3],
      ["web", "Websites", "cloud", "ext", 2.6, 2.3], ["cs", "Content Store\n(S3)", "bucket", "data", 3.9, -0.3], ["pa", "Parser +\nLink Extractor", "service", "svc", 3.9, 1], ["dd", "Dedup\n(Bloom filter)", "hash", "svc", 5.2, 1], ["seen", "URL Seen\nStore", "db", "data", 6.5, 1]],
    edges: [["seed", "f"], ["f", "fe", "next URL"], ["fe", "dns"], ["fe", "web", "GET"], ["fe", "pa", "HTML"], ["pa", "cs", "store"], ["pa", "dd", "links"], ["dd", "seen"], ["dd", "f", "new URLs", { via: [[5.2 + 75 / 240, 3.1], [1.3 + 75 / 240, 3.1]] }]],
    notes: "Key decisions\n- Politeness: one queue per host + delay\n- Cache robots.txt and DNS\n- Dedup URLs (Bloom), content (simhash)\n- Priority by rank and freshness\n- Watch for crawler traps (max depth)" } },

  { name: "Payment System - stripe checkout ledger", spec: {
    title: "Payment System", sub: "Exactly-once effect · double-entry ledger · reconciliation",
    nodes: [["u", "Customer", "user", "client", 0, 1], ["co", "Checkout\nService", "service", "svc", 1.3, 1], ["ps", "Payment Service\n(idempotent)", "card", "svc", 2.6, 1], ["psp", "Payment Gateway\n(Stripe)", "card", "ext", 3.9, 1],
      ["pdb", "Payments DB\n(state machine)", "db", "data", 2.6, -0.4], ["risk", "Fraud / Risk", "shield", "svc", 1.3, -0.4], ["wh", "Webhook\nHandler", "service", "svc", 3.9, 2.4], ["led", "Ledger DB\n(double-entry)", "db", "data", 2.6, 2.4], ["rec", "Reconciliation\n(daily)", "clock", "svc", 5.2, 2.4]],
    edges: [["u", "co", "pay"], ["co", "ps", "Idempotency-Key"], ["ps", "risk", "score"], ["ps", "pdb", "PENDING"], ["ps", "psp", "charge"], ["psp", "wh", "webhook", D], ["wh", "led", "post entries"], ["psp", "rec", "settlement", D], ["rec", "led", "compare", { via: [[5.2 + 75 / 240, 3.6], [2.6 + 75 / 240, 3.6]] }]],
    notes: "Key decisions\n- Idempotency key + dedupe table\n- CREATED > PENDING > SUCCEEDED/FAILED\n- Ledger is append-only, debits = credits\n- Retry only idempotent calls\n- Reconcile with PSP settlement daily" } },

  { name: "Search Autocomplete - typeahead suggestions trie", spec: {
    title: "Search Autocomplete", sub: "Top 5 suggestions · < 100 ms · 10B queries/day",
    nodes: [["u", "User", "browser", "client", 0, 1], ["ac", "Autocomplete\nService", "search", "svc", 1.3, 1], ["tc", "Trie Cache\n(top-k per prefix)", "cache", "cache", 2.6, 0.2], ["ts", "Trie Store\n(snapshots)", "db", "data", 3.9, 0.2],
      ["log", "Query Logs\n(Kafka)", "stream", "msg", 1.3, 2.4], ["ag", "Aggregators\n(Spark, hourly)", "funnel", "msg", 2.6, 2.4], ["tb", "Trie Builder", "gear", "svc", 3.9, 2.4]],
    edges: [["u", "ac", "GET ?q=sys"], ["ac", "tc", "lookup"], ["ts", "tc", "load"], ["ac", "log", "log query", D], ["log", "ag"], ["ag", "tb", "counts"], ["tb", "ts", "build"]],
    notes: "Key decisions\n- In-memory trie, top-k cached per node\n- Debounce + browser cache on client\n- Rebuild offline, swap atomically\n- Shard by prefix range\n- Filter unsafe terms" } },

  { name: "File Storage Sync - dropbox google drive", spec: {
    title: "File Storage & Sync", sub: "Chunked upload · delta sync · many devices",
    nodes: [["c", "Desktop Client\n(watcher+chunker)", "desktop", "client", 0, 1, 170], ["bs", "Block Service", "layers", "svc", 1.5, 0.2], ["s3", "Block Storage\n(S3)", "bucket", "data", 3, 0.2],
      ["ms", "Metadata Service", "service", "svc", 1.5, 1.8], ["mdb", "Metadata DB\n(files, versions)", "db", "data", 3, 1.8], ["nt", "Notification\n(long poll / WS)", "bell", "svc", 3, 3.2], ["o", "Other Devices", "mobile", "client", 4.5, 3.2]],
    edges: [["c", "bs", "upload changed chunks"], ["bs", "s3"], ["c", "ms", "commit file"], ["ms", "mdb"], ["ms", "nt", "changed"], ["nt", "o", "sync"]],
    notes: "Key decisions\n- 4 MB chunks, SHA-256 hash, dedupe\n- Upload only changed chunks\n- Metadata in SQL (strong consistency)\n- Conflict: keep both (conflicted copy)\n- Devices pull changed chunks" } },

  { name: "Ticket Booking - ticketmaster seats concerts", spec: {
    title: "Ticket Booking", sub: "No double booking · flash-sale spikes",
    nodes: [["u", "Users", "users", "client", 0, 1], ["wr", "Virtual\nWaiting Room", "queue", "msg", 1.3, -0.4], ["gw", "API Gateway", "gateway", "edge", 1.3, 1], ["ev", "Event Service", "service", "svc", 2.6, 0.2], ["bk", "Booking Service", "service", "svc", 2.6, 1.8],
      ["edb", "Events DB\n+ Search", "search", "data", 3.9, 0.2], ["lk", "Seat Locks\n(Redis TTL)", "lock", "cache", 3.9, 1.2], ["bdb", "Bookings DB\n(SQL, ACID)", "db", "data", 3.9, 2.4], ["pay", "Payment\nGateway", "card", "ext", 5.2, 1.8]],
    edges: [["u", "wr", "hot event", D], ["wr", "gw", "admit"], ["u", "gw"], ["gw", "ev"], ["gw", "bk"], ["ev", "edb"], ["bk", "lk", "hold seat"], ["bk", "bdb", "confirm"], ["bk", "pay", "charge"]],
    notes: "Key decisions\n- Hold seat: SET NX EX 600 in Redis\n- DB unique (event, seat) as last guard\n- Release hold on timeout / failure\n- Waiting room absorbs spikes\n- Cache + CDN for event pages" } },

  { name: "Proximity Service - yelp nearby places", spec: {
    title: "Proximity Service", sub: "Find places within radius · read heavy",
    nodes: [["u", "Users", "mobile", "client", 0, 1], ["lb", "Load Balancer", "lb", "edge", 1.3, 1], ["ls", "Location Search\nService", "pin", "svc", 2.6, 0.2], ["bs", "Business\nService", "service", "svc", 2.6, 1.8],
      ["geo", "Geo Index\n(geohash)", "cache", "cache", 3.9, 0.2], ["c", "Business Cache", "cache", "cache", 3.9, 1.1], ["db", "Business DB\n(+ replicas)", "db", "data", 3.9, 2.2]],
    edges: [["u", "lb"], ["lb", "ls", "GET /nearby"], ["lb", "bs", "CRUD"], ["ls", "geo", "cells"], ["ls", "c", "details"], ["bs", "db", "write"]],
    notes: "Key decisions\n- Geohash length 6 = ~1.2 x 0.6 km\n- Search the cell + 8 neighbours\n- Quadtree if density varies a lot\n- Index updated nightly is fine\n- Read replicas for scale" } },

  { name: "LLM Chat App - chatgpt assistant genai", spec: {
    title: "LLM Chat App", sub: "Streaming answers · model routing · cost control",
    nodes: [["u", "User", "browser", "client", 0, 1], ["gw", "API Gateway\n(auth, limits)", "gateway", "edge", 1.3, 1], ["cs", "Chat Service\n(SSE stream)", "chat", "svc", 2.6, 1], ["cv", "Conversation\nStore", "db", "data", 2.6, 2.4],
      ["g", "Guardrails", "shield", "ai", 2.6, -0.4], ["r", "Model Router", "service", "ai", 3.9, 1], ["sc", "Semantic Cache", "cache", "cache", 3.9, -0.4], ["llm", "LLM API\n(hosted)", "sparkle", "ai", 5.2, 0.3], ["sh", "Self-hosted\nModel (vLLM)", "neural", "ai", 5.2, 1.7], ["ob", "Evals &\nTracing", "chart", "ops", 3.9, 2.4]],
    edges: [["u", "gw", "POST /chat"], ["gw", "cs"], ["cs", "g", "check in/out"], ["cs", "cv", "history"], ["cs", "r", "prompt"], ["r", "sc", "lookup"], ["r", "llm"], ["r", "sh"], ["r", "ob", "tokens, cost", D]],
    notes: "Key decisions\n- Stream tokens back with SSE\n- Trim or summarise long history\n- Route by cost and latency, fallback\n- Rate limit by tokens per user\n- Track latency, cost, eval scores" } },

  { name: "RAG Pipeline - retrieval augmented generation", spec: {
    title: "RAG Pipeline", sub: "Ingest once, retrieve per question · cite sources",
    nodes: [["doc", "Documents\n(PDF, web, DB)", "doc", "data", 0, 0], ["ch", "Loader +\nChunker", "funnel", "msg", 1.3, 0], ["em", "Embedding\nModel", "neural", "ai", 2.6, 0], ["vdb", "Vector DB\n(+ BM25)", "vector", "data", 3.9, 0.9],
      ["u", "User", "user", "client", 0, 2.1], ["rag", "RAG Service", "service", "svc", 1.3, 2.1], ["ret", "Retriever\n(hybrid)", "search", "ai", 2.6, 2.1], ["rr", "Reranker", "ranking", "ai", 3.9, 2.4], ["llm", "LLM", "sparkle", "ai", 5.2, 2.4]],
    edges: [["doc", "ch"], ["ch", "em", "chunks"], ["em", "vdb", "vectors"], ["u", "rag", "question"], ["rag", "ret"], ["ret", "vdb", "top 50"], ["ret", "rr"], ["rr", "llm", "top 5"], ["llm", "rag", "answer + citations", { via: [[5.2 + 75 / 240, 3.55], [1.3 + 75 / 240, 3.55]] }]],
    notes: "Key decisions\n- Chunks 300-800 tokens with overlap\n- Keep metadata: source, ACL, date\n- Hybrid search, then rerank\n- Say \"not found\" when context is missing\n- Eval: recall@k, faithfulness\n- Re-index on change (CDC)" } },

  { name: "AI Agent Platform - agentic tools mcp", spec: {
    title: "AI Agent Platform", sub: "Plan, act with tools, observe, repeat",
    nodes: [["u", "User", "user", "client", 0, 1], ["ag", "Agent\nOrchestrator", "robot", "ai", 1.4, 1], ["llm", "LLM\n(planner)", "sparkle", "ai", 2.9, -0.2], ["t", "Tools / MCP\nServers", "wrench", "ai", 2.9, 1], ["mem", "Memory\n(vector + KV)", "vector", "data", 2.9, 2.2],
      ["h", "Human approval", "user", "client", 1.4, -0.4], ["sb", "Code Sandbox", "cube", "svc", 4.4, 0.4], ["x", "External APIs", "cloud", "ext", 4.4, 1.6], ["ob", "Tracing &\nEvals", "chart", "ops", 1.4, 2.4]],
    edges: [["u", "ag", "task"], ["ag", "llm", "next step"], ["ag", "t", "tool call"], ["ag", "mem", "recall / save"], ["ag", "h", "risky action", D], ["t", "sb"], ["t", "x"], ["ag", "ob", "every step", D]],
    notes: "Key decisions\n- Loop: plan > act > observe, step limit\n- Tools described by JSON schema (MCP)\n- Permissions + approval for risky tools\n- Idempotent tools, resumable state\n- Trace every step, eval task success" } },
];

export const PATTERNS = [
  { name: "3-Tier Web App - client lb app db", spec: { nodes: [["c", "Clients", "users", "client", 0.6, 0], ["lb", "Load Balancer", "lb", "edge", 0.6, 1], ["a1", "App Server", "server", "svc", 0, 2], ["a2", "App Server", "server", "svc", 1.2, 2], ["db", "Database", "db", "data", 0.6, 3]],
    edges: [["c", "lb"], ["lb", "a1"], ["lb", "a2"], ["a1", "db"], ["a2", "db"]], rowh: 160 } },
  { name: "Cache-Aside - lazy loading read path", spec: { nodes: [["a", "Service", "service", "svc", 0, 0.5], ["c", "Cache", "cache", "cache", 1.3, 0], ["db", "Database", "db", "data", 1.3, 1.1]],
    edges: [["a", "c", "1. get / 3. set"], ["a", "db", "2. on miss"]], rowh: 140 } },
  { name: "Write-Through Cache - write path", spec: { nodes: [["a", "Service", "service", "svc", 0, 0], ["c", "Cache", "cache", "cache", 1.3, 0], ["db", "Database", "db", "data", 1.3, 1]],
    edges: [["a", "c", "1. write"], ["c", "db", "2. sync write"]] } },
  { name: "Read Replicas - leader follower replication", spec: { nodes: [["a", "Service", "service", "svc", 0, 1], ["p", "Primary", "db", "data", 1.4, 0], ["r1", "Replica", "db", "data", 1.4, 1], ["r2", "Replica", "db", "data", 1.4, 2]],
    edges: [["a", "p", "writes"], ["a", "r1", "reads"], ["a", "r2", "reads"], ["p", "r1", "", { dot: true }], ["p", "r2", "async replication", { dot: true, via: [[2.35, 0.3], [2.35, 2.3]] }]], rowh: 140 } },
  { name: "Sharding - hash partition shard router", spec: { nodes: [["a", "Service", "service", "svc", 0, 1], ["rt", "Shard Router\nhash(key) % N", "hash", "svc", 1.2, 1, 160], ["s1", "Shard 1", "db", "data", 2.5, 0], ["s2", "Shard 2", "db", "data", 2.5, 1], ["s3", "Shard 3", "db", "data", 2.5, 2]],
    edges: [["a", "rt"], ["rt", "s1"], ["rt", "s2"], ["rt", "s3"]], rowh: 130 } },
  { name: "CQRS + Event Sourcing - read write split", spec: { nodes: [["c", "Client", "user", "client", 0, 0.7], ["cmd", "Command API", "service", "svc", 1.2, 0], ["wdb", "Write DB /\nEvent Store", "db", "data", 2.4, 0], ["k", "Event Bus", "stream", "msg", 3.6, 0.7], ["pr", "Projector", "gear", "svc", 3.6, 1.7], ["rdb", "Read DB", "db", "data", 2.4, 1.7], ["q", "Query API", "service", "svc", 1.2, 1.7]],
    edges: [["c", "cmd", "commands"], ["cmd", "wdb"], ["wdb", "k", "events"], ["k", "pr"], ["pr", "rdb", "update views"], ["q", "rdb"], ["c", "q", "queries"]], rowh: 150 } },
  { name: "Saga Orchestration - distributed transaction compensation", spec: { nodes: [["o", "Saga\nOrchestrator", "gear", "svc", 0, 1], ["s1", "Order Service", "service", "svc", 1.5, 0], ["s2", "Payment Service", "card", "svc", 1.5, 1], ["s3", "Inventory Service", "service", "svc", 1.5, 2]],
    edges: [["o", "s1", "1. create"], ["o", "s2", "2. charge"], ["o", "s3", "3. reserve"]], rowh: 140,
    notes: "On failure run compensations\nin reverse: release stock,\nrefund, cancel order" } },
  { name: "Transactional Outbox - reliable events cdc", spec: { nodes: [["s", "Service", "service", "svc", 0, 0], ["db", "DB: table +\noutbox (1 tx)", "db", "data", 1.3, 0], ["rel", "Relay / CDC", "stream", "msg", 1.3, 1], ["k", "Kafka", "stream", "msg", 0, 1]],
    edges: [["s", "db", "one transaction"], ["db", "rel", "poll / tail log"], ["rel", "k", "publish"]] } },
  { name: "Pub/Sub Fan-out - topic subscribers", spec: { nodes: [["p", "Producer", "service", "svc", 0, 1], ["t", "Topic", "pubsub", "msg", 1.2, 1], ["c1", "Consumer A", "gear", "svc", 2.4, 0], ["c2", "Consumer B", "gear", "svc", 2.4, 1], ["c3", "Consumer C", "gear", "svc", 2.4, 2]],
    edges: [["p", "t", "publish"], ["t", "c1"], ["t", "c2"], ["t", "c3"]], rowh: 130 } },
  { name: "API Gateway + BFF - backend for frontend", spec: { nodes: [["w", "Web App", "browser", "client", 0, 0], ["m", "Mobile App", "mobile", "client", 0, 1.2], ["bw", "Web BFF", "gateway", "edge", 1.2, 0], ["bm", "Mobile BFF", "gateway", "edge", 1.2, 1.2], ["s1", "Users Service", "service", "svc", 2.4, 0], ["s2", "Orders Service", "service", "svc", 2.4, 1.2]],
    edges: [["w", "bw"], ["m", "bm"], ["bw", "s1"], ["bw", "s2"], ["bm", "s1"], ["bm", "s2"]], rowh: 140 } },
  { name: "Multi-Region Active-Active - geo dns failover", spec: { nodes: [["d", "Geo DNS", "dns", "edge", 1.1, 0], ["la", "LB (EU)", "lb", "edge", 0, 1], ["lb", "LB (US)", "lb", "edge", 2.2, 1], ["aa", "App (EU)", "service", "svc", 0, 2], ["ab", "App (US)", "service", "svc", 2.2, 2], ["da", "DB (EU)", "db", "data", 0, 3], ["db", "DB (US)", "db", "data", 2.2, 3]],
    edges: [["d", "la", "nearest"], ["d", "lb", "nearest"], ["la", "aa"], ["lb", "ab"], ["aa", "da"], ["ab", "db"], ["da", "db", "cross-region replication", { both: true, dot: true }]], rowh: 140 } },
  { name: "Async Job Queue - background workers", spec: { nodes: [["a", "API", "service", "svc", 0, 0], ["q", "Queue", "queue", "msg", 1.2, 0], ["w1", "Worker", "gear", "svc", 2.4, 0], ["w2", "Worker", "gear", "svc", 2.4, 1], ["dlq", "Dead Letter\nQueue", "queue", "msg", 1.2, 1]],
    edges: [["a", "q", "enqueue"], ["q", "w1"], ["q", "w2"], ["w2", "dlq", "fails x3", D]], rowh: 130 } },
];
