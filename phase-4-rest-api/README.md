# Phase 3 – Repository/Service Pattern

## Ziel
Verantwortlichkeiten sauber trennen: Business-Logik im Service, Datenzugriff im Repository. Der Service kennt kein Filesystem mehr – er arbeitet nur gegen ein Interface.

## Änderungen gegenüber Phase 2

### Kernproblem aus Phase 2
Die `Todos`-Klasse war für zwei Dinge zuständig: Business-Logik (`done`, `delete`, ...) **und** Persistenz (`loadFile`, `saveFile`). Das macht Testen ohne echte Dateien unmöglich.

### Neue Architektur

```
IRepository<T>              ← Interface: definiert den Vertrag (was)
      ↑
AbstractRepository<T>       ← abstrakte Klasse: gemeinsame Array-Logik (getAll, getById)
      ↑
InMemoryRepository<T>       ← konkret: nur Array, kein Filesystem (ideal für Tests)
      ↑
FileRepository<T>           ← konkret: Array + JSON-Dateipersistenz

TodoService                 ← Business-Logik, kennt nur IRepository<Todo>
```

### Neu: `IRepository<T>`
Generisches Interface mit CRUD-Methoden. Alle Methoden geben `Promise` zurück, damit das Interface sowohl für synchrone (InMemory) als auch asynchrone (File, Dynamo) Implementierungen gilt.

```typescript
interface IRepository<T extends { id: string }> {
    getAll(): Promise<T[]>;
    getById(id: string): Promise<T | undefined>;
    create(item: T): Promise<T>;
    update(item: T): Promise<T>;
    delete(id: string): Promise<string>;
}
```

### Neu: `AbstractRepository<T>`
Abstrakte Basisklasse mit `protected items: T[] = []`. Implementiert `getAll` und `getById` – diese Logik ist für alle Implementierungen identisch. `create`, `update`, `delete` sind `abstract` – müssen von Subklassen implementiert werden.

### Neu: `InMemoryRepository<T>`
Konkrete Implementierung, die nur mit dem internen Array arbeitet. Kein Filesystem. Primär für Tests gedacht – der `TodoService` kann damit ohne Datei getestet werden.

### Neu: `FileRepository<T>`
Erweitert `InMemoryRepository` und ergänzt nach jeder Mutation (`create`, `update`, `delete`) ein `saveFile()`. Nutzt `super.methode()` um die Array-Logik der Elternklasse wiederzuverwenden.

**Static Factory Method** für sichere Initialisierung:
```typescript
static async create<T extends { id: string }>(): Promise<FileRepository<T>> {
    const repo = new FileRepository<T>();
    await repo.loadFile();
    return repo;
}
```

### Neu: `TodoService`
Enthält die gesamte Business-Logik. Bekommt ein `IRepository<Todo>` per **Dependency Injection** im Konstruktor – weiß nicht, ob dahinter ein File, InMemory oder DynamoDB steckt.

```typescript
class TodoService {
    constructor(private readonly repository: IRepository<Todo>) {}
}
```

### Geändert: `app.ts`
Verdrahtet Repository und Service mittels IIFE-Pattern:
```typescript
(async () => {
    const fileRepo = await FileRepository.create<Todo>();
    const todoService = new TodoService(fileRepo);
    // switch-block ...
})();
```

### Geändert: `Todo`-Interface
`data` ist nun optional (`data?: TData`) statt zwingend erforderlich.

## Dateistruktur
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

## Kernkonzept: Dependency Inversion
Der `TodoService` hängt nicht von `FileRepository` ab, sondern von `IRepository<Todo>`. Das bedeutet:
- In **Tests**: `new TodoService(new InMemoryRepository())`
- In **Produktion**: `new TodoService(new FileRepository())`
- In **Phase 5**: `new TodoService(new DynamoRepository())`

Der Service wird dabei **nie angefasst** – nur das Repository wird ausgetauscht.
