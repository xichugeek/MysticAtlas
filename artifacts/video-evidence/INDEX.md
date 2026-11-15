# Evidence index

All assets are captured from the actual local application using synthetic inputs. No credentials, real personal themes, live provider output, stock development footage or invented terminal results.

Text captures retain actual tool messages; line endings and trailing whitespace are normalized for version control. The source snapshots under `knowledge/sources/` remain byte-exact and hash-checked.

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

## V1.1 forecasting extension

- `forecast-zh-desktop.png`, `forecast-zh-mobile.png`: actual forecasting component from the golden case, including expanded moving-line prompts. Only the unrelated sticky navigation/skip link is hidden for the component screenshot to avoid screenshot scroll overlay; forecast content is unaltered.
- `forecast-verification.txt`: actual 62-test/type/build/secret check output.
- `forecast-e2e.txt`: first real 22-test pass against the pre-existing development listener. Not production evidence.
- `forecast-e2e-production.txt`: 22-test production regression on owned listener 3002 followed by final container regression on 3003; `forecast-production.json` records V1.1 health, CSP and absence of the dev client.
- `forecast-container-build.txt`: actual Linux rebuild with the new engine and 62 tests.
- `forecast-container-smoke.json`: actual forecast API and fallback checks against isolated QA container 3003.
- `forecast-port-conflict.txt`: actual failure when attempting occupied port 3000. Expected exit code 1 was observed after the startup callback fix.
- `forecast-screenshot-check.txt`: two additional desktop/mobile capture checks after the final 22-test run; the ignored HTML report reflects this last subset, while the full 22-test production result is retained in the production text log.
- The home/result screenshots are refreshed for V1.1; baseline V1 logs remain historical. AI forecast success in API and browser tests is explicitly mocked; no live model call is claimed.
