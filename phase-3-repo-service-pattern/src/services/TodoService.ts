import { IRepository } from "@/repositories/IRepository";
import { Todo } from "@/models/interfaces/todo";
import { v4 } from "uuid";

class TodoService {

    constructor(private readonly repository: IRepository<Todo>){};


    /**
     * 
     * @param description description for a new todo
     * @returns id of the created todo
     */
    async add(description: string): Promise<string> {
        const todo: Todo = {
            id: v4(),
            description,
            status: "open",
            createdAt: new Date().toISOString(),
        }

        await this.repository.create(todo);
        return todo.id;
    }

    /**
     * 
     * @returns all todos of the used repository
     */
    async getAll(): Promise<Todo[]>{
        return await this.repository.getAll(); //await theoretisch überflüssig 
    }

    /**
     * Returns a todo by a given id
     * @param id identifier for todo
     * @returns returns todo if found, otherwise throws error
     */
    async getById(id: string): Promise<Todo> {
        const todo = await this.repository.getById(id);
        if(!todo) {
            throw new Error(`todo mit ${id} nicht gefunden.`);
        } else {
            return todo;
        }
    }

    /**
     * Gets required todo and changes its status to "done"
     * @param id identifier for todo
     * @returns returns deleted todo if found, otherwise throws error
     */
    async done(id: string): Promise<Todo> {
        const todo = await this.repository.getById(id);
        if(!todo) {
            throw new Error(`todo mit ${id} nicht gefunden.`);
        } else {
            todo.status = "done";
            return await this.repository.update(todo);
        }
    }

    /**
     * deletes a todo by a given id
     * @param id identifier for todo
     * @returns returns delete todo id if found, otherwise throws error
     */
    async delete(id: string): Promise<string> {
        try {
            return await this.repository.delete(id);
        } catch {
            throw new Error(`todo mit ${id} nicht gefunden.`)
        }
    }
}

export {TodoService}