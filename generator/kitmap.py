"""Map every practice-design node title to the kit block that draws it.
Heuristic (exact title, then the longest block title inside the node title) plus hand overrides.
Writes out/practice.kitmap.json {node title: block id}. Run after adding practice questions; build-showcase.py reads it."""
import json, re, sys
LIB = sys.argv[1] if __name__ == '__main__' and len(sys.argv) > 1 else ('out/System Design Kit.excalidrawlib' if __import__('os').path.exists('out/System Design Kit.excalidrawlib') else '../library/system-design-ai-kit.excalidrawlib')
lib = json.load(open(LIB))['libraryItems']
SKIP = {'tpl', 'guide', 'note', 'zone', 'link', 'frame', 'screen', 'ui', 'agentic', 'pattern'}
OVR = {  # node title -> "section/Block title"
 '/api/md route (rewrite, not redirect)': 'svc/Service', 'AI Crawler (GPTBot, ClaudeBot)': 'client/Bot / Crawler', 'AI Crawlers + Humans': 'client/Bot / Crawler', 'AI Engine (non-deterministic)': 'ext/AI Answer Engine', 'AI Engines (ChatGPT, Perplexity, AI Overviews, Gemini)': 'ext/AI Answer Engine', 'Adaptive Sampler (more runs where variance is high)': 'svc/Scheduler / Cron', 'Agent (plan mode)': 'agent/AI Agent', 'Alerts + Weekly Report': 'ops/Alerting', 'Answer Facts (mentioned? cited? position)': 'data/OLAP DB (ClickHouse)', 'Audit Request (domain)': 'client/User', 'Backfill + Re-parse History': 'msg/Batch / ETL (Spark)', 'Brands + Agencies': 'client/Users', 'CI Diff Check (no drift)': 'ops/CI/CD', 'CI Gate (no regressions)': 'ops/CI/CD', 'Change Detector (outside interval?)': 'ops/Alerting', 'Checkers (schema, AI bot access, structure)': 'svc/Worker', 'ClickHouse (answer facts)': 'data/OLAP DB (ClickHouse)', 'ClickHouse (facts)': 'data/OLAP DB (ClickHouse)', 'ClickHouse (hits + rollups)': 'data/OLAP DB (ClickHouse)', 'Cluster + Dedupe (similarity threshold)': 'rag/Knowledge Graph', 'Code Mode (one script, many calls)': 'agent/Code Sandbox', 'Context Packer (rank, truncate)': 'rag/Context Builder', 'Crawl Frontier (queue per domain)': 'msg/Message Queue', "Customer's Agent (Claude, ChatGPT)": 'client/AI Agent', 'Cutover Flag (per tenant)': 'svc/Feature Flags', 'Dedupe (URL normalise, content hash)': 'cache/Bloom Filter', 'Demand Signals (volume, Bing AI topics)': 'ops/Analytics', 'Edge Middleware (detect + verify bot)': 'edge/Edge Function', 'Engine Changes (model version, search on/off)': 'svc/Feature Flags', 'Engine Workers (rate limit, retry, breaker)': 'svc/Worker', 'Error Analysis (read failures)': 'llmops/Offline Evals', 'Example Answers + Cited Pages': 'data/Object Storage (S3)', 'Fan-out Capture (hidden sub-queries)': 'ext/AI Answer Engine', 'Fetchers (polite, rate limited)': 'client/Bot / Crawler', 'Findings DB (+ last crawl)': 'data/PostgreSQL', 'Fix Suggestions (Content Studio)': 'agent/Tools', 'GA4 / GSC (AI referrals)': 'ops/Analytics', 'Golden Set (queries + graded judgments)': 'llmops/Offline Evals', 'Golden Set + Parser Evals': 'llmops/Offline Evals', 'Headless Render (only if needed)': 'svc/Headless Browser Farm', 'Human Browser': 'client/Web Browser', 'Human Labels (domain experts)': 'agent/Human Approval', 'Human Review': 'agent/Human Approval', 'Hybrid Fusion (RRF)': 'rag/Hybrid Retriever', 'Inputs (site, GSC keywords, competitors)': 'rag/Data Sources', 'Job Queue (one per engine)': 'msg/Message Queue', 'Judge (enough evidence?)': 'llmops/LLM-as-Judge', 'Keyword Search': 'rag/Keyword Index (BM25)', 'Mapping Table (ids, brands, prompts)': 'data/Key-Value (DynamoDB)', 'Marketer': 'client/User', 'Materialized Views (page x bot x day)': 'data/OLAP DB (ClickHouse)', 'Metrics (recall@100, nDCG@10, MRR)': 'llmops/Offline Evals', 'N Repeated Runs (per engine, region)': 'svc/Worker', 'New Pipeline (ours)': 'msg/Batch / ETL (Spark)', 'New Results': 'data/OLAP DB (ClickHouse)', 'Next.js Page (HTML)': 'svc/Web Server', 'Offline Runner (old vs new ranker)': 'llmops/Offline Evals', 'Old Pipeline (acquired)': 'msg/Batch / ETL (Spark)', 'Old Results': 'data/OLAP DB (ClickHouse)', 'One Source (MDX + machine.md)': 'data/File / Doc Store', 'Online Test (interleaving or A/B)': 'svc/Feature Flags', 'Postgres (tenants, prompts, plans)': 'data/PostgreSQL', 'Published IP Ranges (daily)': 'ext/Third-party API', 'Query Logs (sampled)': 'ops/Logging', 'Query Rewrite + Fan-out (3-8 sub-queries)': 'ai/LLM', 'Question': 'client/User', 'Raw Answers (S3, keep forever)': 'data/Object Storage (S3)', 'Reconciler (diff by metric, per tenant)': 'svc/Worker', 'Same Inputs (prompts, engines)': 'rag/Data Sources', 'Scheduler (spread over day, plan quotas)': 'svc/Scheduler / Cron', 'Score + Share of Voice': 'ops/Monitoring', 'Skills (playbooks)': 'agent/Agent Skills', 'Stats Job (rate + Wilson interval)': 'svc/Worker', 'Traces + Evals': 'llmops/Tracing', 'Tracked Prompt (+ 3 phrasings)': 'llmops/Prompt Registry', 'Tracked Set (per topic, weighted)': 'llmops/Prompt Registry', 'Vector Search': 'rag/Vector Index', 'Web / SQL Tool': 'agent/Tools', 'Web App + API (+ MCP)': 'svc/Service', 'Web Index (crawled pages)': 'data/Search Index (Elasticsearch)', 'llms.txt + alternate link': 'data/File / Doc Store', 'robots.txt + Sitemaps': 'ext/Third-party API',
 'AI Gateway (auth, quotas)': 'ai/AI Gateway / Model Router', 'Model Router': 'ai/AI Gateway / Model Router',
 'APNs': 'ext/Push Provider (APNs / FCM)', 'FCM': 'ext/Push Provider (APNs / FCM)', 'Other Provider': 'ext/Third-party API',
 'Agent Orchestrator': 'agent/Supervisor Agent', 'Lead Agent (planner)': 'agent/Supervisor Agent', 'Search Agent': 'agent/Sub-agent / Worker',
 'Support Agent': 'agent/AI Agent', 'Coding Agent (loop)': 'agent/AI Agent', 'Voice Agent (LLM)': 'agent/AI Agent',
 'Aggregators (Spark, hourly)': 'msg/Batch / ETL (Spark)', 'Reconciliation (daily)': 'svc/Scheduler / Cron', 'Trie Builder': 'msg/Batch / ETL (Spark)',
 'Android Queue': 'msg/Message Queue', 'iOS Queue': 'msg/Message Queue', 'Email Queue': 'msg/Message Queue', 'SMS Queue': 'msg/Message Queue', 'Transcode Queue': 'msg/Message Queue',
 'URL Frontier (priority queues)': 'msg/Message Queue', 'Workers (retry + DLQ)': 'msg/Dead Letter Queue',
 'Block Storage (S3)': 'data/Object Storage (S3)', 'Content Store (S3)': 'data/Object Storage (S3)', 'Raw Video (S3)': 'data/Object Storage (S3)', 'Segments (S3, HLS/DASH)': 'data/Object Storage (S3)',
 'Trie Store (snapshots)': 'data/Object Storage (S3)',
 'Bookings DB (SQL, ACID)': 'data/SQL Database', 'Ledger DB (double-entry)': 'data/SQL Database', 'Payments DB (state machine)': 'data/SQL Database', 'Metadata DB': 'data/SQL Database',
 'Metadata DB (files, versions)': 'data/SQL Database', 'Business DB (+ replicas)': 'data/Read Replica', 'Posts DB': 'data/Wide-column (Cassandra)', 'Trips DB': 'data/SQL Database',
 'Message Store (Cassandra)': 'data/Wide-column (Cassandra)', 'Conversation Store': 'data/Document DB (MongoDB)', 'Events DB + Search': 'data/Search Index (Elasticsearch)',
 'Social Graph (followers)': 'data/Graph DB (Neo4j)', 'URL Seen Store': 'data/Key-Value (DynamoDB)', 'Prefs + Device Tokens': 'data/Key-Value (DynamoDB)', 'Rules Config': 'svc/Config / Coord (ZooKeeper)',
 'Memory (vector + KV)': 'agent/Long-term Memory', 'Project Memory (CLAUDE.md)': 'agent/Long-term Memory',
 'Caller (phone / web)': 'client/Voice AI', 'Clients': 'client/Clients Group', 'Creator': 'client/User', 'Viewer': 'client/User', 'Customer': 'client/User',
 'Customer (chat, email)': 'client/AI Chat App', 'Developer (CLI / IDE)': 'client/CLI / Developer', 'Driver App': 'client/Mobile App', 'Rider App': 'client/Mobile App',
 'Other Devices': 'client/Clients Group', 'Internal Apps & Agents': 'client/AI Clients Group', 'Websites': 'client/Web Browser', 'Seed URLs': 'rag/Data Sources',
 'Chat Server (WebSocket)': 'svc/WebSocket Server', 'Gateway + WebSocket': 'svc/WebSocket Server', 'Notification (long poll / WS)': 'svc/WebSocket Server', 'Channel Gateway': 'edge/API Gateway',
 'WebRTC / SIP Gateway': 'edge/API Gateway', 'Virtual Waiting Room': 'edge/Rate Limiter', 'Rejected 429 + Retry-After': 'edge/Rate Limiter',
 'Claude API': 'ai/LLM', 'Self-hosted (vLLM)': 'ai/Model Serving (GPU)', 'Self-hosted Model (vLLM)': 'ai/Model Serving (GPU)', 'Turn Detection (VAD)': 'ai/Small / Local Model',
 'Dedup (Bloom filter)': 'cache/Cache', 'Documents (PDF, web, DB)': 'rag/Data Sources', 'Help Centre (RAG)': 'rag/Hybrid Retriever', 'Internal Docs (RAG)': 'rag/Hybrid Retriever',
 'Retriever (hybrid)': 'rag/Hybrid Retriever', 'Parser + Link Extractor': 'rag/Loader / Parser', 'Fetchers': 'svc/Worker', 'Fan-out Workers': 'svc/Worker', 'Transcoders (workers)': 'svc/Worker',
 'Email Provider': 'ext/Email / SMS Provider', 'SMS Provider': 'ext/Email / SMS Provider', 'External APIs': 'ext/Third-party API', 'Web Search API': 'ext/Third-party API', 'Maps / ETA': 'ext/Maps API',
 'Fraud / Risk': 'svc/Ranking / Recommendation', 'Git / Pull Request': 'ops/CI/CD', 'Human Agent (handoff)': 'agent/Human Approval', 'Permission Prompts': 'llmops/Permissions / Policy',
 'MCP Servers (issues, docs)': 'agent/MCP Server', 'Tools / MCP Servers': 'agent/MCP Server', 'Orders / CRM (MCP tools)': 'agent/MCP Server', 'Shell Sandbox (tests, build)': 'agent/Code Sandbox',
 'Geo Index (geohash)': 'cache/Redis', 'Matching (dispatch)': 'svc/Service', 'Services': 'svc/Service', 'Services (triggers)': 'svc/Service', 'Shortener API': 'svc/Web Server',
 'Templates': 'data/Document DB (MongoDB)', 'Ticketing': 'ext/Third-party API', 'Video API': 'svc/Media Service', 'Webhook Handler': 'svc/Serverless Function', 'Analytics Warehouse': 'data/Data Warehouse',
 'Desktop Client (watcher+chunker)': 'client/Desktop App', 'Media (S3 + CDN)': 'data/Object Storage (S3)', 'Evals & Tracing': 'llmops/Offline Evals', 'Report Writer (citations)': 'rag/Citations',
 'Guardrails + PII Redaction': 'llmops/Guardrails', 'API Gateway + Rate Limiter': 'edge/API Gateway', 'Location Search Service': 'svc/Location Service',
 'Async Count Sync': 'svc/Worker', 'Company Knowledge (RAG)': 'rag/Hybrid Retriever', 'Key Directory': 'ops/Secrets / KMS', 'Live Ingest (RTMP/SRT)': 'svc/Media Service',
 'Live Location (in memory)': 'cache/Redis', 'Live Updates (WebSocket)': 'svc/WebSocket Server', 'Managed Postgres': 'data/PostgreSQL', 'Multi-region Replica': 'data/Read Replica',
 'Payout Scheduler': 'svc/Scheduler / Cron', 'Priority Queue': 'msg/Message Queue', 'Quality + License Filter': 'llmops/Guardrails', 'Semantic Suggestions': 'ai/Embedding Model',
 'Thumbnailer': 'svc/Worker', 'Token Meter': 'llmops/Token & Cost Metering',
}
byct, cands = {}, []
for it in lib:
    m = re.match(r'^sd:([a-z]+)/\s(.*)$', it['name'])
    if not m or ' SECTION - ' in it['name']: continue
    c, t = m.group(1), m.group(2).split(' - ')[0]
    byct.setdefault(c + '/' + t, it['id'])
    if c in SKIP: continue
    for v in {t, re.sub(r'\s*\(.*?\)', '', t)}:
        v = v.strip().lower()
        if len(v) >= 3: cands.append((v, it['id']))
def find(title):
    if title in OVR: return byct.get(OVR[title])
    s = title.lower(); base = re.sub(r'\s*\(.*?\)', '', s).strip()
    for v, i in cands:
        if v in (s, base): return i
    hits = [(v, i) for v, i in cands if re.search(r'(?<![a-z])' + re.escape(v) + r'(?![a-z])', s)]
    return max(hits, key=lambda h: len(h[0]))[1] if hits else None
if __name__ == '__main__':
    src = sys.argv[2] if len(sys.argv) > 2 else 'out/practice.json'
    titles = sorted({n['title'] for d in json.load(open(src)) for n in d['nodes'] + [n for v in d.get('variants', {}).values() for n in v.get('nodes', [])]})
    out = {t: find(t) for t in titles}
    bad = [o for o in OVR.values() if o not in byct]; miss = [t for t, v in out.items() if not v]
    json.dump({k: v for k, v in out.items() if v}, open('out/practice.kitmap.json', 'w'), indent=1, ensure_ascii=False)
    print(len(out), 'titles,', len(miss), 'unmapped', miss, 'bad overrides', bad)
