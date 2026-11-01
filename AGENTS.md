# What is Day.js?

Day.js is a JavaScript date library with a Moment-compatible API. Its date objects
are immutable, and extra features go in plugins.

## Where things live

- `src/index.js` holds the factory and `Dayjs` class. Helpers and units live in
  `src/utils.js` and `src/constant.js`.
- Plugins live in `src/plugin/<name>/index.js` and load through `dayjs.extend`.
  Locales live in `src/locale/`.
- Tests go in `test/`; plugin tests use `test/plugin/<name>.test.js`.
- `types/` holds public declarations. Update them if signatures change.
  `build/` holds the Rollup/Babel scripts.

## Running it

Run these from the repo root. Start with `npm ci`; CI uses Node LTS.

```sh
npm test                      # timezone checks, then full suite + 100% line coverage
npm run lint
# For one plugin, swap in its test file
./node_modules/.bin/jest test/plugin/isLeapYear.test.js --runInBand --coverage=false
# All tests without the matrix or coverage gate
./node_modules/.bin/jest --runInBand --coverage=false
NODE_OPTIONS=--openssl-legacy-provider npm run build  # UMD + size check
npm run babel                 # ESM
node -e "console.log(require('./dayjs.min.js')('2024-02-29').format('YYYY-MM-DD'))"
```

There's no `npm start` here. If `npm test` stops early, say what ran and run the
skipped stages from `package.json` separately. Record the date, host timezone and
Node version before blaming a failure on your change; they can affect date tests.

## A few things to watch

- Match nearby ES-module code and `.eslintrc.json`. Plugin tests import from
  `../../src`, register the source plugin, and use Jest 22 `test`/`it` and `expect`.
- Use fixed dates and reset `MockDate` afterward. Check that calls leave the
  original date and any date arguments unchanged.
- Work in `src/` and `types/`. The root `plugin/`, `locale/`, `esm/`,
  `dayjs.min.js`, `index.d.ts` and `locale.json` are generated.
- Leave `package-lock.json` alone unless you're changing dependencies.
  `npm run prettier` only formats docs.
