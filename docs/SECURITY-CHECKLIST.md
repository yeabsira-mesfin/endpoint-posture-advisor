# Security review checklist

Use this checklist before sharing a modified SignalDesk deployment beyond local development.

- Confirm only synthetic data is present.
- Confirm the HTTP listener is intentionally scoped.
- Confirm write operations require authenticated, authorized identities.
- Confirm tenant/customer identifiers are enforced server-side, not only in the UI.
- Confirm secrets are provided through environment or secret-management tooling and are not committed.
- Confirm dependency and static security checks run in CI.
- Confirm logs and reports do not expose credentials or sensitive customer data.
- Confirm backup, recovery, rate limiting, TLS, and retention requirements are defined for the deployment.
