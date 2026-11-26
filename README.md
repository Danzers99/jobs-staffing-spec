# Jobs & Staffing v1

**An open format for AI agents to describe work honestly, from W-2 jobs to 1099 gig work, and to request staffing with consent.**

AI agents are starting to recommend work to people and to find vendors for businesses. The details that protect people usually live in fine print: what a job costs up front, whether it's a W-2 job or 1099 gig work, who earns a referral, how fresh the facts are. In this format they are fields, and the most important ones are required.

- **Extension URI:** `https://heydavidmorales.com/ext/jobs/v1`
- **Spec (rendered):** https://heydavidmorales.com/ext/jobs/v1/
- **JSON Schema (draft 2020-12):** [`schema/jobs-staffing-v1.schema.json`](schema/jobs-staffing-v1.schema.json), also served at https://heydavidmorales.com/ext/jobs/v1/schema.json
- **Version:** 1.1.0 · **License:** [CC BY 4.0](LICENSE)

## Why

A person asks their AI assistant, *"Find me remote work I can do between classes."* The assistant finds three options. A good answer tells them:

- whether it's **a job or gig work** (W-2 or 1099), and what that means for taxes and equipment,
- **what they'll pay before they earn** (background checks, training fees, equipment), and whether it comes back,
- **when they actually get paid** (weekly? is the first check delayed?),
- **who benefits** from the recommendation (a referral link, an employee, a paid placement),
- **how current** the information is.

Job boards and job-posting markup weren't built to carry most of that. Jobs & Staffing v1 is.

## Principles

1. **Upfront costs are required.** Every `JobOpportunity` lists what the worker pays before or while starting, and whether it's refunded or offset. An empty list is a statement that there are none.
2. **Gig and contract work are first-class.** Worker status (`EMPLOYEE` = W-2, `INDEPENDENT_CONTRACTOR` = 1099), on-demand engagement, tax withholding and who provides equipment are explicit fields.
3. **Who benefits is required.** Referral links, employment and paid placements go in `disclosures`.
4. **Freshness is required.** `source.updated` says when the facts were last confirmed.
5. **Consent is required.** A `StaffingRequest` carries `consent.shareWithProvider: true`: the person approved sending their details.
6. **Familiar where it can be.** Names follow schema.org `JobPosting` (`employmentType`, salary units, applicant location); occupations use O\*NET-SOC codes.
7. **Small and optional.** It's an A2A extension; agents that don't know it just see extra data parts. It also works as a JSON feed or an MCP tool result.

## Objects

| Object | What it is | Key required fields |
|---|---|---|
| `JobOpportunity` | One kind of work an agent can recommend | `employment`, `pay`, `schedule`, `eligibility`, **`costs`**, **`disclosures`**, **`source`** |
| `StaffingRequest` | A business asking a provider for agent capacity | `company`, `contact`, `needs`, **`consent`** |
| `OpportunityFeed` | A publisher's list of opportunities | `publisher`, `updated`, `opportunities` |

Every object carries `$type`, so it can be recognized wherever it appears. Full field reference: [the spec](https://heydavidmorales.com/ext/jobs/v1/#objects).

A gig worker's view of employment, from the [example](examples/job-opportunity.json):

```json
"employment": {
  "type": "CONTRACTOR",
  "workerType": "INDEPENDENT_CONTRACTOR",
  "engagement": "ON_DEMAND",
  "classification": "1099 independent contractor (gig work, not W-2 employment)",
  "taxForm": "1099",
  "taxesWithheld": false,
  "workerProvidesEquipment": true
}
```

## Using it with A2A

**1. Declare the extension** in your agent card ([example](examples/a2a-agent-card-extension.json)):

```json
{
  "capabilities": {
    "extensions": [
      { "uri": "https://heydavidmorales.com/ext/jobs/v1", "required": false,
        "params": { "version": "1.1.0", "schema": "https://heydavidmorales.com/ext/jobs/v1/schema.json" } }
    ]
  }
}
```

**2. Send objects as data parts** tagged with the extension URI in the part's `metadata`. Clients may also send the header `A2A-Extensions: https://heydavidmorales.com/ext/jobs/v1`. Example: a business's agent sends a [staffing request](examples/a2a-send-staffing-request.json) to a provider's agent.

**3. Outside A2A,** publish an `OpportunityFeed` as JSON (e.g. at `/opportunities.json`), or return objects as MCP structured content.

## Guidance for agents that recommend work

- Show costs, pay timing, worker status and disclosures, not just the pay range.
- For `INDEPENDENT_CONTRACTOR` work, say plainly that it's 1099 contract work, not W-2 employment.
- Mention how old the data is when `source.updated` is more than a few weeks back.
- When a cost's `priceValidUntil` has passed, use `regularAmount`.
- Never charge job seekers, and never send a `StaffingRequest` without consent.

## Validate

```sh
pip install "jsonschema>=4.18"
python scripts/validate.py
```

Every file in `examples/` must pass; every file in `examples/invalid/` must fail (a job with no `costs`, a staffing request without consent, an unknown worker type). CI runs this on every push.

## Implementations

See [IMPLEMENTATIONS.md](IMPLEMENTATIONS.md). The reference implementation is the A2A agent at `https://heydavidmorales.com/a2a` (A2A 1.0 and 0.3) with its feed at https://heydavidmorales.com/opportunities.json. Using the format? Open a pull request to add yours.

## Versioning

v1 changes are additive only: new optional fields, never renamed or removed ones. Breaking changes get a new URI (`/ext/jobs/v2`). See [CHANGELOG.md](CHANGELOG.md).

## Contributing

Proposals, questions and implementations are welcome: see [CONTRIBUTING.md](CONTRIBUTING.md).

## License and author

The spec, schema and examples are licensed [CC BY 4.0](LICENSE): use and adapt them freely, with attribution.
Written by [David Morales](https://heydavidmorales.com), Operations Manager in contact center staffing. The real-world example describes remote customer service work with ShyftOff, where David works; its disclosures say so.
