// Lists gym research text with no translation in lib/gyms/i18n/{en,ja,ko}.json.
// Run after regenerating lib/gyms/data.ts from a new CSV:
//   node scripts/gym-i18n-missing.mjs
// Untranslated text still renders, in Chinese.
import { readFile } from "node:fs/promises";

const data = await readFile("lib/gyms/data.ts", "utf8");
const fields = [
  "hoursNote",
  "courses",
  "facilities",
  "booking",
  "notes",
  "source",
];
const strings = new Set();

for (const field of fields) {
  for (const m of data.matchAll(
    new RegExp(`\\b${field}:\\s*\\n?\\s*"((?:[^"\\\\]|\\\\.)*)"`, "g"),
  )) {
    strings.add(JSON.parse(`"${m[1]}"`));
  }
}

let missing = 0;

for (const lang of ["en", "ja", "ko"]) {
  const table = JSON.parse(
    await readFile(`lib/gyms/i18n/${lang}.json`, "utf8"),
  );
  const todo = [...strings].filter((s) => !(s in table));

  missing += todo.length;
  console.log(`${lang}: ${todo.length} missing`);
  for (const s of todo) console.log(`  ${JSON.stringify(s)}`);
}

process.exitCode = missing ? 1 : 0;
