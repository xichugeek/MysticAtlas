# Evidence index

All assets are captured from the actual local application using synthetic inputs. No credentials, real personal themes, live provider output, stock development footage or invented terminal results.

- `home-zh-desktop.png`, `home-zh-mobile.png`: real browser screenshots; the mobile image is Chromium device emulation.
- `casting-desktop.png`: actual local coin-casting screen, captured using the Playwright CLI.
- `result-zh-desktop.png`, `result-zh-mobile.png`: manual `[9,7,7,7,7,7]`, primary 1 乾, transformed 44 姤, nuclear 1 乾, changing bottom line. AI explicitly disabled.
- `verification.txt`: final local format/type/test/build/secret checks (generated from actual command output).
- `e2e.txt`: actual desktop/mobile browser test output.
- `distribution.txt`: actual 100,000-cast diagnostic, not a statistical acceptance gate.
- `audit.json`: actual npm dependency audit JSON; no live credentials.
- `container-build.txt`, `container-smoke.json`, `container-restart.txt`, `container-security.json`: actual local container verification (created during final verification).
- `container-log.txt`: real startup-only service logs before teardown.
- `git-history.txt`: actual application milestone Git history, captured at `9652137` before the final evidence-only commit. `git log --oneline` shows the final commit as well.

Browser HTML report, failure traces and exported synthetic history are under ignored `output/playwright/`. Playwright CLI exploratory snapshots are ignored in `.playwright-cli/`. Large videos are ignored; no video recording or editing has been claimed.
