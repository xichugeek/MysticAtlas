# Production preparation and rollback

Target only: `https://mysticatlas.demo.xichugeek.com` (proposed, **not deployed**). Repository remote was reachable with no advertised refs at inspection. No public push, remote repository creation, SSH, DNS, TLS or Forge changes have been performed.

## Local validation

```sh
npm ci
npm run check
npx playwright install chromium
npm run test:e2e
npm run start
# separate terminal
node scripts/smoke.mjs http://127.0.0.1:3000
```

The local build is `dist/`; start serves production assets. `npm run dev` serves development and HMR at the same default port. Stop any process using that port before starting Compose, or set `MYSTICATLAS_PORT` in your ignored `.env`.

```sh
docker compose config --quiet
docker compose build
docker compose up -d --wait
node scripts/smoke.mjs http://127.0.0.1:3000
docker compose restart app
docker compose up -d --wait
docker compose logs --tail=30 app
docker compose down
```

Compose uses the isolated project name `mysticatlas`, loopback port 3000, app-only network, no volumes, 0.5 CPU / 256 MiB / 64 PIDs, non-root UID, no capabilities and read-only filesystem. Desktop resource usage does not prove CloudCone capacity; inspect real free memory and other workloads first. AI is off. If enabling AI, use a reviewed provider HTTPS URL and key in a private `.env`; never paste secrets into a commit, public demo, URL or captured terminal.

## Before production — actual inspection required

Approval scope must identify the exact independent service and domain. First read the real Forge documentation/API/router/gateway configuration, version and deployment conventions. Obtain the operator's approved access method without exposing credentials. Inspect current container names, networks, ports, free disk/RAM, routing, health/start/stop endpoints and access controls. Do not infer Controller or Caddy syntax. Save relevant config backups with restrictive permissions before changing them. Do not replace a shared gateway configuration or restart unrelated containers.

Then prepare a project-specific reviewed deployment diff covering:

- image tag/digest and source commit; copy only the MysticAtlas app artifact;
- a dedicated directory, Compose project and service; choose an unused loopback port or a separately authorized network route;
- reverse proxy route for the proposed domain, HTTPS certificate issuance/renewal, same-origin `PUBLIC_ORIGIN`, and a verified single trusted proxy if enabling `TRUST_PROXY`;
- health path `/api/health`, startup/stop command mapping and AI policy; no topic/body/authorization logging;
- restart policy versus any Forge sleep mechanism. **30-minute sleep and zero-click wake are unverified**, so no wake endpoint or controller schema is supplied as fact;
- verified resource budget and provider spending cap if AI is enabled.

## Release commands to adapt after review

These are app-local commands, not claimed to be tested Forge instructions. Use an immutable release tag after source review; do not overwrite the previous image.

```sh
# In the dedicated release checkout on the approved host
docker build -t mysticatlas:<NEW_COMMIT> .
# Edit a reviewed app-only Compose override to that immutable image.
docker compose -p mysticatlas -f compose.yaml -f compose.production.yaml config --quiet
docker compose -p mysticatlas -f compose.yaml -f compose.production.yaml up -d --wait
```

Do not run the placeholders literally. A proposed reverse-proxy/TLS diff must be generated from actual host configuration. No SSH host, API path, secret or network name is guessed here.

## Rollback

Before release, record the prior image digest and back up the exact app-only routing/Compose files. Trigger rollback if health fails, 5xx increases, the UI/API fails smoke checks, privacy changes unexpectedly or the service exceeds the approved resource budget. In the app-only override, restore `image: mysticatlas:<PREVIOUS_COMMIT>` and the backed-up route, then run:

```sh
docker compose -p mysticatlas -f compose.yaml -f compose.production.yaml up -d --no-build --wait
```

Verify HTTPS, health, 64 records, `[9,7,7,7,7,7] → 1/44/1`, AI policy and mobile flow. Never run `docker system prune`, delete shared volumes, overwrite a shared gateway, or use broad container stop/remove commands. There is no MysticAtlas server database migration to roll back.

## Online gate (all currently NOT EXECUTED)

- Approved source push and CI run on GitHub.
- Real host resource and access review; configuration/data backup evidence.
- Domain ownership, DNS, TLS and certificate renewal.
- Public homepage, all APIs, mobile viewport, cache/CSP/origin policy.
- AI disabled or a reviewed constrained real provider integration.
- Forge health/start/stop, actual sleep/wake behavior and rollback rehearsal.
