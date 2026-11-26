# Changelog

All changes within v1 are additive: new optional fields only. The extension URI stays `https://heydavidmorales.com/ext/jobs/v1`.

## 1.1.0 (2026-11-26)

- Added worker status fields to `JobOpportunity.employment` so gig and contract work are explicit:
  `workerType` (`EMPLOYEE` = W-2, `INDEPENDENT_CONTRACTOR` = 1099, `TEMP_AGENCY`, `OTHER`),
  `engagement` (`ON_DEMAND`, `SCHEDULED_PART_TIME`, `FULL_TIME`, `FIXED_TERM`, `PER_TASK`),
  `taxForm`, `taxesWithheld`, `benefitsProvided`, `workerProvidesEquipment`.
- New principle and guidance: state 1099 status plainly.

## 1.0.0 (2026-11-26)

- First release: `JobOpportunity` (required `costs`, `disclosures`, `source`), `StaffingRequest` (required `consent`), `OpportunityFeed`.
- A2A extension declaration, data-part tagging via `metadata.extension`, reference implementation and feed.
