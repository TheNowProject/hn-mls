# Test strategy

Date: 2026-08-13

## Automated coverage

- Domain tests cover initial status rules, permitted transitions, required reasons and field-addressable validation.
- API integration tests run against an isolated in-memory SQLite database.
- API tests cover authentication, public/internal projections, resource scope, duplicate prevention, activation, pending, closing and audit preservation.
- Backup tests copy a temporary file database and verify that the restored artifact is readable and contains the expected seeded records.
- Build and lint are required verification gates for the React client and Node server.

## Manual smoke path

1. Open Dashboard and confirm bootstrap data is loaded from the API.
2. Change the demo role and confirm navigation counts and permitted actions update.
3. Open Discovery, select a listing and inspect its allowed lifecycle actions.
4. Open the transition dialog and confirm role-specific next states and required reason fields.
5. Create a listing and confirm the API response updates the Property 360 record.
6. Inspect the activity/audit trail after each committed mutation.

## Not yet covered

- Browser-level automated end-to-end tests.
- Concurrency and load testing.
- Accessibility regression automation.
- External integration contract tests.
- Disaster-recovery exercises beyond local SQLite backup verification.
