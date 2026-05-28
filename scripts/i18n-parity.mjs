#!/usr/bin/env node
// Сравнивает ключи `messages/ru.json` и `messages/en.json` рекурсивно.
// Падает с ненулевым кодом, если есть расхождения. Запускать перед коммитом /
// в CI через `pnpm i18n:check`.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const RU = resolve(ROOT, "messages/ru.json");
const EN = resolve(ROOT, "messages/en.json");

function flatKeys(obj, prefix = "") {
  const out = new Set();
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      for (const sub of flatKeys(v, path)) out.add(sub);
    } else {
      out.add(path);
    }
  }
  return out;
}

const ru = JSON.parse(readFileSync(RU, "utf8"));
const en = JSON.parse(readFileSync(EN, "utf8"));

const ruKeys = flatKeys(ru);
const enKeys = flatKeys(en);

const onlyRu = [...ruKeys].filter((k) => !enKeys.has(k)).sort();
const onlyEn = [...enKeys].filter((k) => !ruKeys.has(k)).sort();

if (onlyRu.length === 0 && onlyEn.length === 0) {
  console.log(`✓ i18n parity OK (${ruKeys.size} ключей в каждой локали)`);
  process.exit(0);
}

if (onlyRu.length) {
  console.error(`\n❌ Есть только в ru (${onlyRu.length}):`);
  for (const k of onlyRu) console.error(`  - ${k}`);
}
if (onlyEn.length) {
  console.error(`\n❌ Есть только в en (${onlyEn.length}):`);
  for (const k of onlyEn) console.error(`  - ${k}`);
}
console.error(`\nru: ${ruKeys.size} ключей · en: ${enKeys.size} ключей`);
process.exit(1);
