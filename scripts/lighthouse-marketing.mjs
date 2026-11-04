import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const base = process.env.LH_BASE || "http://localhost:3000";
const pages = [
  ["home", "/"],
  ["feature", "/features/field-capture-app"],
  ["pricing", "/pricing"],
  ["municipality", "/municipalities/ethekwini"],
  ["blog", "/blog/how-to-run-water-meter-installation-programme"],
];

mkdirSync(".tmp-lh", { recursive: true });
const summary = [];

for (const [name, path] of pages) {
  const out = join(".tmp-lh", `${name}.json`);
  console.log("Auditing", path);
  const result = spawnSync(
    "npx",
    [
      "--yes",
      "lighthouse@12.2.1",
      `${base}${path}`,
      "--only-categories=performance,accessibility,best-practices,seo",
      "--form-factor=mobile",
      "--screenEmulation.mobile",
      "--quiet",
      "--chrome-flags=--headless --no-sandbox --disable-gpu",
      "--output=json",
      `--output-path=${out}`,
    ],
    { stdio: "inherit", shell: true },
  );
  if (result.status !== 0) {
    summary.push({ name, path, error: `exit ${result.status}` });
    continue;
  }
  const report = JSON.parse(readFileSync(out, "utf8"));
  const scores = Object.fromEntries(
    Object.entries(report.categories || {}).map(([key, value]) => [key, Math.round((value.score || 0) * 100)]),
  );
  summary.push({ name, path, scores });
  console.log(name, scores);
}

writeFileSync(".tmp-lh/summary.json", JSON.stringify(summary, null, 2));
console.log("\nSUMMARY");
console.log(JSON.stringify(summary, null, 2));
