# Phase 2 – Classes & Generics

## Goal
Encapsulate the loose functions from Phase 1b into a class and introduce generics to allow attaching optional metadata to todos.

## Changes Compared to Phase 1b

### New: `Todos<TData>` Class
All functions were combined into a single class. The class holds the loaded todos as internal state — no repeated file access per operation.

```typescript
class Todos<TData> {
    private todos: Todo<TData>[];
    public readonly fileName = "./todos.json";
}
```

**New concepts:**
- `private` — the internal array is not accessible from outside
- `readonly` — `fileName` cannot be changed after initialization
- The constructor initializes `todos` with an empty array

### New: Generic `Todo<TData>` Interface
```typescript
interface Todo<TData> {
    id: string,
    description: string,
    status?: Status,
    createdAt: Date | string;
    data: TData;          // ← optional metadata
}
```
The interface is now generic — `TData` can be any type. When creating todos without metadata, `void | undefined` is used.

### New: `TagMeta` Interface
```typescript
interface TagMeta {
    tags: string[],
    priority: Priority
}
```
A concrete metadata implementation. Todos can optionally be tagged and assigned a priority.

### New: `Priority` Union Type
```typescript
type Priority = "low" | "medium" | "high";
```

### Changed: Centralized File Access
Instead of reading/writing in every function individually, there are now two dedicated methods:
- `loadFile()` — call once at startup
- `saveFile()` — call once at the end

### Changed: Class Instance in `app.ts`
```typescript
const todoManager = new Todos<void | TagMeta>();
await todoManager.loadFile();
// ... switch block ...
await todoManager.saveFile();
```

## File Structure
```
src/
  app.ts                        ← CLI switch block with class instance
  TodoClass.ts                  ← Todos<TData> class
  models/
    interfaces/
      todo.ts                   ← Todo<TData> + TagMeta
    types/
      status.ts                 ← Status union type
      priority.ts               ← Priority union type
```

## What's Still Missing (Motivation for Phase 3)
- `loadFile` and `saveFile` live in the same class as the business logic — it violates the Single Responsibility Principle
- The class cannot be tested without a real filesystem
- The Repository Pattern (Phase 3) would cleanly separate data access from business logic and makes the service interchangeable across different data stores
