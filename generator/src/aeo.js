// AI search visibility (AEO / GEO) full designs - the systems behind tools like Searchable, Profound and Peec AI.
// node: [id, title, icon, theme, col, row, width?]   edge: [from, to, label, {dash, dot, both, via:[[c,r]]}]
const D = { dash: true }, B = { both: true };

export const AEO_TEMPLATES = [
  { name: "AI Visibility Tracker - aeo geo ai search brand tracking searchable profound", spec: {
    title: "AI Visibility Tracker (AEO)", sub: "1,000s of brands x 100s of prompts x 5-10 AI engines, daily · ~3.6M answers/day · cost per answer < 1 cent",
    nodes: [["u", "Brands +\nAgencies", "users", "client", 0, 1.5], ["app", "Web App + API\n(+ MCP)", "service", "svc", 1.3, 1.5], ["pg", "Postgres\n(tenants, prompts,\nplans)", "dbpg", "data", 1.3, 0, 170],
      ["sch", "Scheduler\n(spread over day,\nplan quotas)", "clock", "svc", 2.65, 0, 170], ["q", "Job Queue\n(one per engine)", "queue", "msg", 4, 0], ["w", "Engine Workers\n(rate limit, retry,\nbreaker)", "gear", "svc", 4, 1.5, 170],
      ["eng", "AI Engines\n(ChatGPT, Perplexity,\nAI Overviews, Gemini)", "sparkle", "ext", 5.45, 1.5, 190], ["raw", "Raw Answers\n(S3, keep forever)", "bucket", "data", 4, 3, 170],
      ["p", "Answer Parser\n(rules + small LLM,\nschema checked)", "parse", "ai", 2.65, 3, 180], ["ch", "ClickHouse\n(answer facts)", "olap", "data", 1.3, 3], ["al", "Alerts +\nWeekly Report", "bell", "svc", 0, 3],
      ["ev", "Golden Set\n+ Parser Evals", "clipboard", "llmops", 2.65, 4.4, 170]],
    edges: [["u", "app"], ["app", "pg", "prompts"], ["sch", "pg", "due today", D], ["sch", "q", "jobs"], ["q", "w"], ["w", "eng", "ask x N runs"], ["w", "raw", "answer + citations"], ["raw", "p", "parse"],
      ["p", "ch", "mentions, cites"], ["app", "ch", "dashboards"], ["ch", "al", "real drops", D], ["ev", "p", "precision / recall", D]],
    notes: "Key decisions\n- Job key = project+prompt+engine+day+run:\n  retries never double count\n- Keep raw answers: re-parse when\n  the parser improves\n- One queue + rate limit per engine;\n  breaker when a provider is down\n- Same prompt+engine+region+day\n  across tenants = run once, share\n- Postgres for config, ClickHouse\n  for millions of facts" } },

  { name: "Noise-aware Visibility Score - repeated runs confidence interval share of voice", spec: {
    title: "Noise-aware Visibility Score", sub: "Same prompt, different answer every run · report rates with error bars, alert only on real change",
    nodes: [["pr", "Tracked Prompt\n(+ 3 phrasings)", "prompt", "llmops", 0, 1, 170], ["r", "N Repeated Runs\n(per engine, region)", "tasks", "svc", 1.4, 1, 170], ["eng", "AI Engine\n(non-deterministic)", "sparkle", "ext", 1.4, -0.4, 170],
      ["f", "Answer Facts\n(mentioned? cited?\nposition)", "table", "data", 2.85, 1, 170], ["st", "Stats Job\n(rate + Wilson\ninterval)", "chart", "svc", 4.3, 1, 170], ["sov", "Score + Share\nof Voice", "bars", "ops", 5.7, 0.2], ["an", "Change Detector\n(outside interval?)", "siren", "ops", 5.7, 1.8, 170],
      ["mv", "Engine Changes\n(model version,\nsearch on/off)", "flag", "ops", 2.85, 2.5, 170], ["ad", "Adaptive Sampler\n(more runs where\nvariance is high)", "sliders", "svc", 4.3, 2.5, 170]],
    edges: [["pr", "r"], ["r", "eng", "ask"], ["r", "f", "parse"], ["f", "st"], ["st", "sov", "7/10 (45-90%)"], ["st", "an"], ["mv", "st", "annotate", D], ["st", "ad", "variance", D], ["ad", "r", "", { dash: true, via: [[4.3 + 80 / 240, 3.6], [1.4 + 80 / 240, 3.6]] }]],
    notes: "Key decisions\n- One run means little: visibility\n  = share of runs that mention you\n- Report a range, not a point\n  (Wilson interval works at small N)\n- Alert only when the new rate is\n  outside last week's interval\n- Annotate engine changes: a jump\n  may be the model, not the brand\n- Spend runs where variance is high" } },

  { name: "AI Answer Engine - retrieve rerank generate cite perplexity chatgpt search", spec: {
    title: "AI Answer Engine", sub: "How ChatGPT search / Perplexity / AI Overviews answer · the 4 gates a page must pass to be cited",
    nodes: [["u", "User Question", "user", "client", 0, 1.5], ["rw", "Query Rewrite\n+ Fan-out\n(3-8 sub-queries)", "flow", "ai", 1.35, 1.5, 170], ["kw", "Keyword Index\n(BM25)", "textaa", "rag", 2.8, 0.4], ["vx", "Vector Index\n(ANN)", "hnsw", "rag", 2.8, 2.6],
      ["web", "Web Index\n(crawled pages)", "spider", "data", 2.8, -0.9, 170], ["fu", "Hybrid Fusion\n(RRF)", "merge", "rag", 4.2, 1.5], ["rr", "Reranker\n(cross-encoder,\ntop 100 -> 10)", "sortarrows", "ai", 5.55, 1.5, 170],
      ["llm", "LLM writes\nthe answer", "sparkle", "ai", 5.55, 3, 170], ["cite", "Citations\n(3-6 sources)", "quote", "rag", 4.2, 3]],
    edges: [["u", "rw"], ["rw", "kw", "2 retrieved"], ["rw", "vx"], ["web", "kw", "1 indexed", D], ["kw", "fu"], ["vx", "fu"], ["fu", "rr"], ["rr", "llm", "3 in context"], ["llm", "cite", "4 chosen"]],
    notes: "Key decisions\n- Retrieval inside an LLM is still\n  retrieval: rewrite, retrieve,\n  rerank, generate, cite\n- BM25 wins exact names; vectors\n  win meaning; fuse with RRF\n- Only gate 4 is opaque - gates 1-3\n  are measurable and fixable\n- Extractable, factual sentences\n  survive the reranker" } },

  { name: "Prompt Universe - which questions to track query fan-out clustering", spec: {
    title: "Prompt Universe", sub: "Find the buyer questions a brand should track · generate, embed, cluster, de-duplicate, weight by demand",
    nodes: [["src", "Inputs\n(site, GSC keywords,\ncompetitors)", "folder", "rag", 0, 1, 170], ["gen", "Question\nGenerator (LLM)", "sparkle", "ai", 1.4, 0], ["fo", "Fan-out Capture\n(hidden sub-queries)", "flow", "ai", 1.4, 2, 170],
      ["emb", "Embedding Model", "embed", "ai", 2.8, 1], ["cl", "Cluster + Dedupe\n(similarity\nthreshold)", "kg", "rag", 4.2, 1, 170], ["dm", "Demand Signals\n(volume, Bing\nAI topics)", "bars", "ext", 4.2, -0.4, 170],
      ["vx", "Vector Index\n(prompts, filters:\ntenant, locale)", "hnsw", "rag", 4.2, 2.4, 170], ["set", "Tracked Set\n(per topic, weighted)", "checklist", "llmops", 5.6, 1, 170], ["rv", "Human Review", "check", "client", 5.6, 2.4]],
    edges: [["src", "gen"], ["src", "fo"], ["gen", "emb", "questions"], ["fo", "emb"], ["emb", "cl", "vectors"], ["dm", "cl", "weights", D], ["cl", "vx", "store"], ["cl", "set", "1 per cluster"], ["set", "rv", "approve", D]],
    notes: "Key decisions\n- Generate many, keep few: one\n  representative prompt per cluster\n- Taxonomies are multi-parent,\n  not trees (tags, not folders)\n- Hybrid search over prompts:\n  BM25 for brand names + vectors\n- Re-cluster monthly; keep ids\n  stable so trends don't reset" } },

  { name: "Analytics Agent + MCP - ask why visibility dropped text-to-sql tools", spec: {
    title: "Analytics Agent + MCP", sub: "\"Why did our visibility drop last week?\" · plan, fan out tool calls, answer with evidence",
    nodes: [["u", "Marketer", "user", "client", 0, 1], ["ext", "Customer's Agent\n(Claude, ChatGPT)", "aichat", "client", 0, 2.6, 170], ["mcp", "MCP Server\n(API keys, scopes)", "mcpserver", "agent", 1.4, 2.6, 170],
      ["ag", "Agent\n(plan mode)", "agentsvc", "agent", 1.4, 1], ["llm", "LLM", "sparkle", "ai", 1.4, -0.4], ["sk", "Skills\n(playbooks)", "skills", "agent", 2.8, -0.4], ["t", "Tools\n(fixed metric\nqueries)", "wrench", "agent", 2.8, 1, 170],
      ["g", "Guardrails\n(tenant filter,\nread-only)", "shield", "llmops", 4.2, 1, 170], ["ch", "ClickHouse\n(facts)", "olap", "data", 5.6, 0.2], ["raw", "Example Answers\n+ Cited Pages", "bucket", "data", 5.6, 1.8, 170], ["tr", "Traces + Evals", "spans", "llmops", 2.8, 2.6]],
    edges: [["u", "ag", "question"], ["ag", "llm", "plan"], ["ag", "sk", "", D], ["ag", "t", "batched calls"], ["t", "g"], ["g", "ch"], ["g", "raw"], ["ext", "mcp"], ["mcp", "t", "same tools"], ["ag", "tr", "", D]],
    notes: "Key decisions\n- Fixed metric tools before free\n  text-to-SQL: safer, testable\n- Tenant id injected by the server,\n  never by the model\n- Fan out tool calls in one turn\n  (fewer turns, lower cost)\n- Every claim links to evidence\n- Human approval before publishing" } },

  { name: "AI Crawler Analytics - gptbot claudebot perplexitybot logs referrals llm analytics", spec: {
    title: "AI Crawler Analytics", sub: "Which pages do GPTBot, ClaudeBot, PerplexityBot read · verify bots · join with AI referrals",
    nodes: [["bots", "AI Crawlers\n+ Humans", "spider", "client", 0, 1], ["cdn", "CDN / Edge\n(log push)", "globe", "edge", 1.35, 1], ["k", "Kafka\n(raw hits)", "stream", "msg", 2.7, 1], ["v", "Bot Verifier\n(UA + IP ranges,\nreverse DNS)", "shield", "svc", 4.05, 1, 170],
      ["ip", "Published IP\nRanges (daily)", "doc", "ext", 4.05, -0.4], ["ch", "ClickHouse\n(hits + rollups)", "olap", "data", 5.4, 1], ["ga", "GA4 / GSC\n(AI referrals)", "bars", "ext", 5.4, -0.4], ["dash", "LLM Analytics\nDashboard", "chart", "ops", 5.4, 2.4], ["mv", "Materialized Views\n(page x bot x day)", "layers", "data", 4.05, 2.4, 170]],
    edges: [["bots", "cdn", "requests"], ["cdn", "k", "logs"], ["k", "v"], ["ip", "v", "", D], ["v", "ch", "verified hits"], ["ga", "ch", "sessions", D], ["ch", "mv"], ["mv", "dash"]],
    notes: "Key decisions\n- User agents are easy to fake:\n  verify by IP range / reverse DNS\n- Stream in, batch insert (big\n  blocks), pre-aggregate rollups\n- Crawl-to-referral ratio shows\n  value given vs traffic received\n- Sample humans, keep all bots" } },

  { name: "Dual-served Content - markdown for ai crawlers middleware llms txt", spec: {
    title: "Dual-served Content", sub: "Humans get HTML, AI crawlers get clean markdown from the same URL · ~177 KB -> ~4 KB",
    nodes: [["h", "Human Browser", "browser", "client", 0, 0.3], ["bot", "AI Crawler\n(GPTBot, ClaudeBot)", "spider", "client", 0, 2.1, 170], ["mw", "Edge Middleware\n(detect + verify bot)", "edgefn", "edge", 1.45, 1.2, 170],
      ["html", "Next.js Page\n(HTML)", "browser", "svc", 2.9, 0.3], ["md", "/api/md route\n(rewrite, not\nredirect)", "doc", "svc", 2.9, 2.1, 170], ["cache", "CDN Cache\n(key varies on\nbot vs human)", "globe", "edge", 4.35, 1.2, 170],
      ["src", "One Source\n(MDX + machine.md)", "files", "data", 4.35, 2.9, 170], ["llms", "llms.txt +\nalternate link", "doc", "rag", 2.9, 3.5, 170], ["ci", "CI Diff Check\n(no drift)", "cicd2", "ops", 5.8, 2.9]],
    edges: [["h", "mw"], ["bot", "mw"], ["mw", "html", "human"], ["mw", "md", "bot"], ["html", "cache"], ["md", "cache"], ["src", "md", "markdown"], ["src", "html", "", D], ["ci", "src", "", D]],
    notes: "Key decisions\n- Rewrite keeps the same URL, so\n  citations point to the real page\n- Same content, cleaner format\n  (not cloaking)\n- Cache key must vary on bot vs\n  human, or humans get markdown\n- noindex + text/markdown header\n- Measure citation lift with A/B" } },

  { name: "Site Audit Crawler - technical seo aeo audit schema robots", spec: {
    title: "Site Audit Crawler", sub: "Crawl a brand's site, check what AI engines can read and lift · polite, incremental, JS only when needed",
    nodes: [["start", "Audit Request\n(domain)", "user", "client", 0, 1], ["fr", "Crawl Frontier\n(queue per domain)", "queue", "msg", 1.4, 1, 170], ["rb", "robots.txt +\nSitemaps", "doc", "ext", 1.4, -0.4], ["f", "Fetchers\n(polite, rate\nlimited)", "spider", "svc", 2.8, 1],
      ["js", "Headless Render\n(only if needed)", "browserbot", "svc", 2.8, 2.5, 170], ["dd", "Dedupe\n(URL normalise,\ncontent hash)", "bloom", "cache", 1.4, 2.5, 170], ["chk", "Checkers\n(schema, AI bot\naccess, structure)", "checklist", "svc", 4.2, 1, 170],
      ["llm", "Small LLM\n(liftable facts?)", "sparkle", "ai", 4.2, 2.5], ["pg", "Findings DB\n(+ last crawl)", "dbpg", "data", 5.6, 1], ["fix", "Fix Suggestions\n(Content Studio)", "wrench", "agent", 5.6, 2.5, 170]],
    edges: [["start", "fr"], ["rb", "fr", "allowed?", D], ["fr", "f", "next URL"], ["f", "js", "JS page", D], ["f", "dd", "new links"], ["dd", "fr", "unseen only"], ["f", "chk", "html"], ["chk", "llm", "", D], ["chk", "pg"], ["pg", "fix"]],
    notes: "Key decisions\n- One queue per domain = politeness\n- Bloom filter for 'seen URL?'\n  (tiny memory, no false misses)\n- Render JS only when the raw HTML\n  is empty (10x cheaper)\n- Re-crawl changed pages first\n  (ETag / Last-Modified)\n- Check GPTBot/ClaudeBot not blocked" } },
];
