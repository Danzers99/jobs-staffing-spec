# Contributing

Thanks for helping make AI job recommendations more honest.

## Ways to help

- **Use it.** Publish an `OpportunityFeed`, declare the extension in your A2A agent card, or return `JobOpportunity` objects from an MCP tool. Then add yourself to [IMPLEMENTATIONS.md](IMPLEMENTATIONS.md). (A weekly adopter watch also checks the a2aregistry.org agent list and GitHub for the extension URI and opens an issue for each new find.)
- **Propose a field.** Open an issue with the *Proposal* template: the problem, the field (name, type, description), an example, and who would use it.
- **Report a problem.** Unclear wording, a schema bug, a field that doesn't fit your kind of work.

## Rules for changes

- v1 is additive only: new **optional** fields. Nothing is renamed, removed or made stricter.
- Every new field needs a description and, where it helps, an example in `examples/`.
- `python scripts/validate.py` must pass: valid examples pass, `examples/invalid/` fails.
- Breaking ideas are welcome too; they're collected for v2 (a new URI).

## What this format will not do

- Rank or advertise opportunities. It describes them; agents decide what to recommend.
- Carry applicants' personal data. `StaffingRequest` holds a business contact the person chose to share, with consent.
