---
name: i18n-locales
description: >-
  Use when adding or changing translation keys in catalog-fe for a resource — the `src/i18n/locales/en.json` block (`title`, `header`, `form.add`/`form.edit`, `menu.list`, `statistics.count`,
  optional `detail`/`noData`/local `items`). Covers vue-i18n linked messages and why key names must match the model layer's yup schema exactly.
---

# i18n locales

## Scope

The resource's block inside `src/i18n/locales/en.json`, the single locale file for the project. Every user-facing string in the app goes through `t('...')` — this skill is where the strings a new
resource needs actually get added.

Inline convention summary (full detail below): 4-space indent, resource blocks alphabetical at the top level and keys alphabetical inside each block; the standard block shape is
`title`/`header`/`form.add`/`form.edit`/`menu.list`/`statistics.count`; vue-i18n linked messages (`@:`/`@.lower:`) are used instead of repeating nouns. See
`.claude/skills/new-resource/conventions.md` for the cross-layer picture.

## Files (Genre reference)

| File                       | Purpose                                                |
|----------------------------|--------------------------------------------------------|
| `src/i18n/locales/en.json` | single locale file; the `genres` block is the template |

The real `genres` block in `src/i18n/locales/en.json` wins over the snippet below if they ever disagree.

## Genre template (embedded in full)

```json
"genres": {
    "form": {
        "add": "Add @.lower:genres.header",
        "edit": "Edit @.lower:genres.header"
    },
    "header": "Genre",
    "menu": {
        "list": "All @.lower:genres.title"
    },
    "statistics": {
        "count": "Count of @.lower:genres.title"
    },
    "title": "Genres"
}
```

## Conventions

- One locale file, `src/i18n/locales/en.json`, 4-space indent, no trailing commas.
- Resource blocks are alphabetically ordered at the top level (`genres` sits between `games` and `items`, for example) — insert the new block in alphabetical position, don't append at the end.
- Keys inside each block are alphabetically ordered too (`errors` < `form` < `header` < `items` < `menu` < `noData` < `statistics` < `title`).
- Standard block shape, reproduced from the Genre template:
  - `title` — plural resource name (`"Genres"`).
  - `header` — singular resource name (`"Genre"`).
  - `form.add` / `form.edit` — `"Add @.lower:<plural>.header"` / `"Edit @.lower:<plural>.header"`.
  - `menu.list` — `"All @.lower:<plural>.title"`.
  - `statistics.count` — `"Count of @.lower:<plural>.title"` (omit the whole `statistics` block for a child/single-object-child resource, which has no statistics).
- Optional additions, add only when the resource actually needs them:
  - `detail` — `"@:<plural>.header detail"`, only when a detail view exists (see `games`/`movies`/`jokes`).
  - `noData` — `"No @.lower:<plural>.title"`, used by a child list view's empty state (see `songs`, `seasons`).
  - a resource-local `items` block for fields that aren't generic enough for the shared `items` section (see `movies.items.year`/`medium`, `cheats.items.gameSetting`/`cheatSetting`).
  - a resource-local `errors` block for a validation message that doesn't fit the shared `errors.*` shapes (see `seasons.errors.years`, `pictures.errors.maxSize`).
- Use vue-i18n linked messages (`@:key` for the exact string, `@.lower:key` for the lower-cased string) instead of retyping a noun that already exists elsewhere — this is why `form.add` references
  `header`, not a hardcoded resource name.
- Reuse the shared `items`/`links`/`errors` top-level sections for anything generic (`items.name`, `items.note`, `links.create`/`update`/`cancel`/`duplicate`/`edit`/`remove`, `errors.required`,
  `errors.max.string`, `errors.max.number`, `errors.min.number`, `errors.min.list`). Add a field to the shared `items` block only when the name is genuinely generic (e.g. `name`, `note`, `length`)
  — a field specific to one resource's domain (e.g. `cheats.items.gameSetting`) stays in that resource's own block.
- Optionally extend `app.description` (top-level, alphabetically before `authors`) when the new resource is a new top-level catalog item — it's a comma-joined `@.lower:` list of every top-level
  resource's title.

## Pitfalls

- **Key names must match the model layer exactly** — `getGenreSchema()` (and every other resource's schema function) references `errors.required`, `errors.max.string`, `items.name`, etc. by
  literal string key. If `i18n-locales` runs after `model-layer` wrote a schema referencing `t('items.x')`, the key `items.x` must already exist (or be added here) with that exact name — a typo
  here silently renders as the raw key string, not a build error, so double-check the key spelled in the model's schema function against what gets added here.
- Don't repeat a noun that `@:`/`@.lower:` could link to instead — grep the existing file for the pattern (`form.add`, `menu.list`, `statistics.count` all link back to `header`/`title`) before
  writing a literal string.
- Don't add a `statistics` block to a child or single-object-child resource.
- Don't add a field to the shared top-level `items` block unless the name is genuinely generic — resource-specific fields stay in the resource's own block.

## Checklist

- [ ] Block inserted in alphabetical position at the top level; keys alphabetical inside it.
- [ ] `title`/`header`/`form.add`/`form.edit`/`menu.list` present; `statistics.count` present unless this is a child/single-object-child resource.
- [ ] `detail`/`noData`/local `errors`/local `items` added only if the resource actually needs them.
- [ ] Every key referenced by the model layer's `get<Name>Schema()` (and by the components/views layers' `t('...')` calls) exists under the exact name used.
- [ ] `app.description` extended if this is a new top-level catalog item.
