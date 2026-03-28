# Phase 2 – Klassen & Generics

## Ziel
Die losen Funktionen aus Phase 1b in eine Klasse kapseln und Generics einführen, um optionale Metadaten an Todos anhängen zu können.

## Änderungen gegenüber Phase 1b

### Neu: `Todos<TData>`-Klasse
Alle Funktionen wurden in eine Klasse zusammengefasst. Die Klasse hält die geladenen Todos als internen Zustand – kein wiederholter Dateizugriff mehr pro Operation.

```typescript
class Todos<TData> {
    private todos: Todo<TData>[];
    public readonly fileName = "./todos.json";
}
```

**Neue Konzepte:**
- `private` – internes Array ist von außen nicht zugreifbar
- `readonly` – `fileName` kann nach der Initialisierung nicht mehr verändert werden
- Konstruktor initialisiert `todos` mit einem leeren Array

### Neu: Generisches `Todo<TData>`-Interface
```typescript
interface Todo<TData> {
    id: string,
    description: string,
    status?: Status,
    createdAt: Date | string;
    data: TData;          // ← optionale Metadaten
}
```
Das Interface ist nun generisch – `TData` kann ein beliebiger Typ sein. Beim Erstellen ohne Metadaten wird `void | undefined` verwendet.

### Neu: `TagMeta`-Interface
```typescript
interface TagMeta {
    tags: string[],
    priority: Priority
}
```
Konkrete Implementierung von Metadaten. Todos können optional mit Tags und Priorität versehen werden.

### Neu: `Priority`-Union-Type
```typescript
type Priority = "low" | "medium" | "high";
```

### Geändert: Dateizugriff zentralisiert
Statt in jeder Funktion einzeln zu lesen/schreiben gibt es jetzt zwei dedizierte Methoden:
- `loadFile()` – einmalig beim Start aufrufen
- `saveFile()` – einmalig am Ende aufrufen

### Geändert: Klassen-Instanz in `app.ts`
```typescript
const todoManager = new Todos<void | TagMeta>();
await todoManager.loadFile();
// ... switch-block ...
await todoManager.saveFile();
```

## Dateistruktur
```
src/
  app.ts                        ← CLI-Switch-Block mit Klassen-Instanz
  TodoClass.ts                  ← Todos<TData>-Klasse
  models/
    interfaces/
      todo.ts                   ← Todo<TData> + TagMeta
    types/
      status.ts                 ← Status-Union-Type
      priority.ts               ← Priority-Union-Type
```

## Was noch fehlt (Motivation für Phase 3)
- `loadFile` und `saveFile` sind in derselben Klasse wie die Business-Logik
- Die Klasse kann nicht ohne Dateisystem getestet werden
- Das Repository-Pattern würde Datenzugriff und Logik sauber trennen
