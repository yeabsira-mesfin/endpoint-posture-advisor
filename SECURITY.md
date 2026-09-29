# Security Policy

SignalDesk is a local portfolio and learning lab that uses synthetic endpoint and detection data. It is not a production security service and does not connect to CrowdStrike Falcon, GovCloud, customer tenants, or live EDR infrastructure.

## Safe-use boundaries

- Run the web dashboard on loopback only unless you add production-grade authentication, TLS, authorization, rate limits, and deployment hardening.
- Use synthetic or intentionally non-sensitive data. Do not import customer telemetry, credentials, access tokens, API keys, or regulated data.
- Treat generated remediation guidance and optional AI-assisted drafts as analyst-support output that requires human review.
- Do not interpret project-defined posture checks or framework labels as an official compliance assessment.

## What to report

Useful security reports include tenant-isolation failures, unsafe file or network access, stored or reflected injection, authorization bypasses, sensitive-data exposure, dependency issues with a practical impact on this project, or behavior that violates the boundaries documented above.

## Reporting safely

For non-sensitive findings, open a GitHub issue with reproduction steps, expected behavior, affected component, and a minimal synthetic test case. Do not include secrets, real customer data, or exploit material that would put another system at risk.

If a report would require sharing sensitive information, do not post that information publicly. Instead, first open a minimal issue stating that a private security report is needed, without including the sensitive details.

## Supported version

Security fixes are applied to the latest code on `main`. Older commits and local modifications are not separately supported.
