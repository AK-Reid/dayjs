# Working in Day.js

Day.js is an immutable JavaScript date library with a Moment-compatible API.
Keep the core small; optional date features belong in plugins.

## Where changes belong

- `src/index.js`: factory, `Dayjs` class, parsing, manipulation, plugin registration.
  Shared units and helpers live in `src/constant.js` and `src/utils.js`.
- `src/plugin/<name>/index.js`: opt-in features installed by `dayjs.extend`.
  Plugins receive `(option, Dayjs, dayjs)` and often extend the class prototype.
- `src/locale/`: locale definitions; English is loaded by the core.
- `test/*.test.js`, `test/plugin/`, `test/locale/`, `test/issues/`: Jest tests.
  Plugin tests import from `../../src` and extend the matching source plugin.
- `types/index.d.ts`, `types/plugin/`: hand-maintained public declarations.
  Update these when changing a public signature; implementation is JavaScript.
- `build/`: Rollup/Babel scripts that generate UMD and ESM distributions.

## Commands (from the repository root)

Install locked dependencies with `npm ci`. CI uses Node LTS; the local check used
Node 24.2.0 and npm 11.6.1. There is no application server or `npm start`.

```sh
# Focused plugin check; substitute the relevant test file
./node_modules/.bin/jest test/plugin/isLeapYear.test.js --runInBand --coverage=false
# All Jest tests, without the extra timezone matrix or coverage gate
./node_modules/.bin/jest --runInBand --coverage=false
# Repository validation: timezone matrix, then full suite with 100% line coverage
npm test
# ESLint (Airbnb-based rules)
npm run lint
# UMD build plus bundle-size check; matches the release workflow's Node option
NODE_OPTIONS=--openssl-legacy-provider npm run build
# ESM build
npm run babel
# Run the built library
node -e "console.log(require('./dayjs.min.js')('2024-02-29').format('YYYY-MM-DD'))"
```

`npm run prettier` rewrites Markdown under `docs/`; it is not the JS formatter.
Timezone changes also need `npm run test-tz` and `npm run test-tz-plugin` under
the `TZ` values listed in `package.json`; `npm test` performs that matrix.

If `npm test` fails, identify the stage: its `&&` chain stops at the first
failure, so the final suite/coverage gate may never run. Use the standalone Jest
command above to check all tests separately. Record the date, host timezone and
Node version; timezone parsing uses the current offset, and some tests use the
current date. Compare failures with the unchanged baseline before fixing them.

## Conventions

- Use ES module imports, two spaces, single quotes, no trailing commas and no
  semicolons, following adjacent code and `.eslintrc.json`.
- Use Jest `test`/`it` and `expect`; this checkout uses Jest 22, so check support
  before using newer test helpers. Match the existing plugin name and test path.
- Use fixed dates for edge cases. Existing tests often compare with Moment and
  reset `MockDate` after use. Preserve instance immutability; test the original
  value as well as the result when changing date manipulation.
- Prototype methods that use `this` need ordinary functions, not arrows.
  Reuse the core's helpers/unit normalization instead of adding a second parser.

## Guardrails

- Edit `src/` and `types/`, not generated `/dayjs.min.js`, `/plugin/`, `/locale/`,
  `/esm/`, `/index.d.ts`, or `/locale.json`. `build/` itself is source, not output.
- Keep `package-lock.json` intact unless intentionally changing dependencies.
  Do not upgrade the old tooling or run automatic dependency fixes for a small
  date-library change.
- `npm run sauce` requires external Sauce Labs configuration. Local Jest checks
  do not require it. Do not invoke `.releaserc`/release workflows to verify code.
- Follow `.github/workflows/check.yml`: upstream contributions target `dev`.
