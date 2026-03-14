---
agent: 'agent'
description: 'Run a targeted regression check for dashboard changes.'
---

Validate a proposed dashboard change for regressions:
1. Identify impacted routes, contexts, and API endpoints.
2. List required unit and E2E test updates.
3. Run lint/tests/build and summarize results.
4. Flag potential auth, CSRF, and guild-permission risks.
5. Provide a merge readiness verdict with blockers.
