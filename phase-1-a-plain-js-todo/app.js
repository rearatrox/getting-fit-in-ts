// Phase 1a – Plain JavaScript Todo-CLI
// Ziel: Ein funktionierendes Todo-Tool in reinem JS schreiben – bewusst ohne Typsystem.
// Befehle: add, list, done, delete
// Persistenz: todos.json via fs/promises
// Erkenntnis: Fehlende Typsicherheit (Status-Werte, Objektstruktur) wird in Phase 1b durch TypeScript gelöst.

import fs from 'fs/promises';
import { v4 } from "uuid";

/** 
 * add function to create a new todo, id is automatically created with uuid v4
 * @param {string} title
 * @param {string} [description=""] 
 * @param {string} [status="open"]  
 * @param {string} [createdAt=new Date().toISOString()] 
 * @returns {object}
*/
async function addNote(title, description = "", status = "open", createdAt = new Date().toISOString()) {
    const Todo = {
        id: v4(),
        title: title,
        description: description,
        status: status,
        createdAt: createdAt,
    }

    let file;
    try {
        file = await fs.readFile("./todos.json");
    }
    catch {
        file = "[]";
    }

    let fileArray = JSON.parse(file);
    fileArray.push(Todo);

    await fs.writeFile("./todos.json", JSON.stringify(fileArray, null, 2), "utf-8");
    console.log(`todo created: ${JSON.stringify(Todo)}`);
}

/**
 * listNote lists a note with a given id
 * @param {v4} id 
 * @returns {object}
 */
async function listNote(id) {
    let file;
    try {
        file = await fs.readFile("./todos.json");
    }
    catch {
        throw new Error("Datei nicht gefunden.");
    }

    let fileArray = JSON.parse(file);
    console.log(fileArray.find(todo => todo.id === id));
}

/**
 * listNotes lists all notes
 * @returns 
 */
async function listNotes() {
    let file;
    try {
        file = await fs.readFile("./todos.json");
    }
    catch {
        throw new Error("Datei nicht gefunden.");
    }

    console.log(JSON.parse(file));
}

/**
 * updates the status of a note to "done"
 * @param {v4} id 
 * @returns
 */
async function markNoteAsDone(id) {
    let file;
    try {
        file = await fs.readFile("./todos.json");
        let fileArray = JSON.parse(file);
        let todo = fileArray.find(item => item.id === id);

        if (!todo) return "todo nicht gefunden";
        todo.status = "done";

        await fs.writeFile("./todos.json", JSON.stringify(fileArray, null, 2), "utf-8");
        console.log(`status updated: ${JSON.stringify(todo)}`);
    }
    catch {
        throw new Error("Datei nicht gefunden.");
    }
}

/**
 * deletes a note with a given id
 * @param {v4} id 
 * @returns {object}
 */
async function deleteNote(id) {
    let file;
    try {
        file = await fs.readFile("./todos.json");
        let fileArray = JSON.parse(file);
        let todoIndex = fileArray.findIndex(item => item.id === id);
        let todoToDelete = fileArray[todoIndex];

        if (todoIndex === -1) return console.log("todo nicht gefunden");
        fileArray.splice(todoIndex, 1);

        await fs.writeFile("./todos.json", JSON.stringify(fileArray, null, 2), "utf-8");
        console.log(`todo deleted: ${JSON.stringify(todoToDelete)}`);
    }
    catch {
        throw new Error("Datei nicht gefunden.");
    }
}


switch (process.argv[2]) {
    case "add":
        await addNote(process.argv[3], process.argv[4]);
        break;
    case "list":
        process.argv[3] ? await listNote(process.argv[3]) : await listNotes();
        break;
    case "done":
        await markNoteAsDone(process.argv[3]);
        break;
    case "delete":
        await deleteNote(process.argv[3]);
        break;
    default:
        console.log("Bitte geeignete Parameter eingeben!");
        break;
}