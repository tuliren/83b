# Election 83(b) Generator

[![Build](https://github.com/tuliren/83b/actions/workflows/build.yaml/badge.svg)](https://github.com/tuliren/83b/actions/workflows/build.yaml)

## Development

### Dev credential

- Add dev credential from `.env.sample`
  ```
  cp .env.sample .env.local
  ```
- Update `.env.local` with credentials from the dev database

### Dev server

- Run
  ```
  corepack enable
  yarn install
  yarn dev
  ```
- Visit `localhost:3000`

### Local script

- Add a `ts` file under [`scripts`](./scripts).
- Run it with `yarn script scripts/<file> [parameters]`.
