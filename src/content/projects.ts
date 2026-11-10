// Featured projects. Descriptions are drawn from each project's README / code / git history.
// `role` states Huzaifa's actual contribution; team projects credit collaborators.

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  category: "AI / ML" | "Systems" | "Full-stack" | "Automation";
  year: string;
  role: string;
  team?: string;
  summary: string;
  problem: string;
  solution: string[];
  highlights: string[];
  stack: string[];
  flow: { label: string; detail: string }[];
  snippet: { file: string; lang: string; code: string };
  media?: { loop: string; demo: string; poster: string };
  links?: { label: string; href: string }[];
  note?: string;
  resumeBullets: string[];
  featuredOnResume?: boolean;
};

const rawProjects: Project[] = [
  {
    slug: "zerodevai",
    title: "ZeroDevAI",
    tagline: "Speak your idea. Watch it become an app.",
    category: "AI / ML",
    year: "2026",
    role: "Built the code-generation agent (Frontend Coding Agent + software-engineering agent) and contributed across the Flask/WebSocket backend.",
    team: "Team of four for Microsoft Imagine Cup 2026",
    summary:
      "A voice-first platform where a requirements agent, a coding agent and a deploy agent turn a spoken description into a running React/Flask application.",
    problem:
      "Non-technical founders pay heavily for an MVP, and people who cannot type (motor impairments, RSI) are locked out of building software entirely.",
    solution: [
      "A requirements agent interviews the user (speech in via Azure AI Speech) and produces a structured spec.",
      "A tool-calling coding agent works inside a sandboxed workspace: it reads the file tree, reads before it writes, writes complete files, installs dependencies and runs a build check, looping until the build is green.",
      "A deploy agent ships the result, while a preview manager and Socket.IO stream build logs and chat to the browser in real time.",
    ],
    highlights: [
      "Agent loop built on the OpenAI tool-calls API with enforced 'read before modify' discipline",
      "Real-time build/log streaming over WebSockets with session restore from the database",
      "Starts from a Vite + React template so generated apps are consistent and buildable",
    ],
    stack: ["Python", "Flask", "Socket.IO", "SQLAlchemy", "React 18", "Vite", "Tailwind", "Azure OpenAI", "Azure AI Speech", "Azure Container Apps"],
    flow: [
      { label: "Voice", detail: "Azure AI Speech" },
      { label: "Requirements agent", detail: "spec + Q&A" },
      { label: "Coding agent", detail: "tools → files → build" },
      { label: "Deploy agent", detail: "Container Apps" },
      { label: "Live app", detail: "preview + logs" },
    ],
    snippet: {
      file: "coding_agent/coding_agent.py",
      lang: "python",
      code: `CODING_AGENT_TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "read_file",
            "description": "Read the contents of one or more files. "
                           "You MUST read a file before modifying it.",
            "parameters": {
                "type": "object",
                "properties": {"files": {"type": "array",
                                         "items": {"type": "string"}}},
                "required": ["files"],
            },
        },
    },
    # write_or_replace_file, install_dependency, run_build_check, ...
]`,
    },
    resumeBullets: [
      "Built the code-generation agent for ZeroDevAI, a voice-to-app platform developed by a four-person team for Microsoft Imagine Cup 2026.",
      "Implemented a tool-calling agent loop on Azure OpenAI (read file, write file, install dependency, run build check) that iterates until the generated React app builds successfully.",
      "Enforced read-before-write rules and a Vite + React template so generated applications stay consistent and buildable.",
      "Streamed build logs and chat to the browser over Flask-SocketIO with database-backed session restore."
    ],
    featuredOnResume: true,
  },
  {
    slug: "bigsearch",
    title: "BigSearch",
    tagline: "A full-text search engine built from first principles.",
    category: "Systems",
    year: "2025",
    role: "Largest share of commits: built the HTML inverted index, the msgpack + memory-mapped barrel storage, and the hybrid keyword + semantic search with caching. Teammates built the lexicon, forward index, research-paper index and trie autocomplete.",
    team: "Three-person DSA course project",
    summary:
      "Indexes ~48,000 crawled web pages and the CORD-19 research corpus with a ~1.4M-term lexicon, barrelled inverted indexes, PageRank/citation rank, trie autocomplete and TF-IDF-weighted semantic search.",
    problem:
      "Off-the-shelf search hides the interesting parts. The goal was to implement the whole pipeline (lexicon, forward index, inverted index, ranking) and make it fast enough to query interactively on a laptop.",
    solution: [
      "Tokenised and normalised two very different corpora into one lexicon of ~1.4 million terms with integer term IDs.",
      "Built forward and inverted indexes with zone-weighted hit lists, then split the inverted index into barrels, converted from JSON to msgpack and memory-mapped for fast loads (benchmarked in-repo).",
      "Ranked with PageRank (C++), domain rank and citation rank, then blended keyword scores with embedding-based semantic scores.",
      "A trie built from term frequencies (a teammate's module) powers autocomplete, with length, frequency and suffix-penalty rules to keep suggestions clean.",
      "A separate Flask server (BigSearchServer) loads the memory-mapped barrels, serves search and autocomplete over a REST API with a React UI, and can add new documents incrementally through delta barrels.",
    ],
    highlights: [
      "~48,000 web documents plus the CORD-19 papers indexed",
      "msgpack + memory-mapped barrels, with load-time benchmarks to justify the format",
      "Hybrid ranking: keyword + PageRank/citation rank + TF-IDF-weighted embeddings",
    ],
    stack: ["Python", "C++", "msgpack", "orjson", "NumPy", "pandas", "TF-IDF", "PageRank", "Trie"],
    flow: [
      { label: "Crawl / parse", detail: "HTML + CORD-19 JSON" },
      { label: "Lexicon", detail: "~1.4M terms" },
      { label: "Forward index", detail: "doc → terms" },
      { label: "Inverted index", detail: "term → hits" },
      { label: "Barrels", detail: "msgpack, mmap" },
      { label: "Hybrid rank", detail: "keyword + PageRank + semantic" },
    ],
    snippet: {
      file: "Barrel Scripts/memory_mapping.py",
      lang: "python",
      code: `with open(postings_file, "wb") as bf:
    for idx, posting_list in enumerate(barrel_data):
        blob = ormsgpack.packb(posting_list)
        bf.write(blob)
        offsets[idx] = (cursor, len(blob))   # (byte offset, length)
        cursor += len(blob)

# Each barrel becomes postings.bin + offsets.json, so a query can
# memory-map the file and read only the postings it needs.`,
    },
    media: { loop: "/media/bigsearch/loop.mp4", demo: "/media/bigsearch/demo.mp4", poster: "/media/bigsearch/poster.jpg" },
    note: "Demo runs the real BigSearchServer on a small index built from the repo's sample files (100 web pages + 100 research papers). The full 48k-page index and semantic model are not included, so semantic scores read 0.000.",
    links: [
      { label: "Processing & indexing pipeline (BigSearch)", href: "https://github.com/iPythonezta/BigSearch" },
      { label: "Search server & UI (BigSearchServer)", href: "https://github.com/iPythonezta/BigSearchServer" },
    ],
    resumeBullets: [
      "Co-built a full-text search engine over ~48,000 crawled web pages and the CORD-19 research-paper corpus with a ~1.4 million-term lexicon.",
      "Implemented the inverted index for web pages, with zone-weighted hit lists (title, headings, meta description, anchors, URL, body).",
      "Split the inverted index into barrels, converted them from JSON to msgpack and memory-mapped them, benchmarking load times to justify the format.",
      "Built hybrid ranking that blends keyword scores, PageRank/domain rank and TF-IDF-weighted word-embedding similarity, with a word-level LRU cache.",
      "Main contributor (9 of 13 commits) to BigSearchServer, a Flask REST API and React UI that serves search and autocomplete and supports incremental indexing through delta barrels."
    ],
    featuredOnResume: true,
  },
  {
    slug: "draftgenius",
    title: "DraftGenius",
    tagline: "AI fantasy-cricket team optimiser for the PSL.",
    category: "AI / ML",
    year: "2026",
    role: "Worked on the modelling and team-generation algorithms (HMM form, Elo, genetic optimiser) alongside a teammate who built most of the server and UI.",
    team: "Two-person project",
    summary:
      "Pick two franchises and get three optimised XIs (Safe, Explosive, Balanced). Each player is scored by HMM-predicted form and a cross-league Elo rating, then a genetic algorithm searches the legal team space while its progress streams live to the browser.",
    problem:
      "Fantasy cricket picks are mostly gut feel. Good selection is a constrained optimisation problem (budget, roles, franchise limits) over noisy performance data.",
    solution: [
      "A Hidden Markov Model labels each player's current form as cold, average or hot and yields next-appearance transition probabilities.",
      "A chronological Elo engine rates players across eight T20 leagues (PSL, IPL, BBL, BPL, CPL, SA20, ILT20, LPL) and converts rating into a bounded score multiplier.",
      "A custom genetic algorithm optimises each XI under budget, role and franchise constraints for three risk strategies.",
      "Server-Sent Events stream generation-by-generation fitness to a React/TypeScript dashboard.",
    ],
    highlights: [
      "Three ML/optimisation techniques composed into one scoring pipeline",
      "Elo history across eight leagues; incremental data pipeline with parquet caching",
      "Live GA convergence streamed over SSE",
    ],
    stack: ["Python", "Flask", "hmmlearn", "scikit-learn", "pandas", "NumPy", "React 18", "TypeScript", "Vite", "Tailwind", "Recharts", "Framer Motion"],
    flow: [
      { label: "Cricsheet data", detail: "8 leagues" },
      { label: "Fantasy scoring", detail: "per-match points" },
      { label: "Elo + HMM form", detail: "player strength" },
      { label: "Genetic algorithm", detail: "3 strategies" },
      { label: "SSE stream", detail: "live fitness" },
      { label: "React UI", detail: "XIs + charts" },
    ],
    snippet: {
      file: "README.md (pipeline)",
      lang: "text",
      code: `1. Download   CricsheetUpdater  - ETag-aware, skips unchanged archives
2. Parse      MatchParser        - match JSON -> per-player records (parquet cache)
3. Score      Pipeline.run()     - batting / bowling / fielding fantasy points
4. Form       FormFeatureBuilder - rolling averages + streaks
5. Elo        EloEngine          - chronological ratings across all leagues
6. Photos     ProfileFetcher     - optional headshot URL cache`,
    },
    media: { loop: "/media/draftgenius/loop.mp4", demo: "/media/draftgenius/demo.mp4", poster: "/media/draftgenius/poster.jpg" },
    links: [{ label: "Source on GitHub", href: "https://github.com/Asim-Shoaib/FantasyPredictorServer" }],
    note: "Recorded locally with Playwright; idle waits are sped up. Repository is under my teammate's account; my research notebooks for the Elo and HMM work live in a separate folder.",
    resumeBullets: [
      "Co-built an AI fantasy-cricket team optimiser for the Pakistan Super League (PSL) that generates Safe, Balanced and Explosive XIs for any fixture.",
      "Modelled player form with Hidden Markov Models (cold, average, hot) and a chronological Elo rating across eight T20 leagues.",
      "Optimised team selection with a genetic algorithm under budget, role and per-franchise constraints.",
      "Streamed generation-by-generation fitness to a React/TypeScript dashboard using Server-Sent Events; data pipeline uses parquet caching of Cricsheet match data."
    ],
    featuredOnResume: true,
  },
  {
    slug: "pakwarera",
    title: "PakWarera",
    tagline: "Market forecasting and country intelligence for a live strategy game.",
    category: "Full-stack",
    year: "2026",
    role: "Primary developer (most commits): backend, workers, forecasting and deployment pipeline.",
    team: "Small community team",
    summary:
      "A Flask dashboard over the WarEra game's economy: live prices and order books, Prophet forecasts with MAPE per item, inventory tracking, country recon, donation analytics and war-alert push notifications behind Discord OAuth2.",
    problem:
      "Players trade in a volatile market with no tooling for forecasting, tracking or coordinating at country level.",
    solution: [
      "An hourly Modal cron job scrapes market prices into Turso (libSQL); the Flask app reads them read-only.",
      "A background Prophet engine fits a model per item and publishes 6h / 12h / 24h forecasts with MAPE accuracy and a fallback in-sample estimate for sparse series.",
      "Discord OAuth2 resolves citizenship from server roles, with approval flows and role tiers (guest, user, admin, president).",
      "Separate daemon workers handle recon scraping, donation sync and Web Push war alerts into Azure PostgreSQL through a shared connection pool; GitHub Actions deploys to Azure on push.",
    ],
    highlights: [
      "Per-item Prophet forecasts at 6h / 12h / 24h with measured MAPE",
      "Four background workers plus a separate serverless scraper",
      "Discord OAuth2 role mapping and Web Push notifications",
    ],
    stack: ["Python 3.12", "Flask", "Prophet", "Turso (libSQL)", "Azure PostgreSQL", "Azure Web Apps", "Modal", "Discord OAuth2", "Web Push", "GitHub Actions"],
    flow: [
      { label: "Modal cron", detail: "hourly scrape" },
      { label: "Turso", detail: "price history" },
      { label: "Prophet worker", detail: "6/12/24h forecast" },
      { label: "Flask app", detail: "Discord OAuth2" },
      { label: "Azure Postgres", detail: "auth, recon, comms" },
      { label: "Push alerts", detail: "war notifications" },
    ],
    snippet: {
      file: "predictor.py",
      lang: "python",
      code: `m = Prophet(
    yearly_seasonality=False,
    weekly_seasonality=True,
    daily_seasonality=True,
    changepoint_prior_scale=0.08,
)
m.fit(df[["ds", "y"]])

# Make 25 hourly periods ahead (covers up to 25h)
future = m.make_future_dataframe(periods=25, freq="h")
forecast = m.predict(future)

h6, h12, h24 = (_closest_yhat(h) for h in (6, 12, 24))`,
    },
    media: { loop: "/media/pakwarera/loop.mp4", demo: "/media/pakwarera/demo.mp4", poster: "/media/pakwarera/poster.jpg" },
    note: "Recorded on the live deployment after logging in with Discord. Shows the market tools only (order-book depth, P&L analytics, Prophet forecasts); idle waits are trimmed. Country and citizen intelligence pages are not shown because they contain other players' data.",
    links: [{ label: "Live site (Discord login required)", href: "https://pakwarera.azurewebsites.net" }],
    resumeBullets: [
      "Built and maintain a Flask platform for a live strategy game, deployed to Azure Web Apps through a GitHub Actions CI/CD pipeline.",
      "Implemented per-item price forecasting with Prophet at 6, 12 and 24-hour horizons, tracking accuracy with MAPE.",
      "Integrated Discord OAuth2 with role-based access (guest, user, admin, president), citizenship approval flows and Web Push war alerts.",
      "Runs background workers (forecasting, recon scraping, donation sync, alerts) over Azure PostgreSQL, with a serverless Modal cron scraper writing to Turso (libSQL).",
      "Hardened data collection after an API change: cursor-based pagination, retry with exponential backoff, batched upserts and a priority refresh queue, all covered by unit tests."
    ],
    featuredOnResume: true,
  },
  {
    slug: "smart-bus",
    title: "Smart Bus Islamabad",
    tagline: "Bus-stop digitisation: live ETAs, announcements and ads on pole-mounted SMD screens.",
    category: "Full-stack",
    year: "2025",
    role: "Backend lead: wrote 13 of 14 commits on the Django REST backend (raw-SQL MySQL layer, Mapbox ETA engine, bus tracking, display, ad and announcement APIs).",
    team: "Four-person NUST team · industry project assigned by InLights Solutions (NSTP)",
    summary:
      "Phase 1 of InLights' \"SmartBus Islamabad\" initiative: an admin platform that manages routes, stops, buses and pole-mounted SMD displays, computes real road-based arrival times, and drives each bus-stop screen with live ETAs, service announcements and scheduled, revenue-generating ads.",
    problem:
      "Islamabad's bus stops give commuters no real-time information, and the operator has no channel for service alerts or advertising revenue. InLights wanted a cost-effective, scalable prototype for smart displays at selected stops.",
    solution: [
      "Admins manage stops (map picker with place search), routes with drag-to-reorder stops, buses and display units from one dashboard with a live bus map.",
      "Bus GPS updates are stored as a single upserted location row per bus; ETAs to each stop come from the Mapbox Directions API (road-based, traffic-aware) instead of straight-line estimates.",
      "Each SMD display pulls its content feed: next arrivals with ETAs, announcements with severity levels, and ads scheduled per display and time window for advertisers.",
      "A GPS simulator and an SMD display simulator (1920×1080, language toggle, emergency override) let the whole system be demonstrated without hardware.",
    ],
    highlights: [
      "Real road-based ETAs via Mapbox Directions (driving-traffic profile)",
      "Ad scheduling per display and time window, plus severity-tagged announcements",
      "Raw SQL over MySQL for full control (Database Systems requirement), token auth with admin/staff roles",
    ],
    stack: ["Python", "Django 5", "Django REST Framework", "MySQL", "Mapbox", "React", "TypeScript", "Vite", "Tailwind", "TanStack Query", "i18next"],
    flow: [
      { label: "Bus GPS", detail: "location upsert" },
      { label: "Django REST API", detail: "token auth" },
      { label: "Mapbox Directions", detail: "road-based ETA" },
      { label: "MySQL", detail: "raw SQL layer" },
      { label: "Content feed", detail: "ETAs, alerts, ads" },
      { label: "SMD display", detail: "bus-stop screen" },
    ],
    snippet: {
      file: "api/mapbox.py",
      lang: "python",
      code: `# MapBox expects coordinates as longitude,latitude
coordinates = f"{origin[0]},{origin[1]};{destination[0]},{destination[1]}"
url = f"{MAPBOX_BASE_URL}/{profile}/{coordinates}"   # profile="driving-traffic"

response = requests.get(url, params=params, timeout=10)
response.raise_for_status()
data = response.json()

route = data['routes'][0]
return {
    'distance': round(route['distance']),               # meters
    'duration': round(route['duration']),               # seconds
    'duration_minutes': round(route['duration'] / 60, 1)
}`,
    },
    media: { loop: "/media/smart-bus/loop.mp4", demo: "/media/smart-bus/demo.mp4", poster: "/media/smart-bus/poster.jpg" },
    note: "Demo is trimmed from the team's project walkthrough and shown at 2× speed; the users page and third-party ad footage were cut.",
    links: [
      { label: "Backend (Smart-Bus-System)", href: "https://github.com/iPythonezta/Smart-Bus-System" },
      { label: "Frontend (SmartBusFrontend)", href: "https://github.com/iPythonezta/SmartBusFrontend" },
      { label: "Full demo on YouTube", href: "https://youtu.be/5G0bPdQLY-s" },
    ],
    resumeBullets: [
      "Led backend development (13 of 14 commits) of an industry-sponsored smart bus-stop system assigned by InLights Solutions (NSTP) to a four-person NUST team.",
      "Built a Django REST Framework API over MySQL using a hand-written raw-SQL data layer for routes, stops, buses, display units, advertisements, advertisers and announcements.",
      "Implemented road-based, traffic-aware arrival-time (ETA) calculation with the Mapbox Directions API, replacing straight-line distance estimates.",
      "Designed content feeds for pole-mounted SMD displays combining live ETAs, severity-tagged service announcements and advertisements scheduled per display and time window.",
      "Secured the API with token authentication and admin/staff roles; supported GPS and SMD display simulators for end-to-end demos without hardware."
    ],
    featuredOnResume: true,
  },
  {
    slug: "fb-lead-radar",
    title: "FB Lead Radar",
    tagline: "AI lead finder that watches Facebook groups so you don't have to.",
    category: "Automation",
    year: "2026",
    role: "Sole developer: backend, automation engine, AI filter, desktop packaging and landing page.",
    summary:
      "Monitors Facebook groups on a schedule, uses GPT-4o with user-defined screening criteria to decide which posts are real leads, and emails an alert. Ships as a local desktop app, with no subscription and no cloud.",
    problem:
      "Finding customers in busy community groups means scrolling feeds all day and missing posts.",
    solution: [
      "Campaigns bind groups, keywords, an AI screening prompt, a scan interval and scroll depth.",
      "A scheduler drives browser automation to collect posts, and an AI filter qualifies each one with a stated reason.",
      "A lead feed and email service surface qualified posts; a FastAPI backend with SQLite (WAL) stores state.",
      "Packaged with PyInstaller as a local app so it runs on the customer's own machine.",
    ],
    highlights: [
      "GPT-4o qualification with user-editable screening criteria and an explanation per lead",
      "Scheduler + campaign model with concurrency-safe SQLite",
      "One-click Windows build with a separate marketing landing page",
    ],
    stack: ["Python", "FastAPI", "SQLite", "GPT-4o", "Selenium", "Vanilla JS", "PyInstaller", "Tailwind"],
    flow: [
      { label: "Campaign", detail: "groups + criteria" },
      { label: "Scheduler", detail: "interval scans" },
      { label: "Browser automation", detail: "collect posts" },
      { label: "AI filter", detail: "GPT-4o verdict" },
      { label: "Lead feed + email", detail: "instant alerts" },
    ],
    snippet: {
      file: "campaign model (conceptual)",
      lang: "text",
      code: `Campaign
  name              "Insurance leads"
  groups[]          groups to monitor
  screening_prompt  "Is the author actively seeking ...?"
  scan_interval     60 min
  max_scrolls       3 per group
  -> Lead { post, author, reason, found_at }  ->  email alert`,
    },
    media: { loop: "/media/fb-lead-radar/loop.mp4", demo: "/media/fb-lead-radar/demo.mp4", poster: "/media/fb-lead-radar/poster.jpg" },
    note: "Demo video is trimmed to the campaign setup flow; login and live-feed segments were removed for privacy.",
    resumeBullets: [
      "Shipped a desktop lead-generation tool that monitors Facebook groups and qualifies posts as leads using GPT-4o with user-defined screening criteria.",
      "Built a FastAPI backend with SQLite (WAL mode), a campaign scheduler and Selenium-based browser automation.",
      "Delivered instant email alerts and a lead feed with the AI's reason for each match.",
      "Packaged the application as a Windows executable with PyInstaller and built its marketing landing page."
    ],
    featuredOnResume: false,
  },
  {
    slug: "acord-form-filler",
    title: "ACORD Form Filler",
    tagline: "LLMs that fill 1,171-field insurance PDFs from messy source documents.",
    category: "AI / ML",
    year: "2026",
    role: "Sole developer: extraction pipeline, LLM mapping, PDF writer and the Flask web app.",
    summary:
      "Reads a client's TXT, DOCX and PDF files, builds a profile report with GPT, then maps it onto ACORD 125/126/140 form fields and writes the filled PDF. It never invents values.",
    problem:
      "Insurance agents re-type the same client data into long fillable PDFs with over a thousand fields.",
    solution: [
      "Extracts every fillable field (id, type, page, checkbox values) and builds a compact field summary for the prompt.",
      "Fields are mapped in batches of 150 to stay within context limits; the model returns strict JSON and may only fill fields with evidence in the source.",
      "A web app adds clients, document uploads, an AI-generated client profile, a four-step fill wizard (upload, analyse, review and edit, download) and per-client history.",
      "Formatting rules are enforced in the prompt (MM/DD/YYYY dates, phone formats, checkbox values).",
    ],
    highlights: [
      "1,171 detected fields in ACORD 125/126/140, batched to fit context",
      "Review-and-edit step before download, with a 'never invent data' rule",
      "Multi-format ingestion: TXT, DOCX, PDF",
    ],
    stack: ["Python", "Flask", "OpenAI GPT", "pypdf", "pdfplumber", "python-docx", "SQLite", "Vanilla JS"],
    flow: [
      { label: "Source files", detail: "TXT / DOCX / PDF" },
      { label: "Client profile", detail: "GPT report" },
      { label: "Field extraction", detail: "1,171 fields" },
      { label: "Batch mapping", detail: "150 per call" },
      { label: "Review + edit", detail: "human in loop" },
      { label: "Filled PDF", detail: "download" },
    ],
    snippet: {
      file: "acord_filler.py",
      lang: "text",
      code: `# We chunk fields to avoid context limits - process 150 at a time
chunk_size = 150
field_chunks = [fields[i:i + chunk_size]
                for i in range(0, len(fields), chunk_size)]

INSTRUCTIONS:
- Fill ONLY the fields for which you can find relevant data.
- Skip fields if the data is not present - do NOT invent data.
- For dates, format as MM/DD/YYYY.
- Return ONLY a JSON object: {"fields": [{"field_id": ..., "value": ...}]}`,
    },
    media: { loop: "/media/acord-form-filler/loop.mp4", demo: "/media/acord-form-filler/demo.mp4", poster: "/media/acord-form-filler/poster.jpg" },
    note: "Demo shows only the client-management and wizard screens; segments containing client documents were removed.",
    resumeBullets: [
      "Built an LLM pipeline that fills ACORD 125/126/140 commercial insurance PDFs (1,171 fillable fields) from unstructured client documents.",
      "Extracted text from TXT, DOCX and PDF sources and generated an AI client profile used as the mapping context.",
      "Mapped fields in batches of 150 with strict JSON output and a rule against inventing data, followed by a human review-and-edit step before download.",
      "Delivered a Flask web application with client management, document uploads, a four-step fill wizard and per-client form history."
    ],
    featuredOnResume: false,
  },
  {
    slug: "x-automation-suite",
    title: "X Automation Suite",
    tagline: "Multi-profile scheduling, campaigns and AI replies, with live logs.",
    category: "Automation",
    year: "2026",
    role: "Sole developer across five iterations of the tool (workflow app, auto-poster, reply bots, post generator).",
    summary:
      "A dashboard-driven system that runs posting and reply campaigns across browser profiles: per-profile intervals and prompts, keyword monitoring with an AI relevance filter, and a real-time activity log.",
    problem:
      "Running consistent, on-topic social accounts by hand does not scale, and ad-hoc scripts are impossible to monitor.",
    solution: [
      "Campaigns (post / reply), keywords with custom filter criteria and reusable prompt templates are managed in a web UI.",
      "A scheduler loop checks due profiles on a short tick and runs 2-3 concurrent sessions for like/repost campaigns.",
      "Each candidate is screened by an LLM for relevance before a reply is generated; every action lands in a filterable activity log pushed over WebSockets.",
    ],
    highlights: [
      "Per-profile interval, prompt and last-post tracking",
      "AI relevance filter before any action is taken",
      "Live logs over Socket.IO; PyInstaller builds for non-technical users",
    ],
    stack: ["Python", "Flask", "Flask-SocketIO", "SQLAlchemy", "OpenAI", "Selenium", "SQLite", "PyInstaller"],
    flow: [
      { label: "Keywords + prompts", detail: "campaign config" },
      { label: "Scheduler", detail: "due-profile tick" },
      { label: "Search + collect", detail: "browser sessions" },
      { label: "LLM relevance filter", detail: "go / skip" },
      { label: "Reply / post", detail: "generated text" },
      { label: "Live activity log", detail: "WebSocket" },
    ],
    snippet: {
      file: "XAutoPBot/README.md",
      lang: "text",
      code: `- Per-profile editable posting interval and prompt
- Auto posting loop based on last_post_at + interval
- Auto posting runs every 20 seconds, posts only for due profiles
- Campaigns for Like/Repost with 2-3 concurrent profile sessions`,
    },
    media: { loop: "/media/x-automation-suite/loop.mp4", demo: "/media/x-automation-suite/demo.mp4", poster: "/media/x-automation-suite/poster.jpg" },
    note: "Demo is trimmed to the campaign, keyword and settings screens.",
    resumeBullets: [
      "Built a campaign-driven social media automation platform with per-profile posting intervals, prompts and keyword monitoring.",
      "Screened candidate posts with an LLM relevance filter before generating replies with OpenAI.",
      "Pushed a live, filterable activity log to the browser over Flask-SocketIO, backed by SQLAlchemy and SQLite.",
      "Distributed builds to non-technical users with PyInstaller."
    ],
    featuredOnResume: false,
  },
  {
    slug: "inventory-management-tool",
    title: "Inventory Management Tool",
    tagline: "A point-of-sale and stock system, refactored with SOLID and GoF patterns.",
    category: "Full-stack",
    year: "2024 – 2026",
    role: "Sole developer, then led a documented architecture refactor in 2026.",
    summary:
      "Django 5 REST backend and React 18 SPA for small shops: role-based access (cashier, manager, admin), barcode checkout, receipts, order history, stock alerts and a sales dashboard.",
    problem:
      "The first version worked but had logic mashed into views, five copies of the permission check and 20+ hard-coded API URLs. It was impossible to extend safely.",
    solution: [
      "Audited the code and recorded each defect with file and impact in a refactoring report.",
      "Moved business rules out of views into services and repositories behind interfaces (dependency inversion).",
      "Applied patterns where they earned their place: Strategy for permissions, Observer for stock alerts, Factory for reports.",
      "Unified the UI on one design system and served the React build from Django.",
    ],
    highlights: [
      "A 190-line view method decomposed into services, repositories and observers",
      "Bugs found and fixed in the audit, e.g. stock not restored on order cancel",
      "Three user roles with enforced permissions",
    ],
    stack: ["Django 5", "Django REST Framework", "React 18", "Material UI", "SQLite", "Axios"],
    flow: [
      { label: "React SPA", detail: "MUI, API layer" },
      { label: "DRF views", detail: "thin controllers" },
      { label: "Services", detail: "business rules" },
      { label: "Repositories", detail: "ORM behind interfaces" },
      { label: "Observers", detail: "stock alerts" },
    ],
    snippet: {
      file: "invenory/ (structure after refactor)",
      lang: "text",
      code: `interfaces.py     IOrderRepository, IAlertObserver, IPermissionStrategy
repositories.py   InventoryRepository, OrderRepository, AlertRepository
services.py       InventoryService, OrderService
observers.py      StockAlertObserver
strategies.py     role-based permission strategies
factories.py      ReportFactory`,
    },
    media: { loop: "/media/inventory-management-tool/loop.mp4", demo: "/media/inventory-management-tool/demo.mp4", poster: "/media/inventory-management-tool/poster.jpg" },
    note: "Recorded locally with Playwright against synthetic demo data; idle moments are sped up.",
    links: [{ label: "Source on GitHub", href: "https://github.com/iPythonezta/InventoryManagementTool" }],
    resumeBullets: [
      "Built a point-of-sale and inventory system with a Django REST Framework backend and a React frontend for small retail stores.",
      "Implemented role-based access (cashier, manager, admin), barcode checkout, printable receipts, order history, stock alerts and a sales dashboard.",
      "Audited and refactored the codebase using SOLID principles and Strategy, Observer and Factory patterns, moving business logic into services and repositories.",
      "Fixed defects found in the audit, including stock not being restored when orders were cancelled."
    ],
    featuredOnResume: false,
  },
];

// Projects with a demo video come first; case-study-only projects go to the end.
export const projects: Project[] = [...rawProjects.filter((p) => p.media), ...rawProjects.filter((p) => !p.media)];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
