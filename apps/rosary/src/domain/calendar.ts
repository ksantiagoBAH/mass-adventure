import { mysterySets, type MysterySet } from '../data/mysteries';
// Migrated Scriptable convention, not a complete regional liturgical calendar.
export function getEasterSunday(year: number) {
  const a = year % 19;
  const b = Math.floor(year / 100), c = year % 100;
  const d = Math.floor(b / 4), e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month, day);
}

export function getLiturgicalSeason(date: Date) {
  const year = date.getFullYear();
  const easter = getEasterSunday(year);
  const ashWednesday = new Date(easter);
  ashWednesday.setDate(easter.getDate() - 46);
  const christmas = new Date(year, 11, 25);
  const baptismOfLord = new Date(year, 0, 13);
  const advent = new Date(year, 11, 25);
  advent.setDate(advent.getDate() - (advent.getDay() + 21));

  if (date >= ashWednesday && date < easter) return "Lent";
  if (date >= advent && date < christmas) return "Advent";
  if (date >= christmas || date <= baptismOfLord) return "Christmas";
  return "Ordinary";
}

export function resolveMysteryName(param: string | null, date: Date): MysterySet {
  if (param && typeof param === "string") {
    const clean = param.trim().toLowerCase();
    for (const key of mysterySets) {
      if (key.toLowerCase() === clean) return key;
    }
  }

  const now = date || new Date();
  const day = now.getDay();
  const season = getLiturgicalSeason(now);

  if (day === 0) {
    if (season === "Lent") return "Sorrowful";
    if (season === "Advent" || season === "Christmas") return "Joyful";
    return "Glorious";
  }

  const schedule: Record<number, MysterySet> = { 1: "Joyful", 2: "Sorrowful", 3: "Glorious", 4: "Luminous", 5: "Sorrowful", 6: "Joyful" };
  return schedule[day];
}


export function rotatingIndex(date: Date) { return Math.floor(date.getHours() / 3) % 5; }
