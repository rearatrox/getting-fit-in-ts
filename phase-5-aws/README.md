# Phase 5 – AWS Serverless with Lambda, DynamoDB & CDK

## Goal
Replace the Express REST API from Phase 4 with a fully serverless AWS architecture. `FileRepository` is swapped for `DynamoDbRepository` — the `TodoService` remains unchanged. All infrastructure is managed as code with AWS CDK.

## Changes Compared to Phase 4

### Core Problem from Phase 4
The Express server ran locally and was not scalable. `FileRepository` writes to a local file — not viable in the cloud.

### New Architecture

```
API Gateway (REST API)        ← public HTTP interface secured with API Key
      ↓
AWS Lambda (NodejsFunction)   ← one handler per route
      ↓
LambdaBase (abstract class)   ← validate() + process() + run() orchestration
      ↓
TodoService                   ← unchanged from Phase 3/4
      ↓
DynamoDbRepository            ← replaces FileRepository, uses AWS SDK v3
      ↓
DynamoDB (AWS)                ← persistent cloud data store
```

### New: `LambdaBase` – Abstract Base for All Lambda Handlers

Each Lambda is implemented as a class extending `LambdaBase`:

```typescript
abstract class LambdaBase {
    protected readonly lambdaEvent: APIGatewayProxyEvent;
    abstract validate(): Promise<ValidationResult>;
    abstract process(): Promise<APIGatewayProxyResult>;
    async run(): Promise<APIGatewayProxyResult> { ... }
}
```

`run()` orchestrates the flow: first `validate()`, on failure → 400, then `process()`, on unknown error → 500.

### New: 5 Lambda Handlers

| Class | HTTP Method | Route |
|---|---|---|
| `GetAllTodosLambda` | `GET` | `/todos` |
| `CreateTodoLambda` | `POST` | `/todos` |
| `GetByIdTodoLambda` | `GET` | `/todos/{id}` |
| `MarkDoneTodoLambda` | `PUT` | `/todos/{id}` |
| `DeleteTodoLambda` | `DELETE` | `/todos/{id}` |

Every handler follows the same pattern:
```typescript
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    return new XxxTodoLambda(event).run();
};
```

### New: `DynamoDbRepository<T>`

Implements `IRepository<T>` using AWS SDK v3 (`@aws-sdk/lib-dynamodb`). The `endpoint` parameter is optional — when omitted, the client automatically connects to real AWS DynamoDB:

```typescript
constructor(tableName: string, endpoint?: string) {
    const dynamo = new DynamoDBClient({
        region: "eu-west-1",
        ...(endpoint ? { endpoint } : {})
    });
}
```

For local testing: set `DYNAMO_ENDPOINT=http://localhost:8000`.

### New: CDK Infrastructure

All infrastructure lives as TypeScript code in the `cdk/` folder, split into three constructs:

```
cdk/
  bin/cdk.ts                  ← CDK app entry point
  lib/cdk-stack.ts            ← CdkStack: wires all constructs together
  constructs/
    todo-table.ts             ← DynamoDB table (RemovalPolicy.DESTROY)
    todo-lambdas.ts           ← 5 NodejsFunction instances with esbuild bundling
    todo-api.ts               ← RestApi, LambdaIntegration, ApiKey, UsagePlan
  constants/
    config.ts                 ← tableName: "todoData"
```

**`TodoTableConstruct`** – DynamoDB table:
- Partition key: `id` (String)
- `RemovalPolicy.DESTROY` — table is deleted on `cdk destroy`

**`TodoLambdasConstruct`** – Lambda functions:
- `NodejsFunction` with automatic esbuild bundling
- Table name passed as `tableName` environment variable
- `readLambdas` and `writeLambdas` arrays for IAM permission management

**`TodoRestApi`** – API Gateway:
- REST API with `ApiKeySourceType.HEADER`
- All routes with `apiKeyRequired: true`
- `ApiKey` + `UsagePlan` with throttling (`10 req/s`, burst `20`) and monthly quota (`1000 requests`)

## File Structure

```
phase-5-aws/
  src/
    app.ts                    ← local test runner with mock events
    lambda/
      LambdaBase.ts           ← abstract base class
      todo/
        create/index.ts
        delete/index.ts
        get-all/index.ts
        get-by-id/index.ts
        mark-done/index.ts
    repositories/
      IRepository.ts          ← unchanged from Phase 3
      AbstractRepository.ts
      DynamoDbRepository.ts   ← new: AWS SDK v3
    services/
      TodoService.ts          ← unchanged from Phase 3/4
    models/
      interfaces/todo.ts
      interfaces/validationResult.ts
      errors/NotFoundError.ts
      errors/ValidationError.ts
  cdk/                        ← CDK infrastructure
  setup-local-dynamo.sh       ← set up DynamoDB Local
```

## Local Testing

```bash
# 1. Start DynamoDB Local
docker run -d -p 8000:8000 amazon/dynamodb-local

# 2. Create table locally
bash setup-local-dynamo.sh

# 3. Run the app with local DynamoDB
DYNAMO_ENDPOINT=http://localhost:8000 npx ts-node src/app.ts
```

## Deployment with CDK

```bash
cd cdk
npm install

# One-time: bootstrap CDK (per account/region)
cdk bootstrap

# Deploy the stack
cdk deploy

# Tear down the stack
cdk destroy
```

## API Endpoints (Deployed)

Base URL: `https://<api-id>.execute-api.eu-west-1.amazonaws.com/prod`

All requests require the header: `x-api-key: <your-api-key>`

| Method | Path | Body | Description |
|---|---|---|---|
| `GET` | `/todos` | – | Retrieve all todos |
| `POST` | `/todos` | `{ "description": "..." }` | Create a new todo |
| `GET` | `/todos/{id}` | – | Retrieve a single todo |
| `PUT` | `/todos/{id}` | – | Mark a todo as done |
| `DELETE` | `/todos/{id}` | – | Delete a todo |

## Core Concept: Repository Swap

The `TodoService` was never modified. In Phase 5, only the repository is swapped:

```
Phase 3/4:  new TodoService(new FileRepository())
Phase 5:    new TodoService(new DynamoDbRepository(tableName, process.env.DYNAMO_ENDPOINT))
```

This demonstrates dependency inversion in practice: the implementation is interchangeable as long as it satisfies the `IRepository<T>` interface.
