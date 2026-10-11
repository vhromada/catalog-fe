---
description: Update npm dependencies (Vue, vite, TypeScript, ESLint, libraries) to their latest stable versions
allowed-tools: Read, Edit, Grep, Glob, WebSearch, WebFetch, mcp__context7__resolve-library-id, mcp__context7__query-docs, Bash(npm outdated:*), Bash(npm install:*), Bash(npm run:*), Bash(git diff:*), Bash(git status:*)
---

Update the dependencies of Catalog FE to their latest stable versions. The command has no arguments — look up all versions yourself.
Do not change the application version (`"version"` in `package.json`); that is done by `/update-version`.

## 1. Read the current state

Read `dependencies` and `devDependencies` in `package.json` (versions have the form `^x.y.z`) and run `npm outdated` to see the available versions.

`@tsconfig/node26` and `@types/node` stay on major 26 (Node 26) unless the user explicitly asks otherwise.

## 2. Look up the latest stable versions

Use `npm outdated` and, where needed, the web (npm registry, release notes) for the newest **stable** version of each package.
Ignore alpha, beta, rc, next and canary versions. Use the Context7 MCP for library documentation and migration guides where useful.

- Check compatibility: `vue` ↔ `vue-router`/`vue-i18n`/`vue-tsc`, `vite` ↔ `@vitejs/plugin-vue`, `eslint` ↔ `eslint-plugin-vue`/`@vue/eslint-config-typescript`, `typescript` ↔ `vue-tsc`.
- Read the release notes / migration guides of every major or minor upgrade for breaking changes.
- For a new **major** version of any package, report it to the user in the table instead of applying it, unless the major bump is clearly intended.

Show a table `item | old | new` before editing anything.

## 3. Apply the updates

1. Edit `package.json` — keep the `^` prefix and the 4-space indentation.
2. Run `npm install` so that `package-lock.json` is updated too.

## 4. Verify

Run `npm run type-check`, `npm run lint` and `npm run build`. Fix breaking changes following `AGENTS.md` (`<script setup>`, i18n keys, explicit `.ts`/`.vue` import extensions,
no Pinia/Vuex) and re-run until everything is green. If a fix is not obvious, stop and ask the user.
`npm run lint` uses `--fix`, so check `git diff` afterwards for unrelated changes.
For UI-affecting changes recommend a manual check in `npm run dev`.

## 5. Report

Do not commit or push. Report:
- the table of updated versions,
- code changes made because of breaking changes,
- the result of type-check, lint and build,
- the suggested commit message in the style of the git history: `VueJS: <version>, vite: <version>` (e.g. `VueJS: 3.5.41, vite: 8.2.2`; add other key packages such as `typescript: <version>` only when
  they changed).
