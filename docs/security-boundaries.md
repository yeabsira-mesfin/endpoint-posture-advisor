# Security boundaries

This note complements `SECURITY.md` with the assumptions used by the SignalDesk demo.

The sample dataset is synthetic. The local HTTP server is read-only and intended for loopback use. Case updates are local files and are not an authorization system. Optional local-model drafting receives only scoped synthetic evidence and never changes case state.

Before adapting this project to a shared or production environment, add authenticated identities, tenant-scoped authorization, TLS, request throttling, durable audit storage, secret management, dependency monitoring, encrypted persistence, backup and recovery, and deployment-level network controls.
