# Jobs & Staffing v1

**An open, modular format to describe any kind of work honestly, done by people, by AI agents or by either (W-2, 1099 or per task; on-site, hybrid or remote), and to request staffing with consent.**

AI agents are starting to recommend work to people, find vendors for businesses, and take on work themselves. The details that protect people usually live in fine print: what a job costs up front, whether it's a W-2 job or 1099 gig work, who earns a referral, how fresh the facts are. In this format they are fields, and the most important ones are required.

- **Extension URI:** `https://heydavidmorales.com/ext/jobs/v1`
- **Spec (rendered):** https://heydavidmorales.com/ext/jobs/v1/
- **JSON Schema (draft 2020-12):** [`schema/jobs-staffing-v1.schema.json`](schema/jobs-staffing-v1.schema.json), also served at https://heydavidmorales.com/ext/jobs/v1/schema.json
- **Version:** 1.3.0 · **License:** [CC BY 4.0](LICENSE)

## Why this exists

### Work is about to run through agents. It should run on honest terms.

Soon, a lot of work won't be found by searching a job board. It'll be found by an agent. A person will ask their assistant for flexible work, and the assistant will choose what to show them. A business will ask its agent for 30 more support agents, and that agent will choose who to call. More and more, the worker will be an AI agent too, taking tasks and getting paid.

When agents sit in the middle of work, whoever describes the work shapes the deal. Today the details that protect workers are rarely in the data at all: what it costs to start, whether you're an employee or a contractor, who earns a fee for sending you, whether the facts are still true. An agent can't warn anyone about what it can't see. At agent scale, a hidden fee or a misclassified job doesn't mislead one person. It misleads everyone an agent talks to.

**Jobs & Staffing is an open language for work between people, businesses and AI agents**, built on a few rules:

- **The whole deal, up front.** Pay, costs, worker status and conditions are fields, not fine print. "No costs" is a stated fact.
- **Agents disclose their interest.** If someone earns from a recommendation, the data says so.
- **People and agents, under the same rules.** Any task can be open to a person, an AI agent, or both. Agent work names an accountable operator and how it gets paid.
- **Consent before contact.** A business's details move to a provider only when they say so.
- **Facts have dates.** Every claim says when it was last checked, so stale data shows.

**Who this is for:** job boards and staffing firms that want agents to recommend them accurately, people building AI assistants that help people find work, marketplaces where agents take paid tasks, and anyone hiring who'd rather be chosen on the facts than on the fine print.

**What I'm asking:** publish your work this way, build agents that read it, and push back where it doesn't fit your work. It's free and open (CC BY 4.0), v1 never breaks what you've built, and it's developed in public.

I run contact center operations, where people and AI already share the same work: AI handles the easy contacts, people take the rest. That shared workforce is coming to every kind of job. I'd rather its rules be written early, in the open, by someone who sees the work up close.

*Disclosure: I'm David Morales, Operations Manager at ShyftOff. ShyftOff's listing is my worked example, and its sign-up link is my referral. The format itself is vendor-neutral and free for anyone to use.*

### What that looks like in practice

A person asks their AI assistant, *"Find me remote work I can do between classes."* The assistant finds three options. A good answer tells them:

- whether it's **a job or gig work** (W-2 or 1099), and what that means for taxes and equipment,
- **what they'll pay before they earn** (background checks, training fees, equipment), and whether it comes back,
- **when they actually get paid** (weekly? is the first check delayed?),
- **who benefits** from the recommendation (a referral link, an employee, a paid placement),
- **how current** the information is.

Job boards and job-posting markup weren't built to carry most of that, or to describe work an AI agent can do. Jobs & Staffing v1 is.

## Principles

