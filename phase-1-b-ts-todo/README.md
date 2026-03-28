# Phase 1b – TypeScript Migration

## Ziel
Den Plain-JS-Code aus Phase 1a direkt nach TypeScript portieren – gleiche Logik, aber mit Typsystem. Kein Refactoring, nur Typen hinzufügen.

## Änderungen gegenüber Phase 1a

### Neu: TypeScript
- `.js` → `.ts`
- `tsconfig.json` mit strikten Compiler-Optionen (`strict: true`)
- `@/`-Pfad-Alias für saubere Imports

### Neu: `Todo`-Interface
```typescript
interface Todo {
    id: string,
    title: string,
    description?: string,
    status?: Status,
    createdAt: Date | string;
}
```
Das Todo-Objekt ist nun klar definiert – die IDE kennt alle Felder, Tippfehler werden sofort erkannt.

### Neu: `Status`-Union-Type
```typescript
type Status = "open" | "done";
```
`status` kann nur noch `"open"` oder `"done"` annehmen. Ein Wert wie `"oepn"` würde einen Compile-Fehler erzeugen.

### Geändert: Alle Funktionen explizit typisiert
- Parameter haben Typen: `title: string`, `id: string`
- Rückgabewerte haben Typen: `Promise<void>`
- Arrays haben Typen: `Todo[]` statt implizitem `any[]`

### Geändert: `JSON.parse` mit Typ-Annotation
```typescript
let fileArray: Todo[] = JSON.parse(file.toString());
```
Statt einem ungetypten `any`-Array weiß TypeScript nun, dass es sich um `Todo[]` handelt.

## Dateistruktur
```
src/
  app.ts                        ← portierte Funktionen + CLI-Switch-Block
  models/
    interfaces/
      todo.ts                   ← Todo-Interface
    types/
      status.ts                 ← Status-Union-Type
```

## Was noch fehlt (Motivation für Phase 2)
- Alle Funktionen lesen/schreiben die Datei **einzeln** – viel duplizierter Dateizugriffscode
- Keine Kapselung – Logik und Persistenz sind vermischt
- Eine Klasse würde den Zustand (geladene Todos) zentral halten
