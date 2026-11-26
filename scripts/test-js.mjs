// Runs every example through the JS package: examples/ must pass, examples/invalid/ must fail.
import { readFileSync, readdirSync } from "node:fs";
import { validate, TYPES, extensionDeclaration, dataPart } from "../js/index.js";

const dir = new URL("../examples/", import.meta.url);
let failures = 0;
for (const f of readdirSync(dir).filter(f => f.endsWith(".json"))) {
    const doc = JSON.parse(readFileSync(new URL(f, dir), "utf8"));
    if (!TYPES.includes(doc.$type)) continue; // A2A wrappers are checked by validate.py
    const r = validate(doc);
    console.log(`${r.valid ? "ok      " : "INVALID "} ${f}`);
    if (!r.valid) { failures++; console.log(r.errors); }
}
for (const f of readdirSync(new URL("invalid/", dir))) {
    const r = validate(JSON.parse(readFileSync(new URL(`invalid/${f}`, dir), "utf8")));
    console.log(`${r.valid ? "ACCEPTED" : "rejected"} invalid/${f}${r.valid ? "" : ` (${r.errors[0].message})`}`);
    if (r.valid) failures++;
}
const decl = extensionDeclaration({ feed: "https://example.com/opportunities.json" });
if (decl.params.feed !== "https://example.com/opportunities.json" || dataPart({ $type: "OpportunityFeed" }).metadata.extension !== decl.uri) failures++;
console.log(failures ? `${failures} failure(s)` : "js package: all checks passed");
process.exit(failures ? 1 : 0);
