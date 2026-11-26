// Jobs & Staffing v1 for JavaScript and TypeScript: the schema, constants and validate().
// Works in Node, browsers, Cloudflare Workers and Deno (no eval).
import { Validator } from "@cfworker/json-schema";
import schema from "./schema.js";

export { schema };
export const EXTENSION_URI = "https://heydavidmorales.com/ext/jobs/v1";
export const SCHEMA_URL = `${EXTENSION_URI}/schema.json`;
export const TYPES = ["JobOpportunity", "StaffingRequest", "OpportunityFeed"];

const cache = new Map();
function validatorFor(type) {
    if (!cache.has(type)) {
        const root = { ...schema, $ref: `#/$defs/${type}` };
        delete root.oneOf;
        cache.set(type, new Validator(root, "2020-12", false));
    }
    return cache.get(type);
}

const WRAPPERS = new Set(["$ref", "allOf", "anyOf", "oneOf", "if", "then", "else", "properties", "items", "prefixItems", "patternProperties", "dependentSchemas", "$defs"]);

/**
 * Validate a JobOpportunity, StaffingRequest or OpportunityFeed (chosen by its $type).
 * Returns { valid, type, errors: [{ path, message }] }.
 */
export function validate(doc) {
    const type = doc && typeof doc === "object" ? doc.$type : undefined;
    if (!TYPES.includes(type)) {
        return { valid: false, type: undefined, errors: [{ path: "/$type", message: `Expected $type to be one of ${TYPES.join(", ")}.` }] };
    }
    const result = validatorFor(type).validate(doc);
    const seen = new Set();
    const errors = result.valid ? [] : result.errors
        .filter(e => !WRAPPERS.has(e.keyword) && e.error !== "False boolean schema.")
        .map(e => ({ path: e.instanceLocation.replace(/^#/, "") || "/", message: e.error.replace(/^Instance /, "Value ") }))
        .filter(e => (seen.has(e.path + e.message) ? false : (seen.add(e.path + e.message), true)));
    return { valid: errors.length === 0, type, errors };
}

/** The agent card entry that declares the extension (A2A capabilities.extensions). */
export function extensionDeclaration({ version = "1.3.0", feed } = {}) {
    return { uri: EXTENSION_URI, required: false, params: { version, schema: SCHEMA_URL, ...(feed ? { feed } : {}) } };
}

/** Wrap an object as an A2A 1.0 data part tagged with the extension URI. */
export function dataPart(obj) {
    return { data: obj, metadata: { extension: EXTENSION_URI } };
}
