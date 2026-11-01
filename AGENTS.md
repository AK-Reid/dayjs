# Day.js

Day.js is an immutable JavaScript date library with a Moment-compatible API.
Keep optional features in plugins.

## Code map

- `src/index.js`: factory and `Dayjs` class; `src/utils.js` and `src/constant.js`:
  shared helpers and units.
- `src/plugin/<name>/index.js`: features registered through `dayjs.extend`.
  `src/locale/`: locale definitions.
- `test/`: Jest tests; plugin cases live in `test/plugin/<name>.test.js`.
- `types/`: public declarations; update these when signatures change.
  `build/`: editable Rollup/Babel scripts.

## Commands

Run from the root. Install with `npm ci`; CI uses Node LTS.

```sh
npm test                      # timezone matrix, then full suite + 100% line gate
npm run lint
# Focused check: substitute the relevant test file
./node_modules/.bin/jest test/plugin/isLeapYear.test.js --runInBand --coverage=false
# All tests without the matrix or coverage gate
./node_modules/.bin/jest --runInBand --coverage=false
NODE_OPTIONS=--openssl-legacy-provider npm run build  # UMD + size check
npm run babel                 # ESM
node -e "console.log(require('./dayjs.min.js')('2024-02-29').format('YYYY-MM-DD'))"
```

This is a library: no `npm start`. If `npm test` stops early, report which stages
ran and check skipped stages from `package.json` separately. Date/timezone failures
can depend on the current date, host timezone and Node version; record those
before attributing failures to your change.

## Conventions and boundaries

- Follow adjacent ES-module code and `.eslintrc.json`. Plugin tests import from
  `../../src`, register the source plugin, and use Jest 22 `test`/`it` and `expect`.
- Use fixed dates; reset `MockDate` after use. Check that receivers and supplied
  date instances remain unchanged.
- Edit `src/` and `types/`, not generated root-level `plugin/`, `locale/`, `esm/`,
  `dayjs.min.js`, `index.d.ts` or `locale.json`.
- Preserve `package-lock.json` unless changing dependencies. `npm run prettier`
  rewrites documentation, not JavaScript.
