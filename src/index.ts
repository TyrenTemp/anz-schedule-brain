import { FastMCP } from "fastmcp";
import { z } from "zod";
import {
  PUBLIC_HOLIDAYS_2026,
  HOLIDAY_LOOKUP,
  VALID_REGIONS,
  type Region,
  type PublicHoliday,
} from "./data/holidays.js";
import { SCHOOL_TERMS_2026, type SchoolTerm } from "./data/schoolTerms.js";

// ─────────────────────────────────────────────────────────────────────────────
// Shared validation schema
// ─────────────────────────────────────────────────────────────────────────────

const regionEnum = z
  .enum(["NZ", "VIC", "NSW", "QLD", "WA", "SA", "TAS", "NT", "ACT"])
  .describe("Region code: NZ, VIC, NSW, QLD, WA, SA, TAS, NT, or ACT");

const dateParam = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
  .describe("ISO 8601 date string (YYYY-MM-DD)");

// ─────────────────────────────────────────────────────────────────────────────
// Utility helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse a YYYY-MM-DD string into a local Date at midnight.
 * We do NOT use `new Date(str)` directly because that interprets the string
 * as UTC, causing off-by-one errors in local-timezone contexts.
 */
function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** Format a Date as YYYY-MM-DD without UTC offset drift. */
function formatDate(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/** Returns ISO day name (Monday … Sunday). */
const DAY_NAMES = [
  "Sunday", "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday",
];
function dayName(d: Date): string {
  return DAY_NAMES[d.getDay()];
}

/**
 * Returns the PublicHoliday entry if the given date is a public holiday
 * in the requested region, or null otherwise.
 */
function isPublicHoliday(dateStr: string, region: Region): PublicHoliday | null {
  return HOLIDAY_LOOKUP.get(`${dateStr}::${region}`) ?? null;
}

/** Returns true if the date is a Saturday or Sunday. */
function isWeekend(d: Date): boolean {
  const dow = d.getDay();
  return dow === 0 || dow === 6;
}

/**
 * Returns true if the date is a business day
 * (weekday that is not a public holiday in the given region).
 */
function isBusinessDay(dateStr: string, region: Region): boolean {
  const d = parseLocalDate(dateStr);
  if (isWeekend(d)) return false;
  if (isPublicHoliday(dateStr, region)) return false;
  return true;
}

/** Find which school term (if any) contains the given date. */
function findSchoolTerm(dateStr: string, region: Region): SchoolTerm | null {
  const target = parseLocalDate(dateStr).getTime();
  for (const term of SCHOOL_TERMS_2026) {
    if (term.region !== region) continue;
    const start = parseLocalDate(term.start).getTime();
    const end = parseLocalDate(term.end).getTime();
    if (target >= start && target <= end) return term;
  }
  return null;
}

/** Build the holiday list for a region, sorted chronologically. */
function holidaysForRegion(region: Region): PublicHoliday[] {
  return PUBLIC_HOLIDAYS_2026
    .filter((h) => h.region === region)
    .sort((a, b) => a.date.localeCompare(b.date));
}

// ─────────────────────────────────────────────────────────────────────────────
// Authentication
//
// When MCP_API_KEY is set, every SSE/HTTP connection must supply a matching
// x-api-key header. If the env var is absent (local stdio dev), auth is
// transparently bypassed.
//
// Designed to support:
//   - Developer licensing  (team shares a long-lived key)
//   - Nevermined proxy     (proxy injects its own key per-request)
// ─────────────────────────────────────────────────────────────────────────────

type AuthSession =
  | { authorized: true;  mode: "dev";        key: null }
  | { authorized: true;  mode: "api-key";    key: string };

function buildAuthenticator() {
  return async (request: import("http").IncomingMessage): Promise<AuthSession> => {
    const expectedKey = process.env.MCP_API_KEY?.trim();

    // No key configured → open-access / local dev mode
    if (!expectedKey) {
      return { authorized: true, mode: "dev", key: null };
    }

    const provided = (
      request.headers["x-api-key"] as string | undefined
    )?.trim();

    if (!provided || provided !== expectedKey) {
      // statusText MUST be ASCII-only per HTTP reason-phrase rules.
      // Using an em dash or any non-ASCII char here causes new Response()
      // to throw a TypeError, which breaks mcp-proxy's instanceof check.
      throw new Response(null, {
        status: 401,
        statusText: "Unauthorized - valid x-api-key header required",
      });
    }

    return { authorized: true, mode: "api-key", key: provided };
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// FastMCP server bootstrap
// ─────────────────────────────────────────────────────────────────────────────

const server = new FastMCP<AuthSession>({
  name: "anz-schedule-brain",
  version: "1.0.0",
  authenticate: buildAuthenticator(),
  instructions:
    "This is a monetized, verified ground-truth MCP for ANZ scheduling. " +
    "Supports x402 payments and x-api-key authentication. " +
    "Answers questions about 2026 public holidays and school terms for " +
    "New Zealand (NZ) and all Australian states and territories: " +
    "Victoria (VIC), New South Wales (NSW), Queensland (QLD), " +
    "Western Australia (WA), South Australia (SA), Tasmania (TAS), " +
    "Northern Territory (NT), and Australian Capital Territory (ACT). " +
    "Also calculates next business days. All data is 100% verified.",
});

// ─────────────────────────────────────────────────────────────────────────────
// Tool 1 — is_public_holiday
// ─────────────────────────────────────────────────────────────────────────────

server.addTool({
  name: "is_public_holiday",
  description:
    "Check whether a given date is a public holiday in a specified ANZ region " +
    "(NZ, VIC, NSW, QLD, WA, SA, TAS, NT, or ACT). Returns a summary string " +
    "and a structured data object with the holiday name, type (national/regional), " +
    "and a full chronological list of 2026 holidays for that region.",
  parameters: z.object({
    date: dateParam,
    region: regionEnum,
  }),
  execute: async ({ date, region }) => {
    const r = region as Region;
    const holiday = isPublicHoliday(date, r);
    const d = parseLocalDate(date);
    const dow = dayName(d);

    // ── Summary ─────────────────────────────────────────────────────────────
    const summary = holiday
      ? `${date} (${dow}) IS a public holiday in ${r}: "${holiday.name}" [${holiday.type}].`
      : `${date} (${dow}) is NOT a public holiday in ${r}.`;

    // ── Structured data ──────────────────────────────────────────────────────
    const data = {
      query: {
        date,
        day_of_week: dow,
        region: r,
      },
      result: {
        is_public_holiday: holiday !== null,
        holiday: holiday
          ? {
              name: holiday.name,
              date: holiday.date,
              type: holiday.type,
              region: holiday.region,
            }
          : null,
      },
      all_holidays_for_region: holidaysForRegion(r).map((h) => ({
        date: h.date,
        name: h.name,
        type: h.type,
      })),
    };

    return JSON.stringify({ summary, data }, null, 2);
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Tool 2 — get_school_term
// ─────────────────────────────────────────────────────────────────────────────

server.addTool({
  name: "get_school_term",
  description:
    "Determine whether a given date falls within a school term in a specified ANZ region " +
    "(NZ, VIC, NSW, QLD, WA, SA, TAS, NT, or ACT). Returns a summary string and a " +
    "structured data object with term details, week number, school days elapsed/remaining, " +
    "and the full 2026 term schedule.",
  parameters: z.object({
    date: dateParam,
    region: regionEnum,
  }),
  execute: async ({ date, region }) => {
    const r = region as Region;
    const d = parseLocalDate(date);
    const dow = dayName(d);
    const term = findSchoolTerm(date, r);
    const allTerms = SCHOOL_TERMS_2026.filter((t) => t.region === r);

    // ── Compute in-term statistics ───────────────────────────────────────────
    let weekNumber: number | null = null;
    let schoolDaysElapsed: number | null = null;
    let schoolDaysRemaining: number | null = null;

    if (term) {
      const termStart = parseLocalDate(term.start);
      const termEnd = parseLocalDate(term.end);
      const msPerDay = 86_400_000;

      const daysDiff = Math.floor((d.getTime() - termStart.getTime()) / msPerDay);
      weekNumber = Math.floor(daysDiff / 7) + 1;

      let elapsed = 0;
      const cur = new Date(termStart);
      while (cur <= d) {
        if (isBusinessDay(formatDate(cur), r)) elapsed++;
        cur.setDate(cur.getDate() + 1);
      }
      schoolDaysElapsed = elapsed;

      let remaining = 0;
      const cur2 = new Date(d);
      cur2.setDate(cur2.getDate() + 1);
      while (cur2 <= termEnd) {
        if (isBusinessDay(formatDate(cur2), r)) remaining++;
        cur2.setDate(cur2.getDate() + 1);
      }
      schoolDaysRemaining = remaining;
    }

    // ── Find nearest upcoming term if not in one ─────────────────────────────
    let nextTerm: SchoolTerm | null = null;
    if (!term) {
      const target = d.getTime();
      const upcoming = allTerms
        .filter((t) => parseLocalDate(t.start).getTime() > target)
        .sort((a, b) => a.start.localeCompare(b.start));
      nextTerm = upcoming[0] ?? null;
    }

    // ── Summary ─────────────────────────────────────────────────────────────
    let summary: string;
    if (term) {
      summary =
        `${date} (${dow}) is in ${r} ${term.label} ` +
        `(Week ${weekNumber}, ${schoolDaysRemaining} school day${schoolDaysRemaining === 1 ? "" : "s"} remaining).`;
    } else if (nextTerm) {
      const daysUntil = Math.floor(
        (parseLocalDate(nextTerm.start).getTime() - d.getTime()) / 86_400_000
      );
      summary =
        `${date} (${dow}) is in the school holiday break in ${r}. ` +
        `${nextTerm.label} starts in ${daysUntil} day${daysUntil === 1 ? "" : "s"} on ${nextTerm.start}.`;
    } else {
      summary = `${date} (${dow}) is not in a school term in ${r} and no further terms are scheduled for 2026.`;
    }

    // ── Structured data ──────────────────────────────────────────────────────
    const data = {
      query: {
        date,
        day_of_week: dow,
        region: r,
      },
      result: {
        in_school_term: term !== null,
        current_term: term
          ? {
              label: term.label,
              term_number: term.term,
              start: term.start,
              end: term.end,
              week_number_in_term: weekNumber,
              school_days_elapsed: schoolDaysElapsed,
              school_days_remaining: schoolDaysRemaining,
            }
          : null,
        next_upcoming_term: nextTerm
          ? {
              label: nextTerm.label,
              term_number: nextTerm.term,
              start: nextTerm.start,
              end: nextTerm.end,
              days_until_start: Math.floor(
                (parseLocalDate(nextTerm.start).getTime() - d.getTime()) / 86_400_000
              ),
            }
          : null,
      },
      full_term_schedule_2026: allTerms.map((t) => ({
        term: t.term,
        label: t.label,
        start: t.start,
        end: t.end,
      })),
    };

    return JSON.stringify({ summary, data }, null, 2);
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Tool 3 — get_next_business_day
// ─────────────────────────────────────────────────────────────────────────────

server.addTool({
  name: "get_next_business_day",
  description:
    "Given a date and ANZ region (NZ, VIC, NSW, QLD, WA, SA, TAS, NT, or ACT), " +
    "return the next business day (Monday–Friday, excluding public holidays). Returns " +
    "a summary string and a structured data object that reports the input date's status " +
    "and lists any holidays skipped during the search.",
  parameters: z.object({
    date: dateParam,
    region: regionEnum,
  }),
  execute: async ({ date, region }) => {
    const r = region as Region;
    const d = parseLocalDate(date);
    const dow = dayName(d);
    const inputIsBusinessDay = isBusinessDay(date, r);

    // Advance day by day from the *next* day until we land on a business day
    const cursor = new Date(d);
    cursor.setDate(cursor.getDate() + 1);

    const skippedHolidays: Array<{ date: string; name: string; reason: string }> = [];

    while (true) {
      const cursorStr = formatDate(cursor);
      const holiday = isPublicHoliday(cursorStr, r);
      if (isWeekend(cursor)) {
        // silently skip weekends
      } else if (holiday) {
        skippedHolidays.push({
          date: cursorStr,
          name: holiday.name,
          reason: "public holiday",
        });
      } else {
        break; // found next business day
      }
      cursor.setDate(cursor.getDate() + 1);
    }

    const nextBizStr = formatDate(cursor);
    const nextBizDow = dayName(cursor);
    const calendarDaysAhead = Math.floor(
      (cursor.getTime() - d.getTime()) / 86_400_000
    );

    // ── Summary ─────────────────────────────────────────────────────────────
    const skippedNote =
      skippedHolidays.length > 0
        ? ` ${skippedHolidays.length} holiday${skippedHolidays.length > 1 ? "s" : ""} skipped` +
          ` (${skippedHolidays.map((h) => h.name).join(", ")}).`
        : "";

    const summary =
      `Next business day after ${date} (${dow}) in ${r} is ` +
      `${nextBizStr} (${nextBizDow}), ${calendarDaysAhead} calendar day${calendarDaysAhead === 1 ? "" : "s"} ahead.${skippedNote}`;

    // ── Structured data ──────────────────────────────────────────────────────
    const data = {
      query: {
        date,
        day_of_week: dow,
        region: r,
      },
      input_date_status: {
        is_business_day: inputIsBusinessDay,
        is_weekend: isWeekend(d),
        is_public_holiday: isPublicHoliday(date, r) !== null,
        public_holiday_name: isPublicHoliday(date, r)?.name ?? null,
      },
      next_business_day: {
        date: nextBizStr,
        day_of_week: nextBizDow,
        calendar_days_ahead: calendarDaysAhead,
      },
      skipped_due_to: skippedHolidays,
    };

    return JSON.stringify({ summary, data }, null, 2);
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Transport — stdio (local dev) or SSE (Railway / remote)
//
//   MCP_TRANSPORT=sse  → starts an HTTP SSE server on $PORT (default 3000)
//   MCP_TRANSPORT=stdio (default) → communicates via stdin/stdout
// ─────────────────────────────────────────────────────────────────────────────

const transportType = process.env.MCP_TRANSPORT === "sse" ? "sse" : "stdio";
const port = Number(process.env.PORT) || 3000;

if (transportType === "sse") {
  server.start({
    transportType: "sse",
    sse: {
      endpoint: "/sse",
      port,
    },
  });
  console.error(
    `[anz-schedule-brain] SSE transport listening on http://0.0.0.0:${port}/sse`
  );
} else {
  server.start({ transportType: "stdio" });
}
