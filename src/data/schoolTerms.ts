/**
 * 2026 School Term dates for New Zealand and all Australian states/territories.
 *
 * All dates use ISO 8601 format (YYYY-MM-DD).
 * "start" is the first day students attend; "end" is the last day students attend.
 * Public holidays that fall within a term are handled at runtime by the tool logic.
 *
 * Primary vs Secondary school differences:
 *   NZ:  Terms 2 and 3 are FIXED (same for all school types). Term 1 start (Jan 26–Feb 9)
 *        and Term 4 end (by Dec 18) are flexible at the school level.
 *        Primary/intermediate require 378 minimum half-days; secondary require 376.
 *        Dates below reflect the MoE fixed dates for Terms 2–3 and a standard default
 *        for Terms 1 and 4. Individual schools may vary within the permitted range.
 *   AU:  All Australian states set a single state-wide term calendar that applies to
 *        both primary and secondary public schools. No formal split between levels exists.
 *        Year 12 students may finish Term 4 earlier (late Oct–early Nov) for exams,
 *        but this is not reflected as a separate term date in state calendars.
 *
 * Sources:
 *   - NZ:  https://www.education.govt.nz/school/running-a-school/term-dates/
 *   - VIC: https://www.education.vic.gov.au/school/teachers/management/pages/termhol.aspx
 *   - NSW: https://education.nsw.gov.au/public-schools/going-to-a-public-school/dates-and-terms
 *   - QLD: https://education.qld.gov.au/about-us/calendar-events/term-dates
 *   - WA:  https://www.education.wa.edu.au/term-dates
 *   - SA:  https://www.education.sa.gov.au/parents-and-families/term-dates
 *   - TAS: https://www.education.tas.gov.au/parents-carers/term-dates/
 *   - NT:  https://education.nt.gov.au/education/school-term-dates
 *   - ACT: https://www.education.act.gov.au/school-term-dates
 */

import type { Region } from "./holidays.js";

export interface SchoolTerm {
  region: Region;
  term: number;       // 1 | 2 | 3 | 4
  label: string;      // e.g. "Term 1 2026"
  start: string;      // YYYY-MM-DD (first day students attend)
  end: string;        // YYYY-MM-DD (last day students attend)
}

