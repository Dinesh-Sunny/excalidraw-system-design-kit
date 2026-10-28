// Agentic patterns (agentic/) and AI full designs (added to tpl/).
// Pattern names follow Anthropic's "Building effective agents" where they exist.
const D = { dash: true }, B = { both: true }, K = 80 / 240;

export const AGENTIC = [
  { name: "Prompt Chaining - sequential llm steps gate", spec: { nodes: [["in", "Input", "doc", "rag", 0, 1], ["l1", "LLM call 1", "sparkle", "ai", 1.3, 1], ["g", "Gate\n(check)", "check", "llmops", 2.6, 1], ["l2", "LLM call 2", "sparkle", "ai", 2.6, 2.2], ["out", "Output", "doc", "rag", 1.3, 2.2], ["x", "Exit / retry", "breaker", "ops", 2.6, -0.2]],
    edges: [["in", "l1"], ["l1", "g"], ["g", "l2", "pass"], ["l2", "out"], ["g", "x", "fail"]], notes: "Fixed steps, each LLM call\nworks on the last output.\nUse when the task splits\ncleanly into known steps." } },
  { name: "Routing - classify and send to specialist", spec: { nodes: [["in", "Input", "doc", "rag", 0, 1], ["r", "Router\n(LLM classifier)", "lb", "ai", 1.4, 1], ["a", "Handler A\n(billing)", "sparkle", "ai", 2.9, 0], ["b", "Handler B\n(tech support)", "sparkle", "ai", 2.9, 1], ["c", "Handler C\n(small model)", "neural", "ai", 2.9, 2]],
    edges: [["in", "r"], ["r", "a"], ["r", "b"], ["r", "c", "easy -> cheap model"]], notes: "Classify first, then use a\nspecialised prompt or model.\nCheap model for easy cases." } },
  { name: "Parallelization - sectioning voting fan-out", spec: { nodes: [["in", "Input", "doc", "rag", 0, 1], ["a", "LLM call", "sparkle", "ai", 1.4, 0], ["b", "LLM call", "sparkle", "ai", 1.4, 1], ["c", "LLM call", "sparkle", "ai", 1.4, 2], ["ag", "Aggregator\n(merge / vote)", "funnel", "agent", 2.8, 1], ["out", "Output", "doc", "rag", 2.8, 2.2]],
    edges: [["in", "a"], ["in", "b"], ["in", "c"], ["a", "ag"], ["b", "ag"], ["c", "ag"], ["ag", "out"]], notes: "Sectioning: split into parts.\nVoting: same task N times,\npick the best or majority." } },
  { name: "Orchestrator-Workers - dynamic subtasks", spec: { nodes: [["in", "Input", "doc", "rag", 0, 1], ["o", "Orchestrator", "robot", "agent", 1.2, 1], ["w1", "Worker", "robot", "agent", 2.4, 0], ["w2", "Worker", "robot", "agent", 2.4, 1], ["w3", "Worker", "robot", "agent", 2.4, 2], ["s", "Synthesizer", "funnel", "agent", 3.6, 1], ["out", "Output", "doc", "rag", 3.6, 2.2]],
    edges: [["in", "o"], ["o", "w1", "subtask"], ["o", "w2"], ["o", "w3"], ["w1", "s"], ["w2", "s"], ["w3", "s"], ["s", "out"]], notes: "Orchestrator decides the\nsubtasks at run time\n(unlike parallelization)." } },
  { name: "Evaluator-Optimizer - generate critique refine loop", spec: { nodes: [["in", "Input", "doc", "rag", 0, 1], ["g", "Generator\n(LLM)", "sparkle", "ai", 1.4, 1], ["e", "Evaluator\n(LLM judge)", "scales", "llmops", 2.8, 1], ["out", "Output", "doc", "rag", 2.8, 2.2]],
    edges: [["in", "g"], ["g", "e", "draft"], ["e", "out", "accepted"], ["e", "g", "feedback", { dash: true, via: [[2.8 + K, 0.3], [1.4 + K, 0.3]] }]], notes: "Loop until the evaluator\npasses it or max rounds.\nWorks when quality criteria\nare clear." } },
  { name: "Autonomous Agent - react loop think act observe", spec: { nodes: [["h", "Human", "user", "client", 0, 1], ["a", "Agent", "robot", "agent", 1.4, 1], ["l", "LLM\n(reason)", "sparkle", "ai", 2.8, 0], ["t", "Tools", "wrench", "agent", 2.8, 2], ["env", "Environment\n(APIs, files, web)", "cloud", "ext", 4.2, 2, 170]],
    edges: [["h", "a", "task"], ["a", "l", "think"], ["a", "t", "act"], ["t", "env"], ["env", "a", "observe", { dash: true, via: [[4.2 + 85 / 240, 3.1], [1.4 + K, 3.1]] }]], notes: "Loop: think > act > observe\nuntil done or step limit.\nNeeds sandbox, stop rules,\nand checkpoints." } },
  { name: "Multi-Agent Supervisor - team of specialist agents", spec: { nodes: [["u", "User", "user", "client", 0, 1], ["s", "Supervisor\nAgent", "robot", "agent", 1.4, 1], ["a1", "Research Agent", "search", "agent", 2.8, 0], ["a2", "Coding Agent", "code", "agent", 2.8, 1], ["a3", "Writer Agent", "doc", "agent", 2.8, 2], ["m", "Shared Memory\n/ State", "memchip", "agent", 4.2, 1]],
    edges: [["u", "s", "goal"], ["s", "a1", "delegate"], ["s", "a2"], ["s", "a3"], ["a1", "m", "", { dot: true }], ["a2", "m", "", { dot: true }], ["a3", "m", "", { dot: true }]], notes: "Each agent: own prompt,\ntools and context window.\nSupervisor routes + merges." } },
  { name: "Agentic RAG - agent chooses retrieval sources", spec: { nodes: [["u", "User", "user", "client", 0, 1], ["a", "RAG Agent", "robot", "agent", 1.4, 1], ["v", "Vector Index", "vector", "rag", 2.8, 0], ["w", "Web Search", "globe", "ext", 2.8, 1], ["q", "SQL Database", "db", "data", 2.8, 2], ["l", "LLM\n(grade + answer)", "sparkle", "ai", 4.2, 1]],
    edges: [["u", "a", "question"], ["a", "v", "docs"], ["a", "w", "fresh info"], ["a", "q", "numbers"], ["v", "l"], ["w", "l"], ["q", "l"]], notes: "Agent decides where to look,\ngrades results, re-queries\nif context is weak." } },
  { name: "Agent Memory - short term long term writer", spec: { nodes: [["a", "Agent", "robot", "agent", 0, 1], ["st", "Short-term\n(context window)", "memchip", "agent", 1.4, 0, 170], ["lt", "Long-term\n(vector + KV)", "vector", "agent", 1.4, 2, 170], ["w", "Memory Writer\n(summarise)", "gear", "agent", 2.9, 1, 170]],
    edges: [["a", "st", "current turn"], ["a", "lt", "recall"], ["a", "w", "after turn", D], ["w", "lt", "save facts"]] } },
  { name: "Human-in-the-Loop - approval before risky tools", spec: { nodes: [["a", "Agent", "robot", "agent", 0, 0], ["p", "Policy Check", "key", "llmops", 1.4, 0], ["h", "Human Approval", "check", "client", 1.4, 1.2], ["t", "Execute Tool", "wrench", "agent", 2.8, 0]],
    edges: [["a", "p", "action"], ["p", "t", "auto-allowed"], ["p", "h", "risky"], ["h", "t", "approve"], ["h", "a", "reject + reason", { dash: true, via: [[K, 1.5]] }]] } },
  { name: "MCP Architecture - host client servers", spec: { nodes: [["host", "Host App\n(IDE / chat)", "code", "client", 0, 1], ["c", "MCP Client", "plug", "client", 1.4, 1], ["s1", "MCP Server\n(GitHub)", "plug", "agent", 2.8, 0], ["s2", "MCP Server\n(Postgres)", "plug", "agent", 2.8, 1], ["s3", "MCP Server\n(Files)", "plug", "agent", 2.8, 2],
    ["e1", "GitHub API", "cloud", "ext", 4.2, 0], ["e2", "Database", "db", "data", 4.2, 1], ["e3", "File System", "doc", "data", 4.2, 2]],
    edges: [["host", "c"], ["c", "s1", "JSON-RPC"], ["c", "s2"], ["c", "s3"], ["s1", "e1"], ["s2", "e2"], ["s3", "e3"]], notes: "Servers expose tools,\nresources and prompts.\nTransport: stdio or HTTP." } },
  { name: "A2A - agent to agent across companies", spec: { nodes: [["a", "Agent A\n(your org)", "robot", "agent", 0, 1], ["r", "Agent Registry\n(agent cards)", "grid", "agent", 1.4, 0], ["b", "Agent B\n(partner org)", "robot", "ext", 2.8, 1]],
    edges: [["a", "r", "discover"], ["r", "b", "", D], ["a", "b", "A2A task + status", B]] } },
];

