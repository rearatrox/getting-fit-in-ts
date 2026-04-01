# Phase 1a – Plain JavaScript Todo CLI

## Goal
Write a working Todo CLI tool in plain JavaScript — intentionally without a type system. This phase serves as the starting point and demonstrates the problems that arise without TypeScript.

## What Was Implemented

### Commands
| Command | Description |
|---|---|
| `node app.js add <title> [description]` | Create a new todo |
| `node app.js list` | Show all todos |
| `node app.js list <id>` | Show a single todo |
| `node app.js done <id>` | Mark a todo as done |
| `node app.js delete <id>` | Delete a todo |

### Technical Implementation
- **Persistence:** `todos.json` via `fs/promises`
- **IDs:** `uuid v4`
- **Top-level `await`** enabled via `"type": "module"` in `package.json`
- All functions are `async` since file access is asynchronous

### File Structure
```
app.js         ← all functions + CLI switch block
todos.json     ← generated at runtime
```

## Identified Problems (Motivation for Phase 1b)

- **No type safety:** `status` can be any string — `"oepn"` would be just as valid as `"open"`
- **No object structure:** The `Todo` object is not defined — each function builds it ad-hoc
- **No autocompletion:** The IDE has no knowledge of which fields a todo has
- **No compile errors:** Typos or wrong types only surface at runtime
