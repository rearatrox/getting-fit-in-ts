# getting-fit-in-ts
CLI Todo-Tool project in different ways to learn functionalities and service repository design pattern


# TypeScript Learning Roadmap – Todo CLI Project

## Kontext
Lernpfad anhand eines einzigen, iterativ wachsenden Projekts: ein **Todo-CLI-Tool**, das von Plain JavaScript bis zu einer AWS Serverless API ausgebaut wird. Kein Themenwechsel – nur wachsende Komplexität am gleichen Problem.

---

## Phase 1 – JS → TypeScript Grundlagen
**Ziel:** Plain-JS-Todo-CLI direkt nach TypeScript portieren.

- `Todo`-Interface mit allen Feldern
- `Status`-Union-Type: `"open" | "done" | "archived"`
- Alle Funktionen explizit typisiert (Parameter + Rückgabewerte)
- `unknown` statt `any` bei User-Input, Type Guards zur Absicherung
- Speicherung in einer lokalen JSON-Datei via `fs/promises`

---

## Phase 2 – Klassen & Generics
**Ziel:** Logik in eine Klasse kapseln, Generics organisch einführen.

- `TodoManager`-Klasse mit `private`, `readonly`, Konstruktor
- `Todo<TMeta = void>` als generisches Interface – optionale Metadaten
- Konkrete Meta-Typen: `TagMeta` (`tags`, `priority`) und `FileMeta` (`attachments`, `fileSize`)
- Dateizugriff noch direkt in der Klasse (bewusst unsauber – wird in Phase 3 gelöst)

---

## Phase 3 – Repository/Service Pattern & Utility Types
**Ziel:** Verantwortlichkeiten trennen, Typsystem vertiefen.

- `IRepository<T>` als Interface, `AbstractRepository` als abstrakte Basisklasse
- `FileRepository` und `InMemoryRepository` als konkrete Implementierungen
- `TodoService` enthält Businesslogik, kennt kein Filesystem
- **Discriminated Unions:** Todo-Status mit Payload:
  - `{ status: "open" }`
  - `{ status: "done", completedAt: Date }`
  - `{ status: "archived", reason: string }`
  - Exhaustive checking via `never` in Switch-Statements
- **Utility Types:** `Partial<Todo>` für Updates, `Pick` für Listenansicht, `Readonly` für den Katalog – direkt am Todo-Modell angewandt

---

## Phase 4 – REST API
**Ziel:** CLI-Layer durch HTTP ersetzen – Service & Repository bleiben unverändert.

- Express-Routen ersetzen CLI-Commands
- `TodoService` und `FileRepository` werden **ohne Änderung** wiederverwendet (Aha-Moment der Architektur)
- Zod für Input-Validierung
- Eigene Error-Klassen: `ValidationError`, `NotFoundError`
- Globaler Express-Error-Handler
- Generischer `fetchJson<T>` Wrapper für externe API-Calls

---

## Phase 5 – AWS Serverless
**Ziel:** Express durch Lambda ersetzen, FileRepository durch DynamoDB.

- Lambda-Funktionen ersetzen Express-Routen
- `DynamoRepository` implementiert `IRepository<Todo>` – Interface-Swap ohne Logikänderung
- API Gateway davor
- Deployment mit AWS CDK (TypeScript)

---