export const AI_TEMPLATES = [
  { name: "Coding Agent - claude code cursor ai developer", spec: {
    title: "Coding Agent", sub: "Agent loop in the terminal / IDE · tools, permissions, sandbox",
    nodes: [["dev", "Developer\n(CLI / IDE)", "terminal", "client", 0, 1], ["ag", "Coding Agent\n(loop)", "robot", "agent", 1.4, 1], ["perm", "Permission\nPrompts", "check", "llmops", 1.4, -0.4], ["mem", "Project Memory\n(CLAUDE.md)", "doc", "agent", 1.4, 2.4, 170],
      ["llm", "LLM", "sparkle", "ai", 2.8, -0.2], ["fs", "File Tools\n(read, edit, grep)", "doc", "agent", 2.8, 0.9, 170], ["sh", "Shell Sandbox\n(tests, build)", "cube", "agent", 2.8, 2, 170], ["mcp", "MCP Servers\n(issues, docs)", "plug", "agent", 2.8, 3.1, 170], ["git", "Git / Pull Request", "flow", "ext", 4.3, 2, 170]],
    edges: [["dev", "ag", "task"], ["ag", "llm", "next step"], ["ag", "fs"], ["ag", "sh", "run tests"], ["ag", "mcp"], ["ag", "perm", "risky cmd", D], ["ag", "mem", "load"], ["sh", "git", "commit"]],
    notes: "Key decisions\n- Loop: gather context > act > verify\n- Tools: read/edit, grep, shell, git\n- Ask permission for risky commands\n- Project memory loaded each session\n- Run tests before commit\n- Sub-agents for parallel searches" } },
  { name: "Deep Research Agent - multi agent web research report", spec: {
    title: "Deep Research Agent", sub: "Lead agent + parallel search agents · cited report",
    nodes: [["u", "User", "user", "client", 0, 1], ["lead", "Lead Agent\n(planner)", "checklist", "agent", 1.4, 1], ["w1", "Search Agent", "robot", "agent", 2.8, 0], ["w2", "Search Agent", "robot", "agent", 2.8, 1], ["w3", "Search Agent", "robot", "agent", 2.8, 2],
      ["web", "Web Search API", "globe", "ext", 4.2, 0.4], ["docs", "Internal Docs\n(RAG)", "vector", "rag", 4.2, 1.6], ["rep", "Report Writer\n(citations)", "doc", "agent", 2.8, 3.2, 170]],
    edges: [["u", "lead", "question"], ["lead", "w1", "sub-question"], ["lead", "w2"], ["lead", "w3"], ["w1", "web"], ["w2", "web"], ["w2", "docs"], ["w3", "docs"], ["lead", "rep", "findings", { via: [[1.4 + K, 3.2 + 56 / 170]] }]],
    notes: "Key decisions\n- Lead splits the question\n- Search agents run in parallel,\n  each with its own context\n- Return compressed findings\n- Writer cites every claim\n- Budget: steps, tokens, time" } },
  { name: "Customer Support Agent - ai helpdesk escalation", spec: {
    title: "Customer Support Agent", sub: "Answers from the help centre, acts via tools, hands off to humans",
    nodes: [["c", "Customer\n(chat, email)", "aichat", "client", 0, 1], ["gw", "Channel Gateway", "gateway", "edge", 1.4, 1], ["ag", "Support Agent", "robot", "agent", 2.8, 1], ["g", "Guardrails\n+ PII", "shield", "llmops", 2.8, -0.3],
      ["kb", "Help Centre\n(RAG)", "vector", "rag", 4.2, 0], ["crm", "Orders / CRM\n(MCP tools)", "plug", "agent", 4.2, 1], ["h", "Human Agent\n(handoff)", "user", "client", 4.2, 2], ["tk", "Ticketing", "doc", "ext", 2.8, 2.3]],
    edges: [["c", "gw"], ["gw", "ag"], ["ag", "g", "check"], ["ag", "kb", "answer"], ["ag", "crm", "refund, status"], ["ag", "h", "escalate", D], ["ag", "tk", "log"]],
    notes: "Key decisions\n- Ground answers in help centre\n- Tools need limits (refund cap)\n- Escalate on low confidence or anger\n- Pass full context to the human\n- Track resolution rate + CSAT" } },
  { name: "Realtime Voice Agent - phone call speech ai", spec: {
    title: "Realtime Voice Agent", sub: "Voice-to-voice under ~800 ms · streaming every stage",
    nodes: [["c", "Caller\n(phone / web)", "mobile", "client", 0, 1], ["rtc", "WebRTC / SIP\nGateway", "ws", "edge", 1.4, 1], ["stt", "Speech-to-Text\n(streaming)", "stt", "ai", 2.8, 0], ["ag", "Voice Agent\n(LLM)", "robot", "agent", 4.2, 1],
      ["tts", "Text-to-Speech\n(streaming)", "tts", "ai", 2.8, 2], ["vad", "Turn Detection\n(VAD)", "gauge", "ai", 1.4, -0.4], ["t", "Tools\n(booking, CRM)", "wrench", "agent", 5.6, 1]],
    edges: [["c", "rtc", "audio", B], ["rtc", "stt", "audio frames"], ["stt", "ag", "partial text"], ["ag", "tts", "text stream"], ["tts", "rtc", "audio"], ["rtc", "vad", "barge-in", D], ["ag", "t"]],
    notes: "Key decisions\n- Stream STT > LLM > TTS, no waiting\n- Detect turns and interruptions\n- Short replies, fillers while tools run\n- Speech-to-speech model = fewer hops\n- Log audio + transcripts for evals" } },
  { name: "AI Voice Tutor - canvas voice learning agent tutor education", spec: {
    title: "AI Voice Tutor", sub: "Talks, listens and draws to teach · speech to first word under ~1 s",
    nodes: [["l", "Learner\n(voice + taps)", "waveform", "client", 0, 1], ["vad", "Turn Detector\n(VAD)", "vad", "ai", 0, 0], ["stt", "Speech-to-Text\n(streaming)", "stt", "ai", 1.4, 0], ["sfu", "WebRTC SFU\n(LiveKit)", "sfu", "edge", 1.4, 1],
      ["tts", "Text-to-Speech\n(word timings)", "tts", "ai", 1.4, 2, 170], ["rt", "Router\n(small model)", "chip", "ai", 2.8, 0], ["tutor", "Tutor Agent\n(graph)", "agentsvc", "agent", 2.8, 1], ["gui", "Generative UI\n(typed actions)", "genui", "ai", 2.8, 2, 170],
      ["sync", "Realtime Sync\n(canvas CRDT)", "crdt", "svc", 2.8, 3, 170], ["mem", "Learner Model\n+ Memory", "learner", "data", 4.2, 0], ["llm", "LLM\n(model per job)", "sparkle", "ai", 4.2, 1], ["sr", "Spaced\nRepetition", "fsrs", "svc", 4.2, 2],
      ["plan", "Planner\n(sub-agents)", "checklist", "agent", 5.6, 0], ["obs", "Tracing\n+ Evals", "spans", "llmops", 5.6, 2]],
    edges: [["l", "sfu", "audio", B], ["sfu", "vad", "barge-in", D], ["sfu", "stt", "audio"], ["stt", "tutor", "final text"], ["tutor", "rt", "route"], ["tutor", "llm", "reply"], ["tutor", "tts", "sentences"], ["tts", "sfu", "audio"],
      ["tutor", "gui", "canvas actions"], ["gui", "sync"], ["sync", "l", "live board", { via: [[K, 3 + 1 / 3]] }], ["tutor", "mem", "recall, save", { dot: true }], ["sr", "tutor", "due reviews", D], ["plan", "mem", "course"], ["llm", "obs", "traces, cost", D]],
    notes: "Key decisions\n- Stream every stage; budget the second\n- Word-timed barge-in: keep only what was heard\n- Small model routes, big model teaches\n- Canvas changes only through typed actions\n- Memory + spaced repetition bring learners back\n- Evals gate every prompt or model change" } },
  { name: "Enterprise AI Gateway - llm platform governance", spec: {
    title: "Enterprise AI Gateway", sub: "One front door for every team's LLM calls",
    nodes: [["apps", "Internal Apps\n& Agents", "users", "client", 0, 1], ["gw", "AI Gateway\n(auth, quotas)", "lb", "ai", 1.5, 1], ["sc", "Semantic Cache", "cache", "cache", 1.5, -0.3], ["g", "Guardrails\n+ PII Redaction", "shield", "llmops", 1.5, 2.3],
      ["p1", "Claude API", "sparkle", "ai", 3, 0], ["p2", "Other Provider", "sparkle", "ai", 3, 1], ["p3", "Self-hosted\n(vLLM)", "neural", "ai", 3, 2], ["obs", "Tracing +\nCost Metering", "chart", "llmops", 0, 2.4]],
    edges: [["apps", "gw"], ["gw", "sc", "lookup"], ["gw", "g"], ["gw", "p1", "route"], ["gw", "p2"], ["gw", "p3"], ["gw", "obs", "tokens, cost", D]],
    notes: "Key decisions\n- One API key per team, quotas\n- Route by cost/latency, fallback\n- Redact PII before providers\n- Cache repeated prompts\n- Charge back cost per team" } },
];
