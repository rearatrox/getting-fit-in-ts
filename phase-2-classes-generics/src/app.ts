import { TagMeta } from "./models/interfaces/todo";
import { Todos } from "./TodoClass";



const todoManager = new Todos<void | TagMeta>();

(async () => {
    try {
        console.log("Aktuelle Todos laden...");
        await todoManager.loadFile();
        switch (process.argv[2]) {
            case "add":
                // Spielerei mit extra optionalen Interfaces
                if (process.argv[3] && process.argv[4]) {
                    const id = await todoManager.add(process.argv[3], JSON.parse(process.argv[4]) as TagMeta);
                    console.log(`Notiz mit Tag-Metadata hinzugefügt: ${id}`);
                } else if (process.argv[3]) {
                    const id = await todoManager.add(process.argv[3]);
                    console.log(`Notiz hinzugefügt: ${id}`);
                } else {
                    console.warn("Bitte eine Beschreibung eingeben");
                }
                break;
            case "list":

                if (process.argv[3]) {
                    const todo = await todoManager.list(process.argv[3]);
                    console.log(`${JSON.stringify(todo, null, 2)}`);
                } else {
                    const todos = await todoManager.listAll();
                    console.log(`${JSON.stringify(todos, null, 2)}`);
                }
                break;

            case "done":
                if (process.argv[3]) {
                    const todo = await todoManager.done(process.argv[3]);
                    console.log(`${JSON.stringify(todo, null, 2)}`);
                } else {
                    console.warn("Bitte eine id eingeben");
                }
                break;

            case "delete":
                if (process.argv[3]) {
                    const id = await todoManager.delete(process.argv[3]);
                    console.log(`${id}`);
                } else {
                    console.warn("Bitte eine id eingeben");
                }
                break;
            default:
                console.warn("Bitte geeignete Parameter eingeben!");
                break;
        }
        console.log("Aktuelle Todos speichern...");
        await todoManager.saveFile();
    } catch (error) {
        console.error("Fehler: ", error);
    }
    
})();