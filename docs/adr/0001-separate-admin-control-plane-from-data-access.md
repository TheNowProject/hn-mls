---
status: accepted
---

# Separate admin control plane from business-data access

Housenow MLS will introduce System Admin and Organization Admin as control-plane roles, but neither role receives blanket access to Property, Listing, CRM, finance, consent or other Restricted business data. Exceptional access uses a time-bounded Break-glass Access workflow with explicit purpose, separate approval for critical fields and immutable read audit, because platform operations must not become an invisible superuser path around MLS permissions.

## Consequences

- Administrative APIs and UI are separated from actor data projections.
- Data Steward remains a quality/identity role and is not a System Admin.
- Support and incident workflows must work from metadata by default.
- The implementation needs temporary grants, expiry enforcement, approval separation and sensitive-read audit before any real Restricted data is used.
