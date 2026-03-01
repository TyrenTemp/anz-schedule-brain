# ANZ Schedule Brain — MCP Server for Public Holidays & School Terms

**Stop trusting your AI to know when Western Australia Day is.**

---

## The Problem Every ANZ Developer Hits

You ask Claude, GPT-4, or Gemini: *"Is October 27 a public holiday in Melbourne?"* It confidently says yes. It's wrong.

Floating holidays — computed from rules like *"4th Monday of September"* or *"Monday nearest May 27"* — don't appear verbatim in training data. LLMs pattern-match, not compute. The error rate on edge cases (WA King's Birthday, SA Proclamation Day, NT Picnic Day) is above 40%.

**ANZ Schedule Brain** is a production-ready MCP server that gives your AI agent verified ground-truth answers for every public holiday and school term in New Zealand and all 8 Australian states and territories — 2026 data, statically verified against official government gazettes.

---

## What You Get

**3 MCP tools, 9 regions, zero hallucinations — verified 2026 data:**

### `is_public_holiday(date, region)`
Returns whether a date is a public holiday, which holiday it is, and a complete list of all holidays for that region. Handles edge cases your LLM gets wrong every time:
- WA observes King's Birthday in **September**, not June
- WA has **no Easter Saturday**
- NZ has **Matariki** (June 12, 2026); no Australian state does
- SA observes **Easter Sunday** as a public holiday; most don't

### `get_school_term(date, region)`
Returns which school term a date falls in, the week number, and school days remaining — with public holidays within the term window correctly excluded from the count.

### `get_next_business_day(date, region)`
Returns the next valid business day, skipping weekends and public holidays. Correctly handles ANZAC Day Mondayisation in NZ, Easter long weekends, and state-specific bridge days.

---

## Coverage

| Region | Holidays | Notable |
|--------|:--------:|---------|
| 🇳🇿 NZ | 11 | Matariki, Waitangi Day, Labour Day (4th Mon Oct) |
| 🟦 VIC | 13 | AFL Grand Final Friday, Melbourne Cup Day |
| 🟦 NSW | 12 | Bank Holiday (1st Mon Aug) |
| 🟦 QLD | 11 | Labour Day (1st Mon May) |
| 🟦 WA  |  9 | WA Day (1st Mon Jun), King's Birthday (4th Mon Sep) |
| 🟦 SA  | 11 | Adelaide Cup (2nd Mon May), Easter Sunday, Proclamation Day |
| 🟦 TAS | 11 | Eight Hours Day (2nd Mon Mar), Royal Hobart Regatta |
| 🟦 NT  | 11 | May Day (1st Mon May), Picnic Day (1st Mon Aug) |
| 🟦 ACT | 11 | Canberra Day (2nd Mon Mar), Reconciliation Day |

---

## What's Included

- **Full TypeScript source** — `src/index.ts`, `src/data/holidays.ts`, `src/data/schoolTerms.ts`
- **Production-ready FastMCP server** — SSE and stdio transports
- **x-api-key authentication** — lock down access in one env var
- **Railway deploy config** — `railway.toml`, `nixpacks.toml`, `.node-version`
- **`patch-package` fix included** — resolves FastMCP 1.26 + MCP SDK 1.27 compatibility, applied automatically on `npm install`
- **Discovery files** — `llms.txt` + `llms-full.txt` for agent-readable documentation
- **README sales page** — ready to share or adapt

**Live demo endpoint** (hosted, requires key):
```
https://anz-schedule-brain-production.up.railway.app/sse
```

---

## How to Install

### Option A — Use the Live Hosted Endpoint (instant)

Contact the seller for an API key, then add to Claude Desktop (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "anz-schedule-brain": {
      "url": "https://anz-schedule-brain-production.up.railway.app/sse",
      "headers": { "x-api-key": "sk-anz-YOUR_KEY" }
    }
  }
}
```

Or in Cursor (`.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "anz-schedule-brain-remote": {
      "url": "https://anz-schedule-brain-production.up.railway.app/sse",
      "headers": { "x-api-key": "sk-anz-YOUR_KEY" }
    }
  }
}
```

Restart and the three tools appear automatically.

---

### Option B — Self-Host on Railway (5 minutes)

**Prerequisites:** Node.js 20+, npm, a free Railway account.

**1. Unzip and install**
```bash
unzip anz-schedule-brain-v1.zip
cd "Holiday MCP"
npm install          # also applies the fastmcp patch automatically
npm run build
```

**2. Deploy to Railway**
```bash
npm install -g @railway/cli
railway login
railway init         # creates a new project
railway variables set MCP_TRANSPORT=sse
railway variables set MCP_API_KEY=sk-anz-$(openssl rand -hex 24)
railway up
railway domain       # generates your public URL
```

**3. Connect Claude Desktop (local stdio)**

Or run locally without Railway:
```bash
cp .env.example .env   # edit to add your MCP_API_KEY (or leave blank for open access)
npm run dev            # stdio transport, works with Claude Desktop
```

Add to Claude Desktop config:
```json
{
  "mcpServers": {
    "anz-schedule-brain": {
      "command": "node",
      "args": ["/absolute/path/to/Holiday MCP/dist/index.js"]
    }
  }
}
```

---

## Verify It Works

Run this curl against the live endpoint (replace with your key):

```bash
curl -sN --max-time 6 \
  "https://anz-schedule-brain-production.up.railway.app/sse" \
  -H "x-api-key: sk-anz-YOUR_KEY" \
  -H "Accept: text/event-stream"
```

You should receive:
```
event: endpoint
data: /messages?sessionId=<uuid>

event: message
data: {"jsonrpc":"2.0","method":"sse/connection","params":{"message":"SSE Connection established"}}
```

---

## Tech Stack

- **Runtime:** Node.js 20, TypeScript, ESM
- **Framework:** FastMCP 1.26.0 (MCP server framework)
- **Transport:** SSE (for remote) / stdio (for local Claude Desktop)
- **Data:** Static typed objects — no database, no external API calls, no latency
- **Auth:** x-api-key header middleware, compatible with x402 micropayments and Nevermined proxying
- **Deploy:** Railway (nixpacks, Node 20 pinned)

---

## License

MIT. Commercial use requires a valid API key. The hosted endpoint at `railway.app` is operated by the seller and subject to fair-use rate limits.

Questions? Open an issue at `https://github.com/TyrenTemp/anz-schedule-brain`.
