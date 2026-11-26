// Copies the schema into the JS and Python packages so both ship it.
//   node scripts/build-packages.mjs          write the copies
//   node scripts/build-packages.mjs --check  fail if a copy is out of date (CI)
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const schema = JSON.parse(readFileSync(new URL("../schema/jobs-staffing-v1.schema.json", import.meta.url), "utf8"));
const outputs = {
    "js/schema.js": `// Generated from schema/jobs-staffing-v1.schema.json by scripts/build-packages.mjs. Do not edit.\nexport default ${JSON.stringify(schema, null, 2)};\n`,
    "python/jobs_staffing/schema.json": JSON.stringify(schema, null, 2) + "\n",
};
const check = process.argv.includes("--check");
let stale = 0;
for (const [path, text] of Object.entries(outputs)) {
    const url = new URL(`../${path}`, import.meta.url);
    if (check) {
        if (!existsSync(url) || readFileSync(url, "utf8") !== text) { console.error(`out of date: ${path} (run node scripts/build-packages.mjs)`); stale++; }
    } else {
        writeFileSync(url, text);
        console.log(`wrote ${path}`);
    }
}
process.exit(stale ? 1 : 0);
