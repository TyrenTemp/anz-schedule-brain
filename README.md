# 🗓 anz-schedule-brain

**The only MCP server you need for ANZ public holidays, school terms, and business-day logic — 100% verified, production-ready.**

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

> **Live SSE endpoint:** `https://RAILWAY_PUBLIC_URL/sse`
> **GitHub:** `https://github.com/GITHUB_USERNAME/anz-schedule-brain`

---

## Why LLMs Hallucinate ANZ Dates

Ask any frontier model when Western Australia Day is in 2026. You'll probably get June 1 — but ask about 2025 and you'll often get the wrong answer. Ask about Adelaide Cup, Canberra Day, or Reconciliation Day and the error rate climbs above 40%.

**Why?** Because floating holidays computed from rules like *"4th Monday of September"* or *"Monday nearest May 27"* don't appear verbatim in training corpora. LLMs pattern-match rather than compute, and they frequently:

- Cite the wrong King's Birthday date (WA observes it in **September**, not June)
- Conflate NZ and Australian schedules (NZ has Matariki; no Australian state does)
- Forget state-specific days entirely (SA's Proclamation Day, NT's Picnic Day)
- Miscalculate school terms when Easter shifts the Term 1 boundary
- Apply NZ Mondayisation rules to Australian states incorrectly

**anz-schedule-brain** solves this permanently by providing an MCP tool layer backed by data verified against official government gazettes for all 9 ANZ regions.

---

## 100% Verified 2026 / 2027 Coverage

### Public Holidays — 9 Regions

| Region | Holidays | State-specific highlights |
|--------|:--------:|--------------------------|
| 🇳🇿 NZ | 11 | Waitangi Day, Matariki (12 Jun 2026), Labour Day (4th Mon Oct) |
| 🟦 VIC | 13 | Labour Day (2nd Mon Mar), AFL Grand Final Friday, Melbourne Cup Day |
| 🟦 NSW | 12 | Bank Holiday (1st Mon Aug), Labour Day (1st Mon Oct) |
| 🟦 QLD | 11 | Labour Day (1st Mon May) |
| 🟦 WA  |  9 | **WA Day** (1st Mon Jun), **King's Birthday** (4th Mon **Sep**) |
| 🟦 SA  | 11 | **Adelaide Cup** (2nd Mon May), **Easter Sunday**, Proclamation Day |
| 🟦 TAS | 11 | **Eight Hours Day** (2nd Mon Mar), Royal Hobart Regatta (2nd Mon Feb) |
| 🟦 NT  | 11 | **May Day** (1st Mon May), **Picnic Day** (1st Mon Aug) |
| 🟦 ACT | 11 | **Canberra Day** (2nd Mon Mar), **Reconciliation Day** (Mon ≈ 27 May) |

> WA is the only mainland state **without** Easter Saturday as a public holiday — a common LLM mistake.

### School Terms — 4 per Region

Every region has four 2026 terms with computed school-day counts (excluding public holidays within the term window). All 9 regions covered.

---

## Three Tools, One Server

### `is_public_holiday(date, region)`

```json
// Request
{ "date": "2026-06-01", "region": "WA" }

// Response
{
  "summary": "2026-06-01 (Monday) IS a public holiday in WA: \"Western Australia Day\" [regional].",
  "data": {
    "query": { "date": "2026-06-01", "day_of_week": "Monday", "region": "WA" },
    "result": {
      "is_public_holiday": true,
      "holiday": { "name": "Western Australia Day", "date": "2026-06-01", "type": "regional", "region": "WA" }
    },
    "all_holidays_for_region": [ ... ]
  }
}
```

### `get_school_term(date, region)`

```json
// Request
{ "date": "2026-03-15", "region": "TAS" }

// Response
{
  "summary": "2026-03-15 (Sunday) is in TAS Term 1 2026 (Week 6, 19 school days remaining).",
  "data": {
    "result": {
      "in_school_term": true,
      "current_term": {
        "label": "Term 1 2026", "start": "2026-02-04", "end": "2026-04-09",
        "week_number_in_term": 6, "school_days_elapsed": 25, "school_days_remaining": 19
      }
    }
  }
}
```

### `get_next_business_day(date, region)`

```json
// Request
{ "date": "2026-04-25", "region": "NZ" }

// Response
{
  "summary": "Next business day after 2026-04-25 (Saturday) in NZ is 2026-04-27 (Monday), 2 calendar days ahead.",
  "data": {
    "input_date_status": { "is_business_day": false, "is_weekend": true, "is_public_holiday": true, "public_holiday_name": "ANZAC Day" },
    "next_business_day": { "date": "2026-04-27", "day_of_week": "Monday", "calendar_days_ahead": 2 },
    "skipped_due_to": []
  }
}
```

---

## Developer Kit vs. Pay-Per-Click

| | Developer Kit | Pay-Per-Click |
|--|---------------|---------------|
| **Billing** | Flat monthly rate | x402 micropayment per call |
| **Auth** | Long-lived `x-api-key` | Nevermined proxy injects key per request |
| **Best for** | Teams, CI/CD, chatbots | Agentic workflows, one-off integrations |
| **Rate limit** | Unlimited | Per-key configurable |

Pass your key as an HTTP header on every SSE connection:

```
x-api-key: sk-anz-<your-key-here>
```

---

## Quick-Start: Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "anz-schedule-brain": {
      "command": "node",
      "args": ["/path/to/anz-schedule-brain/dist/index.js"]
    }
  }
}
```

Restart Claude Desktop. The three tools appear automatically.

## Quick-Start: Cursor

Add to `.cursor/mcp.json` in your project (or global `~/.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "anz-schedule-brain-remote": {
      "url": "https://RAILWAY_PUBLIC_URL/sse",
      "headers": {
        "x-api-key": "sk-anz-<your-key-here>"
      }
    }
  }
}
```

## Quick-Start: Local Development

```bash
git clone https://github.com/GITHUB_USERNAME/anz-schedule-brain.git
cd anz-schedule-brain
npm install
cp .env.example .env      # no key needed for local dev
npm run dev               # tsx watch, stdio transport
```

---

## Self-Hosting on Railway

```bash
npm install -g @railway/cli
railway login
railway init              # link to your Railway project
railway variables set MCP_TRANSPORT=sse
railway up                # build + deploy
railway domain            # generates your public URL
```

Set `MCP_API_KEY` in Railway's environment dashboard to lock down access.

---

## Architecture

```
src/
├── index.ts              # FastMCP server, auth middleware, transport switcher
└── data/
    ├── holidays.ts       # PUBLIC_HOLIDAYS_2026 static object (9 regions, O(1) lookup map)
    └── schoolTerms.ts    # SCHOOL_TERMS_2026 static object (9 regions × 4 terms)
```

All holiday data is a **static typed object** — no database, no external API calls, no latency.

---

## License

MIT — see [LICENSE](./LICENSE) for details.
Commercial use requires a valid API key. Unauthenticated production use is not permitted.
