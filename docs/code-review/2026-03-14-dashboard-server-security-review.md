# Code Review: Discord Bot Dashboard (Server)
**Ready for Production**: Yes (with standard operational controls)
**Critical Issues**: 0

## Priority 1 (Must Fix) ⛔
- None remaining after applied fixes.

## Priority 2 (High) ⚠️
- **WebSocket origin trust gap** (fixed): `/ws` accepted authenticated upgrades without validating `Origin`, enabling potential cross-site websocket abuse when session cookies were present.
  - **Fix applied**: strict origin allowlist via `dashboardOrigin`, `APP_URL`, and `WS_ALLOWED_ORIGINS`.
- **Undici advisory exposure** (fixed): `undici` override pinned at vulnerable range (`^6.23.0`).
  - **Fix applied**: bumped override to `^6.24.1`, refreshed lockfile, and re-audited (`0 vulnerabilities`).

## Priority 3 (Defense-in-Depth) 🛡️
- **OAuth state comparison hardening** (fixed): replaced direct string comparison with timing-safe equality in OAuth callback.
- **WebSocket abuse controls** (fixed): added per-message max payload (`16 KiB`) and per-connection message rate limit (`80 / 10s`).

## Files Updated
- `server/src/utils/websocket.js`
- `server/src/index.js`
- `server/src/routes/auth.js`
- `server/package.json`
- `server/.env.example`

## Validation Evidence
- `npm audit --omit=dev --audit-level=moderate` (server): **found 0 vulnerabilities**
- Static diagnostics for modified files: **no errors**

## Recommended Follow-ups
- Add structured SIEM alerts for repeated `ws_origin_rejected` and `ws_rate_limit_exceeded` events.
- Consider per-user/global websocket quotas if expected concurrency grows significantly.
