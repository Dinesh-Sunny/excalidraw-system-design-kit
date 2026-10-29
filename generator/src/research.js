// AI research platform full designs - the systems behind AI-moderated interview and consumer insight tools.
// node: [id, title, icon, theme, col, row, width?]   edge: [from, to, label, {dash, dot, both, via:[[c,r]]}]
const D = { dash: true }, B = { both: true }, DOT = { dot: true };

export const RESEARCH_TEMPLATES = [
  { name: "AI Interview Research Platform - ai moderated interviews qualitative consumer research insights video voice survey", spec: {
    title: "AI Interview Research Platform", sub: "AI moderates 1,000s of video interviews at once · themes, quotes and a cited report in hours",
    nodes: [["res", "Researcher\n(brief + goals)", "users", "client", 0, 0], ["app", "Study Builder\n(guide, screener)", "service", "svc", 1.4, 0], ["pg", "Postgres\n(studies, guides,\ntenants)", "dbpg", "data", 2.8, 0, 170],
      ["part", "Participant\n(phone / web)", "mobile", "client", 0, 1.5], ["rtc", "Interview Client\n(record, upload\nper answer)", "sfu", "edge", 1.4, 1.5, 170], ["mod", "AI Moderator\n(guide + probes)", "agentsvc", "agent", 2.8, 1.5, 170], ["llm", "LLM\n(model per job)", "sparkle", "ai", 4.2, 1.5],
      ["s3", "Recordings\n(S3)", "bucket", "data", 1.4, 3], ["q", "Job Queue\n(per stage)", "queue", "msg", 2.8, 3], ["mp", "Media Pipeline\n(transcode,\ntranscribe)", "conveyor2", "svc", 4.2, 3, 170],
      ["syn", "Insight Synthesis\n(codes, themes,\nquotes)", "kg", "rag", 2.8, 4.5, 170], ["ev", "Evals +\nQuote Checks", "scales", "llmops", 4.2, 4.5], ["kb", "Research\nKnowledge Base", "hnsw", "rag", 1.4, 4.5], ["rep", "Report + Ask\n(cited answers)", "quote", "rag", 0, 4.5]],
    edges: [["res", "app", "brief"], ["app", "pg", "guide"], ["app", "part", "invite link"], ["part", "rtc", "audio + video", B], ["rtc", "mod", "live turns"], ["mod", "llm", "next question"], ["mod", "pg", "guide state", D],
      ["rtc", "s3", "recording"], ["s3", "q", "uploaded"], ["q", "mp"], ["mp", "syn", "transcript"], ["ev", "syn", "grounded?", D], ["syn", "kb", "themes, quotes"], ["kb", "rep", "evidence"]],
    notes: "Key decisions\n- Live path (moderator) and batch path\n  (analysis) are separate systems\n- The guide is a state machine; the LLM\n  only phrases and decides to probe\n- Every insight keeps interview id +\n  timestamp: click a stat, hear the quote\n- Queue per stage, idempotent jobs, retries\n- Tenant id on every row + row-level security\n- Evals gate prompt and model changes" } },

  { name: "Live AI Moderator - realtime interview agent adaptive probing follow-up questions discussion guide", spec: {
    title: "Live AI Moderator", sub: "Asks, listens, digs deeper, moves on · reply in ~1 s, the guide finished on time",
    nodes: [["part", "Participant\n(camera + mic)", "mobile", "client", 0, 1.2], ["sfu", "WebRTC SFU", "sfu", "edge", 1.4, 1.2], ["vad", "Turn Detector\n(VAD)", "vad", "ai", 0, 0], ["stt", "Speech-to-Text\n(streaming,\nmany languages)", "stt", "ai", 1.4, 0, 170],
      ["mod", "Moderator Agent\n(one session)", "agentsvc", "agent", 2.8, 1.2, 170], ["guide", "Discussion Guide\n(state machine,\ntime per section)", "checklist", "agent", 4.2, 0, 180], ["probe", "Probe Decider\n(small model:\ndig deeper?)", "classify", "ai", 4.2, 1.2, 170], ["llm", "LLM\n(phrase the\nquestion)", "sparkle", "ai", 5.6, 1.2],
      ["qa", "Quality Guard\n(low effort, fraud,\nsafety)", "shield", "llmops", 5.6, 0, 170], ["tts", "Text-to-Speech\n(+ on-screen text)", "tts", "ai", 1.4, 2.4], ["stim", "Stimuli\n(concepts, images,\nscreen share)", "picture", "svc", 4.2, 2.4, 170], ["chk", "Checkpoint\n(resume on drop)", "disk", "agent", 2.8, 2.4]],
    edges: [["part", "sfu", "audio, video", B], ["sfu", "vad", "barge-in", D], ["sfu", "stt", "audio"], ["stt", "mod", "words + timings"], ["mod", "guide", "where are we?"], ["mod", "probe", "answer"], ["probe", "llm", "probe or move on"],
      ["probe", "qa", "check", D], ["mod", "tts", "question"], ["tts", "sfu", "voice"], ["mod", "stim", "show concept"], ["mod", "chk", "every turn", DOT]],
    notes: "Key decisions\n- Code owns the guide; the model only\n  phrases and decides to probe\n- Small model decides probe vs move on;\n  max 2 probes per question\n- Time budget per section keeps\n  interviews on length\n- Stream every stage; cut speech on barge-in\n- Checkpoint each turn: a dropped call\n  resumes where it stopped" } },

  { name: "Interview Media Pipeline - upload transcode transcribe diarize clips highlight reel video processing", spec: {
    title: "Interview Media Pipeline", sub: "Every recording becomes a transcript, speakers and clips · minutes after the call ends",
    nodes: [["dev", "Participant\nDevice", "mobile", "client", 0, 1], ["up", "Upload API\n(presigned,\nmultipart)", "send", "svc", 1.4, 1, 170], ["raw", "Raw Media\n(S3)", "bucket", "data", 2.8, 1], ["q", "Job Queue\n(one job per\nfile + stage)", "queue", "msg", 4.2, 1, 170],
      ["tc", "Transcoder\n(FFmpeg, HLS)", "video", "svc", 4.2, -0.2], ["dlq", "Dead Letter\n(retry, alert)", "queuedead", "msg", 5.6, -0.2], ["asr", "Transcription\n(word times)", "stt", "ai", 5.6, 1], ["dia", "Speakers +\nPII Redaction", "redact", "llmops", 5.6, 2.2],
      ["tr", "Transcript Store\n(Postgres JSONB)", "dbpg", "data", 4.2, 2.2, 170], ["clip", "Clip Maker\n(quote ->\ntimestamps)", "scissors", "svc", 2.8, 2.2, 170], ["cdn", "CDN\n(signed URLs)", "globe", "edge", 1.4, 2.2]],
    edges: [["dev", "up", "start"], ["up", "raw", "chunks, direct"], ["raw", "q", "object created"], ["q", "tc", "transcode"], ["tc", "dlq", "after 3 fails", D], ["q", "asr", "transcribe"], ["asr", "dia"], ["dia", "tr", "segments"],
      ["tr", "clip", "quote spans"], ["clip", "cdn", "highlight reel"]],
    notes: "Key decisions\n- Browser uploads straight to S3 in\n  chunks: resumable on bad mobile data\n- S3 event -> queue; jobs keyed by\n  file + stage, safe to retry\n- Transcode and transcribe in parallel\n- Word timestamps make every quote\n  a playable clip\n- Redact PII before analysis; keep raw\n  media in the customer's region" } },

  { name: "Insight Synthesis Engine - qualitative coding themes clustering grounded quotes across interviews analysis", spec: {
    title: "Insight Synthesis Engine", sub: "From 500 transcripts to themes with real quotes · every number links to the words behind it",
    nodes: [["tr", "Transcripts\n(segments +\ntimestamps)", "doc", "rag", 0, 1, 170], ["sp", "Answer Splitter\n(per question)", "parse", "svc", 1.4, 1, 170], ["code", "Coder LLM\n(codes + quote\nspans, typed)", "sparkle", "ai", 2.8, 1, 170], ["cb", "Codebook\n(per study,\neditable)", "clipboard", "llmops", 2.8, -0.3],
      ["vg", "Quote Verifier\n(span really\nexists?)", "quote", "llmops", 4.2, 1, 170], ["emb", "Embedding\nModel", "embed", "ai", 4.2, 2.3], ["cl", "Theme Clustering\n(across N\ninterviews)", "kg", "rag", 2.8, 2.3, 170], ["st", "Stats\n(counts, segments,\nranges)", "chart", "ops", 1.4, 2.3, 170],
      ["rep", "Report Writer\n(cited claims\nonly)", "doc", "rag", 0, 2.3], ["hr", "Researcher\nReview", "check", "client", 5.6, 1], ["ev", "Evals\n(golden coded set)", "scales", "llmops", 5.6, -0.3, 170]],
    edges: [["tr", "sp"], ["sp", "code", "one answer"], ["cb", "code", "codes", D], ["code", "vg", "quote spans"], ["vg", "emb", "verified"], ["emb", "cl", "vectors"], ["cl", "st", "theme sizes"], ["st", "rep"],
      ["vg", "hr", "edit, merge", B], ["ev", "vg", "precision", D]],
    notes: "Key decisions\n- Code one answer at a time with a\n  typed schema: code, quote span, sentiment\n- Verify every quote is a real substring\n  of the transcript: no invented quotes\n- Cluster codes into themes across\n  interviews; stable theme ids\n- Counts with ranges, not fake precision\n- The researcher edits the codebook;\n  re-run is cheap and deterministic" } },

  { name: "Research Knowledge Base - ask across all past studies cited answers always-on insights consumer intelligence", spec: {
    title: "Research Knowledge Base", sub: "Ask any question across every study a brand has run · answers in seconds, with the clips to prove them",
    nodes: [["u", "Brand Team\n(insights, product)", "users", "client", 0, 1, 170], ["ask", "Ask Agent\n(plan, search, cite)", "agentsvc", "agent", 1.4, 1, 170], ["perm", "Permissions\n(tenant + study)", "policy", "llmops", 1.4, -0.2, 170], ["hr", "Hybrid Retriever\n(BM25 + vectors,\nfilters)", "merge", "rag", 2.8, 1, 170],
      ["idx", "Index\n(pgvector + text,\ntenant id)", "hnsw", "rag", 2.8, 2.3, 170], ["rr", "Reranker", "sortarrows", "rag", 4.2, 1], ["llm", "LLM\n(answer from\nevidence)", "sparkle", "ai", 4.2, -0.2], ["cit", "Citations\n(quote + clip)", "quote", "rag", 5.6, -0.2],
      ["ing", "Ingest\n(themes, quotes,\ntranscripts)", "conveyor", "rag", 4.2, 2.3, 170], ["wf", "Always-on Studies\n(scheduled waves)", "calendar", "agent", 5.6, 2.3, 170], ["mcp", "API + MCP\n(customers' agents)", "mcpserver", "agent", 0, 2.3, 170]],
    edges: [["u", "ask", "question"], ["ask", "perm", "who can see?"], ["ask", "hr", "sub-queries"], ["hr", "idx", "filtered search"], ["hr", "rr", "top 100"], ["rr", "llm", "top 10"], ["llm", "cit", "every claim"],
      ["ing", "idx", "embed + store"], ["wf", "ing", "new interviews"], ["mcp", "ask", "same agent"]],
    notes: "Key decisions\n- Filter by tenant and study ACL inside\n  the search, never after it\n- Hybrid search: brand and product names\n  need keywords; meaning needs vectors\n- Search themes first, then quotes,\n  then raw transcript\n- Say 'not enough evidence' instead of\n  guessing\n- Always-on waves keep the base fresh;\n  answers show the date of the evidence" } },
];
