---
name: connector-layer
description: >-
  Use when adding or changing the connector layer in catalog-fe — a new `connector/<Name>Connector.ts` thin wrapper around the shared `catalogConnector` axios client. Covers the canonical method
  order, child-resource nested URLs, and the `FormData`/multipart upload variant.
---

# Connector layer

## Scope

`src/connector/<Name>Connector.ts` — one class per REST resource, a thin wrapper over the shared `catalogConnector` (`src/connector/common/CatalogConnector.ts`). Each method maps 1:1 to a backend
endpoint and returns `Promise<Result<T>>`.

Inline convention summary (full detail below): canonical method order `search, get, add, update, remove, duplicate, getStatistics`; every method is `async` and `return await`s the
`catalogConnector` call with an explicit `<T>`; relative URLs with no leading slash; no try/catch (the global `result-error` flow already covers failures); the file exports both the named class
and `export default new <Name>Connector();`. See `.claude/skills/new-resource/conventions.md` for the cross-layer picture.

## Files (Genre reference)

| File                          | Purpose                                                               |
|-------------------------------|-----------------------------------------------------------------------|
| `connector/GenreConnector.ts` | search/get/add/update/remove/duplicate/getStatistics against `genres` |

The real `src/connector/GenreConnector.ts` wins over the snippet below if they ever disagree.

## Genre template (embedded in full)

```typescript
import { type AxiosRequestConfig } from 'axios';
import { type INameFilter } from '../model/common/Filter.ts';
import { type IPage } from '../model/common/Paging.ts';
import { Result } from '../model/common/Result.ts';
import { Genre, type IGenre, type IGenreStatistics } from '../model/Genre.ts';
import { catalogConnector } from './common/CatalogConnector.ts';

export class GenreConnector {

  async search(filter: INameFilter): Promise<Result<IPage<IGenre>>> {
    const axiosConfig: AxiosRequestConfig = {
      params: filter
    };
    return await catalogConnector.get<IPage<IGenre>>('genres', axiosConfig);
  }

  async get(uuid: string): Promise<Result<IGenre>> {
    return await catalogConnector.get<IGenre>(`genres/${uuid}`);
  }

  async add(request: Genre): Promise<Result<IGenre>> {
    return await catalogConnector.post<IGenre>('genres', request);
  }

  async update(uuid: string, request: Genre): Promise<Result<IGenre>> {
    return await catalogConnector.put<IGenre>(`genres/${uuid}`, request);
  }

  async remove(uuid: string): Promise<Result<void>> {
    return await catalogConnector.delete<void>(`genres/${uuid}`);
  }

  async duplicate(uuid: string): Promise<Result<IGenre>> {
    return await catalogConnector.post<IGenre>(`genres/${uuid}/duplicate`);
  }

  async getStatistics(): Promise<Result<IGenreStatistics>> {
    return await catalogConnector.get<IGenreStatistics>('genres/statistics');
  }

}

export default new GenreConnector();
```

## The `catalogConnector` surface

`catalogConnector` (`src/connector/common/CatalogConnector.ts`) is a `ClientConnector` singleton exposing:

- `get<T>(url: string, config?: AxiosRequestConfig, silent?: boolean): Promise<Result<T>>`
- `post<T>(url: string, data?: unknown, config?: AxiosRequestConfig, silent?: boolean): Promise<Result<T>>`
- `put<T>(url: string, data?: unknown, config?: AxiosRequestConfig, silent?: boolean): Promise<Result<T>>`
- `delete<T>(url: string, config?: AxiosRequestConfig, silent?: boolean): Promise<Result<T>>`

Every call already adds the `X-Request-Id`/`X-User` headers, logs the exchange, and — unless `silent: true` is passed (never pass it from a resource connector) — emits `result-error` on failure.
Connectors never catch errors themselves.

## Conventions

- Method order: `search, get, add, update, remove, duplicate, getStatistics` — keep this order even when a resource drops some of them (a child resource simply omits `getStatistics`, see below).
- Every method is `async` and does `return await catalogConnector.<verb><T>(...)` — always `return await`, never a bare `return` of the promise (keeps stack traces useful and matches every
  existing connector).
- Always give the explicit `<T>` type argument on the `catalogConnector` call, matching the method's own return type's inner `Result<...>` type.
- Relative URLs never start with a leading slash (`'genres'`, not `'/genres'`) — `baseURL` already supplies the host/path prefix.
- `search` passes the filter as `{params: filter}` (`AxiosRequestConfig`), built as a local `axiosConfig` constant.
- `add`/`update` pass the model class instance directly as the request body (or a `Change<Name>Request` instance, for resources that have one) — no manual serialization.
- `duplicate` posts to `` `<resource>/${uuid}/duplicate` `` with no body.
- No try/catch anywhere in a connector — the global `result-error` flow (see `conventions.md`) already handles failures; a connector method just forwards the `Result`.
- Export both the named class (for type references and tests, if any) and a default singleton instance: `export default new <Name>Connector();`.

## Variations

- **Child resource** (Song-like): the parent's uuid is a leading parameter on every method, and URLs nest under the parent's resource path. No `getStatistics`. See `connector/SongConnector.ts`:
  `search(music: string, filter: IPagingFilter)` → `` `music/${music}/songs` ``, and so on for `get`/`add`/`update`/`remove`/`duplicate`, all taking `music: string` first.
- **Single-object child** (Cheat-like): no `search` — instead a `find(parent: string)` that fetches the one object directly (`` `games/${game}/cheats` `` with no uuid in the path), plus
  `get`/`add`/`update`/`remove` taking the parent uuid first. No `duplicate`, no `getStatistics`. See `connector/CheatConnector.ts`.
- **File upload** (Picture-like): `add` takes a `File` (or similar) instead of a model instance, builds a `FormData` (`data.append('file', picture)`), and passes
  `{headers: {'Content-Type': 'multipart/form-data'}}` as the `AxiosRequestConfig`. See `connector/PictureConnector.ts`. A resource shaped like this typically has no `model/<Name>.ts` file at
  all — skip the `model-layer` skill for it.

## Pitfalls

- Don't add a leading slash to any URL literal.
- Don't wrap a `catalogConnector` call in try/catch — that's the one thing this layer must never do.
- Don't forget `return await` in favor of a bare `return` — it's the house style even though both work identically at runtime.
- Don't give a child resource's connector a `getStatistics` method — children have no statistics.

## Checklist

- [ ] Methods follow the canonical order, each `async` + `return await catalogConnector.<verb><T>(...)`.
- [ ] No leading slash on any URL; `search` passes the filter via `{params: filter}`.
- [ ] No try/catch anywhere in the file.
- [ ] Named class export **and** `export default new <Name>Connector();`.
- [ ] Child resource: parent uuid(s) as leading params, nested URLs, no `getStatistics`. Single-object child: `find(parent)` instead of `search`, no `duplicate`/`getStatistics`.
