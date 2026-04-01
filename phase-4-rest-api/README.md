# Phase 4 – REST API with Express

## Goal
Replace the CLI from Phase 3 with a fully-featured HTTP REST API. The `TodoService` remains completely unchanged — only `app.ts` and a new router layer are added.

## Changes Compared to Phase 3

### Core Problem from Phase 3
The CLI tool in `app.ts` was only usable locally via the command line. No external access, no parallel requests, no standardized interface for other clients.

### New Architecture

```
Express App (app.ts)
      ↓
todoRoutes.ts (Router)       ← HTTP routes, Zod validation, ApiResponse<T>
      ↓
TodoService                  ← unchanged from Phase 3
      ↓
FileRepository → todos.json
```

### New: Express REST API

`app.ts` starts an Express server on port 3000 and mounts the router at `/api/todo`:

```typescript
const fileRepo = await FileRepository.create<Todo>();
const todoService = new TodoService(fileRepo);
const router = createTodoRouter(todoService);
app.use("/api/todo", router);
app.listen(3000);
```

### New: `todoRoutes.ts`

All 5 endpoints are implemented:

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/todo` | Retrieve all todos |
| `POST` | `/api/todo` | Create a new todo |
| `GET` | `/api/todo/:id` | Retrieve a single todo |
| `PATCH` | `/api/todo/:id/done` | Mark a todo as done |
| `DELETE` | `/api/todo/:id` | Delete a todo |

### New: `ApiResponse<T>` – Generic Response Type

All routes return a consistent response structure:

```typescript
type ApiResponse<T> = {
    statusCode: number,
    timestamp: string,
    message: string,
    item: T,
}
```

### New: Zod Validation for POST

The request body is validated with Zod before it reaches the service:

```typescript
const postBody = z.object({
    description: z.string().min(1),
});
const result = postBody.safeParse(req.body);
if (!result.success) throw new ValidationError();
```

### New: Custom Error Classes

```typescript
class NotFoundError extends Error {
    public readonly statusCode = 404;
}

class ValidationError extends Error {
    public readonly statusCode = 400;
}
```

### New: `errorHandler` Middleware

Centralized error handling for all routes. Known errors (`NotFoundError`, `ValidationError`) are returned with their `statusCode`; unknown errors always return `500`:

```typescript
function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
    if (err instanceof NotFoundError || err instanceof ValidationError) {
        return res.status(err.statusCode).json({ statusCode: err.statusCode, message: err.message });
    } else {
        return res.status(500).json({ statusCode: 500, message: "Internal server error." });
    }
}
```

Every route calls `next(error)` in its `catch` block so errors are handled centrally.

## File Structure

```
src/
  app.ts                      ← Express setup, IIFE, port 3000
  routes/
    todoRoutes.ts             ← router with all 5 endpoints + Zod
  errors/
    NotFoundError.ts          ← statusCode 404
    ValidationError.ts        ← statusCode 400
  middleware/
    errorHandler.ts           ← centralized error handling
  models/
    interfaces/todo.ts
    types/status.ts + priority.ts
  repositories/               ← unchanged from Phase 3
    IRepository.ts
    AbstractRepository.ts
    InMemoryRepository.ts
    FileRepository.ts
  services/
    TodoService.ts            ← unchanged from Phase 3
```

## Running Locally

```bash
npm install
npx ts-node src/app.ts
# Server running at http://localhost:3000/api/todo
```

## What's Still Missing (Motivation for Phase 5)
- The server runs locally — no hosting, no scaling, no managed service
- `FileRepository` writes to the local disk — not scalable in the cloud
- Phase 5 deploys the API as AWS Lambda + DynamoDB via CDK, replacing only `FileRepository` with `DynamoDbRepository`
