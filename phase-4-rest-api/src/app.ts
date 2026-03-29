import { errorHandler } from "./middleware/errorHandler";
import { Todo } from "./models/interfaces/todo";
import { FileRepository } from "./repositories/FileRepository";
import { createTodoRouter } from "./routes/todoRoutes";
import { TodoService } from "./services/TodoService";

import express from "express";


const app = express();
app.use(express.json());

// Repo und Service initialisieren mittels IIFE-Gerüst
//IIFE - Immediately Invoked Function expression
(async () => {
    const fileRepo = await FileRepository.create<Todo>();
    const todoService = new TodoService(fileRepo)
    const router = createTodoRouter(todoService);

    app.use("/api/todo", router);
    app.use(errorHandler)
    app.listen(3000);
    console.log("Server läuft auf Port 3000");

})(); 



