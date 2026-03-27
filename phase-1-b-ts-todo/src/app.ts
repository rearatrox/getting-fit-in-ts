// Phase 1a – Plain JavaScript Todo-CLI
// Ziel: Ein funktionierendes Todo-Tool in reinem JS schreiben – bewusst ohne Typsystem.
// Befehle: add, list, done, delete
// Persistenz: todos.json via fs/promises
// Erkenntnis: Fehlende Typsicherheit (Status-Werte, Objektstruktur) wird in Phase 1b durch TypeScript gelöst.

import * as fs from 'fs/promises';
import { v4 } from "uuid";
import {Todo} from './models/interfaces/todo';


/** 
 * add function to create a new todo, id is automatically created with uuid v4
 * @param {string} title
 * @param {string} [description=""] 
 * @param {string} [status="open"]  
 * @param {string} [createdAt=new Date().toISOString()] 
 * @returns {object}
*/
async function addNote(title: string, description: string = ""): Promise<void> {
    const todo: Todo = {
        id: v4(),
        title: title,
        description: description,
        status: "open",
        createdAt: new Date().toISOString(),
    };

    let file;
    try {
        file = await fs.readFile("./todos.json");
    }
    catch {
        file = "[]";
    }

    let fileArray: Todo[] = JSON.parse(file.toString());
    fileArray.push(todo);

    await fs.writeFile("./todos.json", JSON.stringify(fileArray, null, 2), "utf-8");
    console.log(`todo created: ${JSON.stringify(todo)}`);
}

/**
 * listNote lists a note with a given id
 * @param {v4} id 
 * @returns {Promise<void>}
 */
async function listNote(id: string): Promise<void> {
    let file;
    try {
        file = await fs.readFile("./todos.json");
    }
    catch {
        throw new Error("Datei nicht gefunden.");
    }

    let fileArray: Todo[] = JSON.parse(file.toString());
    console.log(fileArray.find(todo => todo.id === id));
}

/**
 * listNotes lists all notes
 * @returns 
 */
async function listNotes(): Promise<void> {
    let file;
    try {
        file = await fs.readFile("./todos.json");
    }
    catch {
        throw new Error("Datei nicht gefunden.");
    }

    console.log(JSON.parse(file.toString()));
}

/**
 * updates the status of a note to "done"
 * @param {v4} id 
 * @returns
 */
async function markNoteAsDone(id: string) {
    let file;
    try {
        file = await fs.readFile("./todos.json");
        let fileArray: Todo[] = JSON.parse(file.toString());
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
async function deleteNote(id: string) {
    let file;
    try {
        file = await fs.readFile("./todos.json");
        let fileArray: Todo[] = JSON.parse(file.toString());
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


(async () => {
    switch (process.argv[2]) {
        case "add":

            process.argv[3] ? await addNote(process.argv[3], process.argv[4]) : console.warn("Bitte einen Titel eingeben");
            break;
        case "list":
            process.argv[3] ? await listNote(process.argv[3]) : await listNotes();
            break;
        case "done":
            process.argv[3] ? await markNoteAsDone(process.argv[3]) : console.warn("Bitte eine id eingeben");
            break;
        case "delete":
            process.argv[3] ? await deleteNote(process.argv[3]) : console.warn("Bitte eine id eingeben");
            break;
        default:
            console.warn("Bitte geeignete Parameter eingeben!");
            break;
    }
})();