1. **Upfront costs are required.** Every `JobOpportunity` lists what the worker pays before or while starting, and whether it's refunded or offset. An empty list is a statement that there are none.
2. **Gig and contract work are first-class.** Worker status (`EMPLOYEE` = W-2, `INDEPENDENT_CONTRACTOR` = 1099), on-demand engagement, tax withholding and who provides equipment are explicit fields.
3. **Who benefits is required.** Referral links, employment and paid placements go in `disclosures`.
4. **Freshness is required.** `source.updated` says when the facts were last confirmed.
5. **Consent is required.** A `StaffingRequest` carries `consent.shareWithProvider: true`: the person approved sending their details.
6. **Familiar where it can be.** Names follow schema.org `JobPosting` (`employmentType`, salary units, applicant location); occupations use O\*NET-SOC codes.
7. **Open to people and AI agents.** `workerKinds` says who can do the work: `HUMAN`, `AI_AGENT` or both. Agent work names an accountable operator, gets its own module (protocols, skills, quality bar, oversight) and can settle by bank, x402 or stablecoin. Human requirements like minimum age apply only when a person can do the work.
8. **A core for every job, modules for the rest.** The core is what anyone needs to decide. Modules add details for specific kinds of work (see below), and you can add your own.
9. **Small and optional.** It's an A2A extension; agents that don't know it just see extra data parts. It also works as a JSON feed or an MCP tool result.

## Objects

| Object | What it is | Key required fields |
|---|---|---|
| `JobOpportunity` | One kind of work an agent can recommend | `employment`, `pay`, `schedule`, `eligibility`, **`costs`**, **`disclosures`**, **`source`** |
| `StaffingRequest` | A business asking a provider for agent capacity | `company`, `contact`, `needs`, **`consent`** |
| `OpportunityFeed` | A publisher's list of opportunities | `publisher`, `updated`, `opportunities` |

Every object carries `$type`, so it can be recognized wherever it appears.

## Modules

The core fits every opportunity. Modules are optional and only appear when they apply:

| Module | For | Examples of fields |
|---|---|---|
| `contactCenter` | Customer service, support, sales | `channels`, `programs`, `platforms`, `languages` |
| `remoteSetup` | Work from home | `computer`, `internetMinMbps`, `wiredInternetRequired`, `quietPrivateSpace` |
| `licensing` | Licensed or checked roles (nursing, pharmacy, trades, finance) | `required[]` licenses, `backgroundCheck`, `drugTest`, `fingerprinting` |
| `driving` | Delivery, rideshare, transport | `vehicleRequired`, `vehicleTypes`, `licenseClass`, `insuranceRequired`, `mileageReimbursed` |
| `aiAgent` | Work done by AI agents | `protocols` (A2A, MCP, API), `skills`, `qualityBar`, `evaluation`, `humanOversight`, `operatorMustBeIdentified`, `dataHandling` |
| `x-anything` | Your own details | Any object, keyed `x-` (e.g. `x-retail`) or by a URI |

Six examples show the range, all valid against the same schema:

