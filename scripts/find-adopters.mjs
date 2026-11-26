// Adopter watch: looks for agents and repositories that use Jobs & Staffing v1, so they
// can be added to IMPLEMENTATIONS.md (after a person checks them).
//
//   node scripts/find-adopters.mjs            prints a JSON report
//   node scripts/find-adopters.mjs --issues   also opens one GitHub issue per new find
//                                             (needs GITHUB_TOKEN and GITHUB_REPOSITORY)
//
// Sources: the a2aregistry.org agent list (agent cards that declare the extension URI,
// or any other jobs extension, reported as related work) and GitHub code search for the
// extension URI (best effort: it needs a token and may be rate limited). A declared feed
// is fetched and checked with this package's validate().
import { readFileSync } from "node:fs";
import { EXTENSION_URI, validate } from "../js/index.js";

const SELF = ["heydavidmorales.com", "github.com/Danzers99/jobs-staffing-spec"];
const UA = { "User-Agent": "jobs-staffing-spec adopter watch (+https://github.com/Danzers99/jobs-staffing-spec)" };
const token = process.env.GITHUB_TOKEN;
const repo = process.env.GITHUB_REPOSITORY;

async function getJson(url, headers = {}) {
    const res = await fetch(url, { headers: { Accept: "application/json", ...UA, ...headers }, signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`${url} returned ${res.status}`);
    return res.json();
}

async function registryAgents() {
    const all = [];
    for (let offset = 0; offset < 5000; offset += 100) {
        const page = await getJson(`https://a2aregistry.org/api/agents?limit=100&offset=${offset}`);
        all.push(...(page.agents ?? []));
        if (!page.agents?.length || all.length >= (page.total ?? 0)) break;
    }
    return all;
}

const isSelf = s => SELF.some(x => String(s ?? "").includes(x));

async function checkFeed(url) {
    if (!url) return undefined;
    try {
        const r = validate(await getJson(url));
        return { url, valid: r.valid, errors: r.errors?.length ?? 0 };
    } catch (e) {
        return { url, valid: false, error: e.message };
    }
}

async function fromRegistry() {
    const adopters = [];
    const related = [];
    for (const a of await registryAgents()) {
        const where = a.wellKnownURI ?? a.url;
        if (isSelf(where)) continue;
        const exts = a.capabilities?.extensions ?? [];
        const ours = exts.find(e => e?.uri === EXTENSION_URI) ?? (JSON.stringify(a).includes(EXTENSION_URI) ? {} : undefined);
        if (ours) adopters.push({ source: "a2aregistry.org", name: a.name, where, feed: await checkFeed(ours.params?.feed) });
        else for (const e of exts) if (/\bjobs?\b|staffing|hiring|recruit/i.test(e?.uri ?? "")) related.push({ source: "a2aregistry.org", name: a.name, where, extension: e.uri });
    }
    return { adopters, related };
}

async function fromGitHub() {
    if (!token) return { skipped: "no GITHUB_TOKEN" };
    try {
        const q = encodeURIComponent(`"${EXTENSION_URI.replace("https://", "")}"`);
        const res = await getJson(`https://api.github.com/search/code?q=${q}&per_page=100`, { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" });
        const repos = new Map();
        for (const item of res.items ?? []) {
            const full = item.repository?.full_name;
            if (!full || isSelf(`github.com/${full}`) || full.toLowerCase() === "danzers99/davidmorales") continue;
            repos.set(full, { source: "GitHub code search", name: full, where: item.repository.html_url, file: item.path });
        }
        return { adopters: [...repos.values()] };
    } catch (e) {
        return { skipped: e.message };
    }
}

const known = readFileSync(new URL("../IMPLEMENTATIONS.md", import.meta.url), "utf8");
const isKnown = f => { try { return known.includes(new URL(f.where).hostname === "github.com" ? f.name : new URL(f.where).hostname); } catch { return known.includes(f.name); } };

const registry = await fromRegistry().catch(e => ({ adopters: [], related: [], error: e.message }));
const github = await fromGitHub();
const found = [...registry.adopters, ...(github.adopters ?? [])];
const report = {
    checked: new Date().toISOString(),
    new: found.filter(f => !isKnown(f)),
    alreadyListed: found.filter(isKnown).map(f => f.name),
    related: registry.related,
    notes: [registry.error && `Registry: ${registry.error}`, github.skipped && `GitHub search skipped: ${github.skipped}`].filter(Boolean),
};
console.log(JSON.stringify(report, null, 2));

if (process.argv.includes("--issues") && token && repo) {
    const api = (path, init = {}) => fetch(`https://api.github.com/repos/${repo}${path}`, { ...init, headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "Content-Type": "application/json", ...UA } });
    // The label (created once; 422 means it already exists).
    await api("/labels", { method: "POST", body: JSON.stringify({ name: "adopter-watch", color: "0e8a16", description: "Possible implementation found by the weekly adopter watch" }) });
    const open = await (await api("/issues?state=all&labels=adopter-watch&per_page=100")).json();
    const titles = new Set((Array.isArray(open) ? open : []).map(i => i.title));
    for (const f of report.new) {
        const title = `Possible adopter: ${f.name}`;
        if (titles.has(title)) continue;
        const body = [
            `The weekly adopter watch found a possible Jobs & Staffing v1 implementation.`,
            "",
            `- **Name:** ${f.name}`,
            `- **Where:** ${f.where}${f.file ? ` (\`${f.file}\`)` : ""}`,
            `- **Found via:** ${f.source}`,
            f.feed ? `- **Feed:** ${f.feed.url}: ${f.feed.valid ? "valid" : `not valid (${f.feed.error ?? `${f.feed.errors} errors`})`}` : "",
            "",
            "If it's real, add a row to IMPLEMENTATIONS.md and close this issue. If not, close it as not planned.",
        ].filter(s => s !== "").join("\n");
        const res = await api("/issues", { method: "POST", body: JSON.stringify({ title, body, labels: ["adopter-watch"] }) });
        console.log(`${res.ok ? "Opened" : `Couldn't open (${res.status})`}: ${title}`);
    }
}
