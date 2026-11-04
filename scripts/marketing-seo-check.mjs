/**
 * Run: node --import tsx scripts/marketing-seo-check.mjs
 * Fails on duplicate marketing titles/descriptions; warns on orphan hub links.
 */
import {
  buildMarketingRouteRegistry,
  findDuplicateSeo,
  orphanRouteWarnings,
} from "../src/lib/marketing/routes.ts";

const routes = buildMarketingRouteRegistry();
const dupes = findDuplicateSeo(routes);
let failed = false;

if (dupes.length > 0) {
  failed = true;
  console.error("Duplicate SEO title or description among indexed routes:\n");
  for (const entry of dupes) {
    if ("title" in entry) {
      console.error(`  Title "${entry.title}":`);
    } else {
      console.error(`  Description "${entry.description.slice(0, 80)}…":`);
    }
    for (const p of entry.paths) console.error(`    - ${p}`);
  }
  console.error("");
}

const orphans = orphanRouteWarnings(routes);
if (orphans.length > 0) {
  console.warn("Orphan warnings (indexed paths not linked from primary nav/footer hubs):");
  for (const path of orphans) console.warn(`  - ${path}`);
  console.warn("");
}

if (failed) {
  process.exit(1);
}

const indexed = routes.filter((r) => !r.noIndex).length;
console.log(`SEO check passed (${indexed} indexed routes in registry).`);
