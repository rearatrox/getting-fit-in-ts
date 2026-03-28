# getting-fit-in-ts

Ein iterativ wachsendes Lernprojekt: dasselbe Todo-CLI-Tool wird von Phase zu Phase mit mehr TypeScript-Wissen und besserer Architektur neu gebaut – von Plain JavaScript bis zu einer AWS Serverless API.

## Idee

Statt verschiedene Beispielprojekte zu bauen, wächst hier **ein einziges Projekt** mit jeder Phase. Das macht die Unterschiede zwischen den Ansätzen direkt vergleichbar – man sieht, welches Problem jede Phase löst und was vorher gefehlt hat.

## Projektstruktur

```
phase-1-a-plain-js-todo/    ← Ausgangspunkt: reines JavaScript, keine Typen
phase-1-b-ts-todo/          ← direkte TypeScript-Migration, gleiche Logik
phase-2-classes-generics/   ← Kapselung in Klassen, Generics eingeführt
phase-3-repo-service-pattern/ ← Repository/Service Pattern, Dependency Injection
phase-4-rest-api/           ← (geplant) Express-API, Service bleibt unverändert
phase-5-aws-serverless/     ← (geplant) Lambda + DynamoDB, Repository-Swap
```

Jede Phase hat eine eigene `README.md` mit den konkreten Änderungen und der Motivation für die nächste Phase.

## Aktueller Stand

| Phase | Status | Kernthema |
|---|---|---|
| 1a – Plain JS | ✅ | Ausgangspunkt ohne Typsystem |
| 1b – TypeScript | ✅ | Interfaces, Union-Types, typisierte Funktionen |
| 2 – Klassen & Generics | ✅ | Klassen, `private`/`readonly`, generische Interfaces |
| 3 – Repository/Service | ✅ | IRepository, Dependency Injection, abstrakte Klassen |
| 4 – REST API | ⏳ | Express, Zod, Error-Klassen |
| 5 – AWS Serverless | ⏳ | Lambda, DynamoDB, CDK |

## Lokale Ausführung

Jede Phase ist ein eigenständiges Node.js-Projekt mit eigenem `package.json`.

```bash
cd phase-3-repo-service-pattern
npm install
npx ts-node src/app.ts add "Einkaufen"
npx ts-node src/app.ts list
npx ts-node src/app.ts done <id>
npx ts-node src/app.ts delete <id>
```

## Roter Faden

Das zentrale Architekturziel, das sich durch alle Phasen zieht:

> Der `TodoService` wird **nie angefasst** – egal ob die Daten aus einer Datei, einer REST API oder DynamoDB kommen.

Das ist möglich, weil `TodoService` nur gegen `IRepository<Todo>` programmiert ist. In Phase 4 ersetzt Express die CLI – der Service bleibt. In Phase 5 ersetzt `DynamoRepository` das `FileRepository` – der Service bleibt.