export const SCHOOL_TERMS_2026: SchoolTerm[] = [
  // ──────────────────────────────────────────────
  // NEW ZEALAND  (4 terms)
  // ──────────────────────────────────────────────
  { region: "NZ", term: 1, label: "Term 1 2026", start: "2026-01-29", end: "2026-04-02" },
  { region: "NZ", term: 2, label: "Term 2 2026", start: "2026-04-20", end: "2026-07-03" },
  { region: "NZ", term: 3, label: "Term 3 2026", start: "2026-07-20", end: "2026-09-25" },
  { region: "NZ", term: 4, label: "Term 4 2026", start: "2026-10-12", end: "2026-12-17" },

  // ──────────────────────────────────────────────
  // VICTORIA (VIC)  (4 terms)
  // ──────────────────────────────────────────────
  { region: "VIC", term: 1, label: "Term 1 2026", start: "2026-01-28", end: "2026-03-27" },
  { region: "VIC", term: 2, label: "Term 2 2026", start: "2026-04-14", end: "2026-06-26" },
  { region: "VIC", term: 3, label: "Term 3 2026", start: "2026-07-13", end: "2026-09-18" },
  { region: "VIC", term: 4, label: "Term 4 2026", start: "2026-10-05", end: "2026-12-18" },

  // ──────────────────────────────────────────────
  // NEW SOUTH WALES (NSW)  (4 terms)
  // ──────────────────────────────────────────────
  { region: "NSW", term: 1, label: "Term 1 2026", start: "2026-01-28", end: "2026-04-09" },
  { region: "NSW", term: 2, label: "Term 2 2026", start: "2026-04-27", end: "2026-07-03" },
  { region: "NSW", term: 3, label: "Term 3 2026", start: "2026-07-20", end: "2026-09-25" },
  { region: "NSW", term: 4, label: "Term 4 2026", start: "2026-10-12", end: "2026-12-18" },

  // ──────────────────────────────────────────────
  // QUEENSLAND (QLD)  (4 terms)
  // ──────────────────────────────────────────────
  { region: "QLD", term: 1, label: "Term 1 2026", start: "2026-01-26", end: "2026-04-01" },
  { region: "QLD", term: 2, label: "Term 2 2026", start: "2026-04-20", end: "2026-06-26" },
  { region: "QLD", term: 3, label: "Term 3 2026", start: "2026-07-13", end: "2026-09-18" },
  { region: "QLD", term: 4, label: "Term 4 2026", start: "2026-10-05", end: "2026-12-11" },

  // ──────────────────────────────────────────────
  // WESTERN AUSTRALIA (WA)  (4 terms)
  // Jan 29 = Thursday (WA traditionally opens mid-week in Week 1).
  // Easter (Apr 3 Good Friday, Apr 6 Easter Mon) falls within Term 1;
  // those days are excluded as public holidays by the tool logic.
  // ──────────────────────────────────────────────
  { region: "WA", term: 1, label: "Term 1 2026", start: "2026-01-29", end: "2026-04-09" },
  { region: "WA", term: 2, label: "Term 2 2026", start: "2026-04-28", end: "2026-07-03" },
  { region: "WA", term: 3, label: "Term 3 2026", start: "2026-07-21", end: "2026-09-25" },
  { region: "WA", term: 4, label: "Term 4 2026", start: "2026-10-13", end: "2026-12-17" },

  // ──────────────────────────────────────────────
  // SOUTH AUSTRALIA (SA)  (4 terms)
  // Jan 27 = Tuesday. Term 1 spans Easter (Apr 3–6 are PH/weekend
  // within the term window).
  // ──────────────────────────────────────────────
  { region: "SA", term: 1, label: "Term 1 2026", start: "2026-01-27", end: "2026-04-09" },
  { region: "SA", term: 2, label: "Term 2 2026", start: "2026-04-27", end: "2026-06-26" },
  { region: "SA", term: 3, label: "Term 3 2026", start: "2026-07-20", end: "2026-09-25" },
  { region: "SA", term: 4, label: "Term 4 2026", start: "2026-10-12", end: "2026-12-11" },

  // ──────────────────────────────────────────────
  // TASMANIA (TAS)  (4 terms)
  // Feb 4 = Wednesday (TAS typically opens first week of February).
  // ──────────────────────────────────────────────
  { region: "TAS", term: 1, label: "Term 1 2026", start: "2026-02-04", end: "2026-04-09" },
  { region: "TAS", term: 2, label: "Term 2 2026", start: "2026-04-27", end: "2026-07-03" },
  { region: "TAS", term: 3, label: "Term 3 2026", start: "2026-07-20", end: "2026-09-25" },
  { region: "TAS", term: 4, label: "Term 4 2026", start: "2026-10-12", end: "2026-12-18" },

  // ──────────────────────────────────────────────
  // NORTHERN TERRITORY (NT)  (4 terms)
  // Jan 27 = Tuesday. Term 1 ends Apr 2 (Thursday) before Good Friday.
  // ──────────────────────────────────────────────
  { region: "NT", term: 1, label: "Term 1 2026", start: "2026-01-27", end: "2026-04-02" },
  { region: "NT", term: 2, label: "Term 2 2026", start: "2026-04-21", end: "2026-07-03" },
  { region: "NT", term: 3, label: "Term 3 2026", start: "2026-07-21", end: "2026-09-25" },
  { region: "NT", term: 4, label: "Term 4 2026", start: "2026-10-13", end: "2026-12-11" },

  // ──────────────────────────────────────────────
  // AUSTRALIAN CAPITAL TERRITORY (ACT)  (4 terms)
  // Jan 28 = Wednesday. Easter and Reconciliation Day fall within
  // their respective terms and are handled by the tool logic.
  // ──────────────────────────────────────────────
  { region: "ACT", term: 1, label: "Term 1 2026", start: "2026-01-28", end: "2026-04-09" },
  { region: "ACT", term: 2, label: "Term 2 2026", start: "2026-04-27", end: "2026-07-03" },
  { region: "ACT", term: 3, label: "Term 3 2026", start: "2026-07-20", end: "2026-09-25" },
  { region: "ACT", term: 4, label: "Term 4 2026", start: "2026-10-12", end: "2026-12-18" },
];
