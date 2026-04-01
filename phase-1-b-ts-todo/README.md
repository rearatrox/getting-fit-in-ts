# Phase 1b – TypeScript Migration

## Goal
Port the plain JS code from Phase 1a directly to TypeScript — same logic, but with a type system. No refactoring, just adding types.

## Changes Compared to Phase 1a

### New: TypeScript
- `.js` → `.ts`
- `tsconfig.json` with strict compiler options (`strict: true`)
- `@/` path alias for clean imports

### New: `Todo` Interface
```typescript
interface Todo {
    id: string,
    title: string,
    description?: string,
    status?: Status,
    createdAt: Date | string;
}
```
The Todo object is now clearly defined — the IDE knows all fields and typos are caught immediately.

### New: `Status` Union Type
```typescript
type Status = "open" | "done";
```
`status` can now only be `"open"` or `"done"`. A value like `"oepn"` would produce a compile error.

### Changed: All Functions Explicitly Typed
- Parameters have types: `title: string`, `id: string`
- Return values have types: `Promise<void>`
- Arrays have types: `Todo[]` instead of implicit `any[]`

### Changed: `JSON.parse` with Type Annotation
```typescript
let fileArray: Todo[] = JSON.parse(file.toString());
```
Instead of an untyped `any` array, TypeScript now knows it's a `Todo[]`.

## File Structure
```
src/
  app.ts                        ← ported functions + CLI switch block
  models/
    interfaces/
      todo.ts                   ← Todo interface
    types/
      status.ts                 ← Status union type
```

## What's Still Missing (Motivation for Phase 2)
- All functions read/write the file **individually** — a lot of duplicated file access code
- No encapsulation — logic and persistence are mixed together
- A class would hold the state (loaded todos) centrally
