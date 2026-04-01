# Phase 3 – Repository/Service Pattern

## Goal
Cleanly separate responsibilities: business logic in the service, data access in the repository. The service no longer knows about the filesystem — it only works against an interface.

## Changes Compared to Phase 2

### Core Problem from Phase 2
The `Todos` class was responsible for two things: business logic (`done`, `delete`, ...) **and** persistence (`loadFile`, `saveFile`). This makes testing without real files impossible.

### New Architecture

```
IRepository<T>              ← interface: defines the contract (what)
      ↑
AbstractRepository<T>       ← abstract class: shared array logic (getAll, getById)
      ↑
InMemoryRepository<T>       ← concrete: array only, no filesystem (ideal for tests)
      ↑
FileRepository<T>           ← concrete: array + JSON file persistence

TodoService                 ← business logic, only knows IRepository<Todo>
```

### New: `IRepository<T>`
Generic interface with CRUD methods. All methods return `Promise` so the interface works for both synchronous (InMemory) and asynchronous (File, DynamoDB) implementations.

```typescript
interface IRepository<T extends { id: string }> {
    getAll(): Promise<T[]>;
    getById(id: string): Promise<T | undefined>;
    create(item: T): Promise<T>;
    update(item: T): Promise<T>;
    delete(id: string): Promise<string>;
}
```

### New: `AbstractRepository<T>`
Abstract base class with `protected items: T[] = []`. Implements `getAll` and `getById` — this logic is identical across all implementations. `create`, `update`, `delete` are `abstract` and must be implemented by subclasses.

### New: `InMemoryRepository<T>`
Concrete implementation that only works with the internal array. No filesystem. Primarily for testing — `TodoService` can be tested without any file.

### New: `FileRepository<T>`
Extends `InMemoryRepository` and adds a `saveFile()` call after each mutation (`create`, `update`, `delete`). Uses `super.method()` to reuse the parent class array logic.

**Static factory method** for safe initialization:
```typescript
static async create<T extends { id: string }>(): Promise<FileRepository<T>> {
    const repo = new FileRepository<T>();
    await repo.loadFile();
    return repo;
}
```

### New: `TodoService`
Contains all business logic. Receives an `IRepository<Todo>` via **dependency injection** in the constructor — it doesn't know whether a file, in-memory store, or DynamoDB is behind it.

```typescript
class TodoService {
    constructor(private readonly repository: IRepository<Todo>) {}
}
```

### Changed: `app.ts`
Wires up repository and service using the IIFE pattern:
```typescript
(async () => {
    const fileRepo = await FileRepository.create<Todo>();
    const todoService = new TodoService(fileRepo);
    // switch block ...
})();
```

### Changed: `Todo` Interface
`data` is now optional (`data?: TData`) instead of required.

## File Structure
```
src/
  app.ts
  models/
    interfaces/todo.ts
    types/status.ts + priority.ts
  repositories/
    IRepository.ts
    AbstractRepository.ts
    InMemoryRepository.ts
    FileRepository.ts
  services/
    TodoService.ts
```

## Core Concept: Dependency Inversion
The `TodoService` does not depend on `FileRepository`, but on `IRepository<Todo>`. This means:
- In **tests**: `new TodoService(new InMemoryRepository())`
- In **production**: `new TodoService(new FileRepository())`
- In **Phase 5**: `new TodoService(new DynamoDbRepository())`

The service is **never touched** — only the repository is swapped.

## What's Still Missing (Motivation for Phase 4)
- `app.ts` is a CLI tool — only usable from the command line
- No HTTP interface, no parallel requests, no external accessibility
- Phase 4 replaces the CLI with an Express REST API — the `TodoService` remains completely unchanged
