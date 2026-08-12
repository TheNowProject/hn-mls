# Security and current limitations

Date: 2026-08-13

## Controls implemented in the local slice

- API authentication is required for internal bootstrap and mutations.
- Role checks protect listing lifecycle transitions.
- Resource scope limits agents to their assigned listings and brokers to their brokerage.
- Public responses expose only Active inventory and remove restricted remarks and audit data.
- Listing validation is enforced by the domain layer, not only by the browser.
- Status changes and listing creation append audit events inside the same SQLite transaction.
- Request bodies are size-limited and API errors have stable codes.

## Deliberate local-development shortcuts

- Demo bearer tokens are identities, not real authentication.
- There is no password, MFA, SSO, session expiry or account recovery.
- SQLite is a single-node local database with no high-availability setup.
- CORS is configured for the local Vite origin only.
- Rate limiting, abuse detection, encryption key management and centralized observability are not implemented.
- Legal retention, consent, representation verification and dispute workflows still require owner decisions.
- Cadastral, banking, developer and distribution integrations are not connected.

## Pilot gate

Do not expose this build to real customer or restricted data. Before a pilot, replace demo authentication, complete threat/privacy review, approve data policy and lifecycle authority, add operational monitoring and recovery drills, and test every external integration in a non-production environment.