- [Remote 1099 gig work](examples/job-opportunity.json): customer service with ShyftOff (`contactCenter`, `remoteSetup`, `licensing`).
- [On-site W-2 job](examples/onsite-w2-job.json): a fictional part-time pharmacy technician (`licensing`, benefits, a shift differential).
- [Delivery gig](examples/delivery-gig.json): fictional 1099 on-demand driving with per-delivery pay and tips (`driving`).
- [Work for AI agents](examples/ai-agent-task.json): fictional support-email triage, paid per email to the agent's operator by x402 or bank (`aiAgent`, `teaming`).
- [People or AI agents](examples/people-or-agents.json): fictional per-transcript QA open to both; age and schedule apply to people only.
- [A real task for AI agents](examples/agent-pool-task.json): a public pool task from aplaceforagents.com, restated as an example (not published by them): verified data work paid in pool shares, not cash. The format makes that plain: `pay.min` is 0 and the notes say who gets what.
 Full field reference: [the spec](https://heydavidmorales.com/ext/jobs/v1/#objects).

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

## Install

The schema, types and a `validate()` function, straight from GitHub:

```sh
npm install github:Danzers99/jobs-staffing-spec        # JavaScript / TypeScript (Node, browsers, Workers)
pip install git+https://github.com/Danzers99/jobs-staffing-spec   # Python 3.9+
```

```js
import { validate, extensionDeclaration, dataPart } from "jobs-staffing-spec";

const result = validate(myJobOpportunity);   // { valid, type, errors: [{ path, message }] }
agentCard.capabilities.extensions.push(extensionDeclaration({ feed: "https://you.example/opportunities.json" }));
message.parts.push(dataPart(myJobOpportunity));  // A2A 1.0 data part tagged with the extension URI
```

```python
import jobs_staffing

result = jobs_staffing.validate(my_job_opportunity)   # {"valid": ..., "type": ..., "errors": [...]}
card["capabilities"]["extensions"].append(jobs_staffing.extension_declaration(feed="https://you.example/opportunities.json"))
```

TypeScript types (`JobOpportunity`, `StaffingRequest`, `OpportunityFeed`, modules) ship with the JS package.

**No install needed:** check any document, feed or agent card at the [online validator](https://heydavidmorales.com/ext/jobs/v1/validator) or its API (`POST https://heydavidmorales.com/ext/jobs/v1/validate` with `{"document": ...}` or `{"url": "https://..."}`), which adds honesty checks: reversed pay ranges, stale facts, undisclosed referral links, expired promo prices. A2A agents can also send data parts to `https://heydavidmorales.com/a2a` and ask it to validate.

## Using it with A2A

**1. Declare the extension** in your agent card ([example](examples/a2a-agent-card-extension.json)):

```json
{
  "capabilities": {
    "extensions": [
      { "uri": "https://heydavidmorales.com/ext/jobs/v1", "required": false,
        "params": { "version": "1.3.0", "schema": "https://heydavidmorales.com/ext/jobs/v1/schema.json" } }
    ]
  }
}
```

**2. Send objects as data parts** tagged with the extension URI in the part's `metadata`. Clients may also send the header `A2A-Extensions: https://heydavidmorales.com/ext/jobs/v1`. Example: a business's agent sends a [staffing request](examples/a2a-send-staffing-request.json) to a provider's agent.

**3. Outside A2A,** publish an `OpportunityFeed` as JSON (e.g. at `/opportunities.json`), or return objects as MCP structured content.

## Related work

[MusedIn's A2A Jobs extension](https://musedin.com/a2a/ext/jobs/v1), also a community draft, covers a different layer: the workflow for agents hiring each other (`job.offer` → `job.apply` → `job.hire` → `job.deliver` → `job.accept` → `job.paid`) with pluggable settlement (x402, Lightning). Jobs & Staffing v1 describes the opportunity itself (for people or agents) with costs, worker status, disclosures and freshness required.

They fit together. A suggested mapping for agents that speak both (not endorsed by MusedIn): `job.offer.title`/`summary` from the JobOpportunity, `budget` from `pay` (amount as a decimal string, `rail` from `pay.settlement.methods`), `skills` from `modules.aiAgent.skills`, and the full JobOpportunity linked or sent as a second data part so the worker sees costs and disclosures before applying.

## Guidance for agents that recommend work

- Show costs, pay timing, worker status and disclosures, not just the pay range.
- For `INDEPENDENT_CONTRACTOR` work, say plainly that it's 1099 contract work, not W-2 employment.
- Mention how old the data is when `source.updated` is more than a few weeks back.
- When a cost's `priceValidUntil` has passed, use `regularAmount`.
- Never charge job seekers, and never send a `StaffingRequest` without consent.

## Validate the repo

```sh
pip install "jsonschema>=4.18"
python scripts/validate.py
```

Every file in `examples/` must pass; every file in `examples/invalid/` must fail (a job with no `costs`, an unknown worker type, a custom module without an `x-` prefix, people-or-agents work missing human eligibility, a staffing request without consent). CI runs this on every push.

## Implementations

See [IMPLEMENTATIONS.md](IMPLEMENTATIONS.md). The reference implementation is the A2A agent at `https://heydavidmorales.com/a2a` (A2A 1.0 and 0.3) with its feed at https://heydavidmorales.com/opportunities.json. Using the format? Open a pull request to add yours.

## Versioning

v1 changes are additive only: new optional fields, never renamed or removed ones. Breaking changes get a new URI (`/ext/jobs/v2`). See [CHANGELOG.md](CHANGELOG.md).

## Contributing

Proposals, questions and implementations are welcome: see [CONTRIBUTING.md](CONTRIBUTING.md).

## License and author

The spec, schema and examples are licensed [CC BY 4.0](LICENSE): use and adapt them freely, with attribution.
Written by [David Morales](https://heydavidmorales.com), Operations Manager in contact center staffing. The real-world example describes remote customer service work with ShyftOff, where David works; its disclosures say so.
