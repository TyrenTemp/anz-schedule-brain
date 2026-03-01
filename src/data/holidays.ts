/**
 * 2026 Public Holidays for New Zealand and all Australian states/territories.
 *
 * All dates use ISO 8601 format (YYYY-MM-DD).
 * Day-of-week anchor: 1 Jan 2026 = Thursday.
 *
 * Key computed dates:
 *   Good Friday       Apr 3  (Fri)   Easter Monday    Apr 6  (Mon)
 *   ANZAC Day         Apr 25 (Sat)   → Mondayised/substituted in NZ, NSW, WA, ACT
 *   NZ observed       Apr 27 (Mon)   WA Day           Jun 1  (Mon, 1st Mon Jun)
 *   King's Birthday   Jun 8  (Mon, 2nd Mon Jun — most states)
 *   WA King's Bday    Sep 28 (Mon, 4th Mon Sep)
 *   Christmas Day     Dec 25 (Fri)   Boxing Day sub   Dec 28 (Mon)
 *
 * ANZAC Day 2026 falls on Saturday. Treatment by region:
 *   NZ:  Mondayised to Mon Apr 27 (Holidays Act 2003, as amended 2013)
 *   NSW: BOTH Apr 25 (Sat) AND Apr 27 (Mon) are public holidays (2-year trial, Feb 2026)
 *   WA:  BOTH Apr 25 (Sat) AND Apr 27 (Mon) are public holidays
 *   ACT: Transferred to Mon Apr 27 only (Apr 25 not observed as PH)
 *   VIC, QLD, SA, TAS, NT: Apr 25 only — no substitute
 *
 * Sources:
 *   - NZ:  https://www.employment.govt.nz/leave-and-holidays/public-holidays/
 *   - VIC: https://www.vic.gov.au/victorian-public-holidays-2026
 *   - NSW: https://www.nsw.gov.au/about-nsw/public-holidays
 *   - QLD: https://www.qld.gov.au/about/events-and-awards/public-holidays
 *   - WA:  https://www.wa.gov.au/service/employment/workplace-arrangements/public-holidays-western-australia
 *   - SA:  https://www.safework.sa.gov.au/resources/public-holidays
 *   - TAS: https://worksafe.tas.gov.au/topics/laws-and-compliance/public-holidays
 *   - NT:  https://nt.gov.au/employ/employee-rights-and-conditions/leave/public-holidays-in-the-nt
 *   - ACT: https://www.act.gov.au/public-holidays
 */

export interface PublicHoliday {
  date: string;       // YYYY-MM-DD
  name: string;
  region: string;     // one of the Region values below
  type: "national" | "regional";
}

export type Region = "NZ" | "VIC" | "NSW" | "QLD" | "WA" | "SA" | "TAS" | "NT" | "ACT";

