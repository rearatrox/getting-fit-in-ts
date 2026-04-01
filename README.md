# getting-fit-in-ts

An iteratively growing learning project: the same Todo tool is rebuilt phase by phase with more TypeScript knowledge and better architecture — from Plain JavaScript to a fully deployed AWS Serverless API.

> **Everything in this project was written by hand.** The goal was to genuinely develop code independently — supported by internet research, official documentation, and GitHub Copilot as a learning aid. Copilot was never used to generate finished solutions, but as a guide for explanations, questions, and conceptual pointers. A custom agent defined in [`.github/agents/typescript-mentor.agent.md`](.github/agents/typescript-mentor.agent.md) enforced this approach: it acted as a Socratic TypeScript mentor that explained concepts and asked counter-questions — but deliberately never wrote a single line of code.

## Idea

Instead of building different example projects, **a single project** grows with each phase. This makes the differences between approaches directly comparable — you can see exactly what problem each phase solves and what was missing before.

## Project Structure

```
phase-1-a-plain-js-todo/      ← starting point: plain JavaScript, no types
phase-1-b-ts-todo/            ← direct TypeScript migration, same logic
phase-2-classes-generics/     ← encapsulation in classes, generics introduced
phase-3-repo-service-pattern/ ← Repository/Service Pattern, Dependency Injection
phase-4-rest-api/             ← Express REST API, Zod validation, error handling
phase-5-aws/                  ← AWS Lambda + DynamoDB + API Gateway via CDK
```

Each phase has its own `README.md` describing the concrete changes and the motivation for the next phase.

## Current Status

| Phase | Status | Core Topic |
|---|---|---|
| 1a – Plain JS | ✅ | Starting point without a type system |
| 1b – TypeScript | ✅ | Interfaces, union types, typed functions |
| 2 – Classes & Generics | ✅ | Classes, `private`/`readonly`, generic interfaces |
| 3 – Repository/Service | ✅ | IRepository, dependency injection, abstract classes |
| 4 – REST API | ✅ | Express, Zod, custom error classes |
| 5 – AWS Serverless | ✅ | Lambda, DynamoDB, API Gateway, CDK, API Key |

## Running Locally

Each phase is a standalone Node.js project with its own `package.json`.

**Phases 1–3 (CLI):**
```bash
cd phase-3-repo-service-pattern
npm install
npx ts-node src/app.ts add "Buy groceries"
npx ts-node src/app.ts list
npx ts-node src/app.ts done <id>
npx ts-node src/app.ts delete <id>
```

**Phase 4 (REST API):**
```bash
cd phase-4-rest-api
npm install
npx ts-node src/app.ts
# API running at http://localhost:3000/api/todo
```

**Phase 5 (AWS Serverless — local testing):**
```bash
cd phase-5-aws
docker run -d -p 8000:8000 amazon/dynamodb-local
bash setup-local-dynamo.sh
DYNAMO_ENDPOINT=http://localhost:8000 npx ts-node src/app.ts
```

## The Common Thread

The central architectural goal that runs through every phase:

> The `TodoService` is **never touched** — regardless of whether data comes from a file, a REST API, or DynamoDB.

This is possible because `TodoService` only depends on `IRepository<Todo>`:

- Phase 3/4 → `new TodoService(new FileRepository())`
- Phase 5 → `new TodoService(new DynamoDbRepository())`

Only the repository is swapped — the service and all business logic stay identical.

---

*Note: While all code in this project was written by hand, the documentation (READMEs) was generated with the help of GitHub Copilot.*
