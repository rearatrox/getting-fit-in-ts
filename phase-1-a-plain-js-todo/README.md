# Phase 1a – Plain JavaScript Todo-CLI

## Ziel
Ein funktionierendes Todo-CLI-Tool in reinem JavaScript schreiben – bewusst ohne Typsystem. Diese Phase dient als Ausgangspunkt und zeigt, welche Probleme ohne TypeScript entstehen.

## Was wurde implementiert

### Befehle
| Befehl | Beschreibung |
|---|---|
| `node app.js add <title> [description]` | Neues Todo erstellen |
| `node app.js list` | Alle Todos anzeigen |
| `node app.js list <id>` | Einzelnes Todo anzeigen |
| `node app.js done <id>` | Todo als erledigt markieren |
| `node app.js delete <id>` | Todo löschen |

### Technische Umsetzung
- **Persistenz:** `todos.json` via `fs/promises`
- **IDs:** `uuid v4`
- **Top-Level `await`** möglich durch `"type": "module"` in `package.json`
- Alle Funktionen sind `async`, da Dateizugriffe asynchron sind

### Dateistruktur
```
app.js         ← alle Funktionen + CLI-Switch-Block
todos.json     ← generierte Datei zur Laufzeit
```

## Erkannte Probleme (Motivation für Phase 1b)

- **Keine Typsicherheit:** `status` kann jeden beliebigen String annehmen – `"oepn"` wäre genauso gültig wie `"open"`
- **Keine Objektstruktur:** Das `Todo`-Objekt ist nicht definiert – jede Funktion baut es ad-hoc zusammen
- **Kein Autovervollständigung:** Die IDE weiß nicht, welche Felder ein Todo hat
- **Kein Compile-Fehler:** Tippfehler oder falsche Typen fallen erst zur Laufzeit auf
