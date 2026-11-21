---
name: new-resource
description: >-
  Use when adding a complete new resource to catalog-fe (or a major new child resource) — orchestrates the model, connector, store, i18n, components, views, and router/navigation layers in the
  right order. Also use to decide whether a new resource is simple (Genre-like), a child (Song-like), or a single-object child (Cheat-like) before starting.
---

# New resource (orchestrator)

## Scope

Adding an entire new resource to catalog-fe end-to-end — every layer from the model/connector up to the route and navigation entry. This skill sequences the seven other `.claude/skills/` layer
skills; it does not duplicate their content. Read `.claude/skills/new-resource/conventions.md` first — it's the shared reference every layer skill also links back to.

## 1. Gather the resource spec before writing anything

Pin these down (ask the user if ambiguous) before invoking any layer skill:

- **Name**: singular PascalCase (e.g. `Director`), its lowercase plural (`directors`, used for the URL path, route names, and component folder).
- **Fields**: name + TS type + required/optional + validation limits (max string length, numeric min/max, min list length, ...) + i18n label for each business field.
- **Filter shape**: does an existing filter fit (`INameFilter`, `IMultipleNameFilter`, bare `IPagingFilter`), or does it need a bespoke pair added to `model/common/Filter.ts`?
- **Resource shape**: simple (Genre-like) / child (Song-like, incl. the parent uuid chain) / single-object child (Cheat-like) — see the decision table below (full version in `conventions.md`).
- **Optional parts**: statistics, `duplicate`, `getAll()` (only if this resource will be pick-listed from another resource's form), a detail view, a `Change<Name>Request` (only if the request
  shape differs from the form shape, e.g. `Time` fields serialized to seconds).

### Simple vs. child vs. single-object child (short form — see `conventions.md` for the full table)

|                           | Simple                     | Child                                                        | Single-object child                                          |
|---------------------------|----------------------------|--------------------------------------------------------------|--------------------------------------------------------------|
| Own route file/menu entry | Yes                        | No — extends the parent's route file, no `CatalogMenu` entry | No — extends the parent's route file, no `CatalogMenu` entry |
| Store shape               | List + paging + statistics | List + paging, no statistics                                 | One `Ref<I<Name>>`, no list/paging                           |
| Reference implementation  | Genre                      | Song (under Music)                                           | Cheat (under Game)                                           |

## 2. Invoke the layer skills, in this order

Each step names the skill to invoke and why it has to happen there — later layers import types or reference keys that earlier layers create.

1. **`model-layer`** — the DTO/class/schema every other layer imports; nothing else compiles without it.
2. **`connector-layer`** — needs the model types from step 1.
3. **`store-layer`** — needs the connector (2) and model (1).
4. **`i18n-locales`** — the keys referenced by the model's yup schema (`errors.required`, `items.*`, ...) and by components/views must already exist before those layers are written, or
   `npm run type-check`/the running app will reference missing keys.
5. **`components-layer`** — needs the model schema (1) and the i18n keys (4).
6. **`views-layer`** — needs the store (3) and the components (5).
7. **`router-navigation`** — needs the views (6) to exist; also wires up `CatalogMenu.vue` (simple resources only).

## 3. Final step

Run `npm run type-check`, `npm run lint`, and `npm run build`. Fix any failures before reporting the resource done.

Non-blocking reminders — mention these to the user, don't block on them:

- Extend `app.description` in `src/i18n/locales/en.json` if this is a new top-level catalog item (movies/shows/games/...-shaped), not a supporting/internal resource.
- Mention updating AGENTS.md's resource wording if the new resource changes the project's high-level description.

Never commit as part of running this skill.

## File-count sanity table

For a simple (Genre-like) resource, expect roughly:

| Area     | Count | Files                                                                                                    |
|----------|-------|----------------------------------------------------------------------------------------------------------|
| New      | ~9    | model (1), connector (1), store (1), form + menu components (2), list/add/edit views (3), route file (1) |
| Modified | 3     | `src/router/index.ts`, `src/components/CatalogMenu.vue`, `src/i18n/locales/en.json`                      |

A child resource adds no own route file or `CatalogMenu` entry — the parent's route file is extended instead, and the menu component renders the parent's menu rather than `CatalogMenu`. A
single-object child additionally drops the list view/paging and the store's list `Ref` in favor of one object `Ref`.

## Pitfalls

- Don't reorder the sequence in step 2 — later layers' types and i18n keys are derived from earlier steps, not an arbitrary preference. In particular, i18n must exist **before**
  components/views are written.
- Don't duplicate layer-skill pitfalls here — see each individual layer skill's own Pitfalls section.
- Don't invent a new filter shape in the resource's own model file — new filter shapes belong in `model/common/Filter.ts` (see `conventions.md`).

## Verification

1. `npm run type-check`, `npm run lint`, and `npm run build` are all green.
2. Generated files diff cleanly against the genre-derived (or Song/Cheat-derived, for child resources) template section of each layer skill, with only names/fields substituted.
3. Optional — offer this to the user, don't do it unprompted: scaffold the new resource on a scratch branch first, run the verification commands, and discard the branch if it was only meant as a
   dry run before committing to the real implementation.