export const PUBLIC_HOLIDAYS_2026: PublicHoliday[] = [
  // ──────────────────────────────────────────────
  // NEW ZEALAND
  // ──────────────────────────────────────────────
  { date: "2026-01-01", name: "New Year's Day",               region: "NZ", type: "national" },
  { date: "2026-01-02", name: "Day after New Year's Day",     region: "NZ", type: "national" },
  { date: "2026-02-06", name: "Waitangi Day",                 region: "NZ", type: "national" },
  { date: "2026-04-03", name: "Good Friday",                  region: "NZ", type: "national" },
  { date: "2026-04-06", name: "Easter Monday",                region: "NZ", type: "national" },
  { date: "2026-04-27", name: "ANZAC Day (observed)",          region: "NZ", type: "national" },
  { date: "2026-06-01", name: "King's Birthday",              region: "NZ", type: "national" },
  { date: "2026-06-12", name: "Matariki",                     region: "NZ", type: "national" },
  { date: "2026-10-26", name: "Labour Day",                   region: "NZ", type: "national" },
  { date: "2026-12-25", name: "Christmas Day",                region: "NZ", type: "national" },
  { date: "2026-12-28", name: "Boxing Day (observed)",        region: "NZ", type: "national" },

  // ──────────────────────────────────────────────
  // VICTORIA (VIC)
  // ──────────────────────────────────────────────
  { date: "2026-01-01", name: "New Year's Day",               region: "VIC", type: "national" },
  { date: "2026-01-26", name: "Australia Day",                region: "VIC", type: "national" },
  { date: "2026-03-09", name: "Labour Day",                   region: "VIC", type: "regional" },
  { date: "2026-04-03", name: "Good Friday",                  region: "VIC", type: "national" },
  { date: "2026-04-04", name: "Easter Saturday",              region: "VIC", type: "regional" },
  { date: "2026-04-05", name: "Easter Sunday",                region: "VIC", type: "regional" },
  { date: "2026-04-06", name: "Easter Monday",                region: "VIC", type: "national" },
  { date: "2026-04-25", name: "ANZAC Day",                    region: "VIC", type: "national" },
  { date: "2026-06-08", name: "King's Birthday",              region: "VIC", type: "regional" },
  { date: "2026-09-25", name: "Friday before AFL Grand Final",region: "VIC", type: "regional" },
  { date: "2026-11-03", name: "Melbourne Cup Day",            region: "VIC", type: "regional" },
  { date: "2026-12-25", name: "Christmas Day",                region: "VIC", type: "national" },
  { date: "2026-12-28", name: "Boxing Day (observed)",        region: "VIC", type: "national" },

  // ──────────────────────────────────────────────
  // NEW SOUTH WALES (NSW)
  // ──────────────────────────────────────────────
  { date: "2026-01-01", name: "New Year's Day",               region: "NSW", type: "national" },
  { date: "2026-01-26", name: "Australia Day",                region: "NSW", type: "national" },
  { date: "2026-04-03", name: "Good Friday",                  region: "NSW", type: "national" },
  { date: "2026-04-04", name: "Easter Saturday",              region: "NSW", type: "regional" },
  { date: "2026-04-05", name: "Easter Sunday",                region: "NSW", type: "regional" },
  { date: "2026-04-06", name: "Easter Monday",                region: "NSW", type: "national" },
  { date: "2026-04-25", name: "ANZAC Day",                    region: "NSW", type: "national" },
  { date: "2026-04-27", name: "ANZAC Day (substitute)",       region: "NSW", type: "national" },
  { date: "2026-06-08", name: "King's Birthday",              region: "NSW", type: "regional" },
  { date: "2026-08-03", name: "Bank Holiday",                 region: "NSW", type: "regional" },
  { date: "2026-10-05", name: "Labour Day",                   region: "NSW", type: "regional" },
  { date: "2026-12-25", name: "Christmas Day",                region: "NSW", type: "national" },
  { date: "2026-12-28", name: "Boxing Day (observed)",        region: "NSW", type: "national" },

  // ──────────────────────────────────────────────
  // QUEENSLAND (QLD)
  // ──────────────────────────────────────────────
  { date: "2026-01-01", name: "New Year's Day",               region: "QLD", type: "national" },
  { date: "2026-01-26", name: "Australia Day",                region: "QLD", type: "national" },
  { date: "2026-04-03", name: "Good Friday",                  region: "QLD", type: "national" },
  { date: "2026-04-04", name: "Easter Saturday",              region: "QLD", type: "regional" },
  { date: "2026-04-06", name: "Easter Monday",                region: "QLD", type: "national" },
  { date: "2026-04-25", name: "ANZAC Day",                    region: "QLD", type: "national" },
  { date: "2026-05-04", name: "Labour Day",                   region: "QLD", type: "regional" },
  { date: "2026-06-08", name: "King's Birthday",              region: "QLD", type: "regional" },
  { date: "2026-12-25", name: "Christmas Day",                region: "QLD", type: "national" },
  { date: "2026-12-26", name: "Boxing Day",                   region: "QLD", type: "national" },
  { date: "2026-12-28", name: "Boxing Day (observed)",        region: "QLD", type: "national" },

  // ──────────────────────────────────────────────
  // WESTERN AUSTRALIA (WA)
  //
  // Easter Saturday is NOT a public holiday in WA.
  // King's Birthday: 4th Monday of September → Sep 28.
  // Western Australia Day: 1st Monday of June → Jun 1.
  // Boxing Day falls Sat Dec 26 → substitute Mon Dec 28.
  // ──────────────────────────────────────────────
  { date: "2026-01-01", name: "New Year's Day",               region: "WA", type: "national" },
  { date: "2026-01-26", name: "Australia Day",                region: "WA", type: "national" },
  { date: "2026-04-03", name: "Good Friday",                  region: "WA", type: "national" },
  { date: "2026-04-06", name: "Easter Monday",                region: "WA", type: "national" },
  { date: "2026-04-25", name: "ANZAC Day",                    region: "WA", type: "national" },
  { date: "2026-04-27", name: "ANZAC Day (substitute)",       region: "WA", type: "national" },
  { date: "2026-06-01", name: "Western Australia Day",        region: "WA", type: "regional" },
  { date: "2026-09-28", name: "King's Birthday",              region: "WA", type: "regional" },
  { date: "2026-12-25", name: "Christmas Day",                region: "WA", type: "national" },
  { date: "2026-12-28", name: "Boxing Day (observed)",        region: "WA", type: "national" },

  // ──────────────────────────────────────────────
  // SOUTH AUSTRALIA (SA)
  //
  // SA is one of few jurisdictions observing Easter Sunday as a PH.
  // Adelaide Cup Race Day: 2nd Monday of May → May 11.
  // King's Birthday: 2nd Monday of June → Jun 8.
  // Proclamation Day: Dec 26 (Sat) → substitute Mon Dec 28.
  // ──────────────────────────────────────────────
  { date: "2026-01-01", name: "New Year's Day",               region: "SA", type: "national" },
  { date: "2026-01-26", name: "Australia Day",                region: "SA", type: "national" },
  { date: "2026-04-03", name: "Good Friday",                  region: "SA", type: "national" },
  { date: "2026-04-04", name: "Easter Saturday",              region: "SA", type: "regional" },
  { date: "2026-04-05", name: "Easter Sunday",                region: "SA", type: "regional" },
  { date: "2026-04-06", name: "Easter Monday",                region: "SA", type: "national" },
  { date: "2026-04-25", name: "ANZAC Day",                    region: "SA", type: "national" },
  { date: "2026-05-11", name: "Adelaide Cup Race Day",        region: "SA", type: "regional" },
  { date: "2026-06-08", name: "King's Birthday",              region: "SA", type: "regional" },
  { date: "2026-12-25", name: "Christmas Day",                region: "SA", type: "national" },
  { date: "2026-12-28", name: "Proclamation Day (observed)",  region: "SA", type: "regional" },

  // ──────────────────────────────────────────────
  // TASMANIA (TAS)
  //
  // Eight Hours Day (Labour Day): 2nd Monday of March → Mar 9.
  // Royal Hobart Regatta: 2nd Monday of February → Feb 9
  //   (observed in southern Tasmania / greater Hobart area; marked regional).
  // King's Birthday: 2nd Monday of June → Jun 8.
  // Boxing Day falls Sat Dec 26 → substitute Mon Dec 28.
  // ──────────────────────────────────────────────
  { date: "2026-01-01", name: "New Year's Day",               region: "TAS", type: "national" },
  { date: "2026-01-26", name: "Australia Day",                region: "TAS", type: "national" },
  { date: "2026-02-09", name: "Royal Hobart Regatta",         region: "TAS", type: "regional" },
  { date: "2026-03-09", name: "Eight Hours Day",              region: "TAS", type: "regional" },
  { date: "2026-04-03", name: "Good Friday",                  region: "TAS", type: "national" },
  { date: "2026-04-04", name: "Easter Saturday",              region: "TAS", type: "regional" },
  { date: "2026-04-06", name: "Easter Monday",                region: "TAS", type: "national" },
  { date: "2026-04-25", name: "ANZAC Day",                    region: "TAS", type: "national" },
  { date: "2026-06-08", name: "King's Birthday",              region: "TAS", type: "regional" },
  { date: "2026-12-25", name: "Christmas Day",                region: "TAS", type: "national" },
  { date: "2026-12-28", name: "Boxing Day (observed)",        region: "TAS", type: "national" },

  // ──────────────────────────────────────────────
  // NORTHERN TERRITORY (NT)
  //
  // May Day: 1st Monday of May → May 4.
  // King's Birthday: 2nd Monday of June → Jun 8.
  // Picnic Day: 1st Monday of August → Aug 3.
  // Boxing Day falls Sat Dec 26 → substitute Mon Dec 28.
  // ──────────────────────────────────────────────
  { date: "2026-01-01", name: "New Year's Day",               region: "NT", type: "national" },
  { date: "2026-01-26", name: "Australia Day",                region: "NT", type: "national" },
  { date: "2026-04-03", name: "Good Friday",                  region: "NT", type: "national" },
  { date: "2026-04-04", name: "Easter Saturday",              region: "NT", type: "regional" },
  { date: "2026-04-06", name: "Easter Monday",                region: "NT", type: "national" },
  { date: "2026-04-25", name: "ANZAC Day",                    region: "NT", type: "national" },
  { date: "2026-05-04", name: "May Day",                      region: "NT", type: "regional" },
  { date: "2026-06-08", name: "King's Birthday",              region: "NT", type: "regional" },
  { date: "2026-08-03", name: "Picnic Day",                   region: "NT", type: "regional" },
  { date: "2026-12-25", name: "Christmas Day",                region: "NT", type: "national" },
  { date: "2026-12-28", name: "Boxing Day (observed)",        region: "NT", type: "national" },

  // ──────────────────────────────────────────────
  // AUSTRALIAN CAPITAL TERRITORY (ACT)
  //
  // Canberra Day: 2nd Monday of March → Mar 9.
  // Reconciliation Day (replaced Family & Community Day in 2018):
  //   Monday on/nearest to May 27 → May 25 (Mon).
  // King's Birthday: 2nd Monday of June → Jun 8.
  // Boxing Day falls Sat Dec 26 → substitute Mon Dec 28.
  // ──────────────────────────────────────────────
  { date: "2026-01-01", name: "New Year's Day",               region: "ACT", type: "national" },
  { date: "2026-01-26", name: "Australia Day",                region: "ACT", type: "national" },
  { date: "2026-03-09", name: "Canberra Day",                 region: "ACT", type: "regional" },
  { date: "2026-04-03", name: "Good Friday",                  region: "ACT", type: "national" },
  { date: "2026-04-04", name: "Easter Saturday",              region: "ACT", type: "regional" },
  { date: "2026-04-06", name: "Easter Monday",                region: "ACT", type: "national" },
  { date: "2026-04-27", name: "ANZAC Day (substitute)",        region: "ACT", type: "national" },
  { date: "2026-05-25", name: "Reconciliation Day",           region: "ACT", type: "regional" },
  { date: "2026-06-08", name: "King's Birthday",              region: "ACT", type: "regional" },
  { date: "2026-12-25", name: "Christmas Day",                region: "ACT", type: "national" },
  { date: "2026-12-28", name: "Boxing Day (observed)",        region: "ACT", type: "national" },
];

/**
 * Returns an indexed lookup map for O(1) holiday checking.
 * Key format: "YYYY-MM-DD::REGION"
 */
export const HOLIDAY_LOOKUP: Map<string, PublicHoliday> = new Map(
  PUBLIC_HOLIDAYS_2026.map((h) => [`${h.date}::${h.region}`, h])
);

export const VALID_REGIONS: Region[] = ["NZ", "VIC", "NSW", "QLD", "WA", "SA", "TAS", "NT", "ACT"];
