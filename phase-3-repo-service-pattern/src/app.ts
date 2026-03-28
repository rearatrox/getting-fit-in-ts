import { Todo } from "./models/interfaces/todo";
import { FileRepository } from "./repositories/FileRepository";
import { TodoService } from "./services/TodoService";


// Repo und Service initialisieren mittels IIFE-Gerüst
//IIFE - Immediately Invoked Function expression
(async () => {
    const fileRepo = await FileRepository.create<Todo>();
    const todoService = new TodoService(fileRepo)


    //CLI-Switch
    switch (process.argv[2]) {
            case "add":
                // Spielerei mit extra optionalen Interfaces
                if (process.argv[3]) {
                    const id = await todoService.add(process.argv[3]);
                    console.log(`Notiz hinzugefügt: ${id}`);
                } else {
                    console.warn("Bitte eine Beschreibung eingeben");
                }
                break;
            case "list":

                if (process.argv[3]) {
                    const todo = await todoService.getById(process.argv[3]);
                    console.log(`${JSON.stringify(todo, null, 2)}`);
                } else {
                    const todos = await todoService.getAll();
                    console.log(`${JSON.stringify(todos, null, 2)}`);
                }
                break;

            case "done":
                if (process.argv[3]) {
                    const todo = await todoService.done(process.argv[3]);
                    console.log(`${JSON.stringify(todo, null, 2)}`);
                } else {
                    console.warn("Bitte eine id eingeben");
                }
                break;

            case "delete":
                if (process.argv[3]) {
                    const id = await todoService.delete(process.argv[3]);
                    console.log(`${id}`);
                } else {
                    console.warn("Bitte eine id eingeben");
                }
                break;
            default:
                console.warn("Bitte geeignete Parameter eingeben!");
                break;
        }
})(); 



