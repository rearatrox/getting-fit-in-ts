import { Todo } from "./models/interfaces/todo";
import { v4 } from "uuid";
import * as fs from "fs/promises";

class Todos<TData> {
    private todos: Todo<TData>[];
    public readonly fileName = "./todos.json";

    public constructor() {
        this.todos = [];
    }

    /**
     * loads file "todos.json" with todos and stores them inside class
     */
    public async loadFile() {
        try {
            const file = await fs.readFile(this.fileName);
            this.todos = JSON.parse(file.toString());
        }
        catch {
            this.todos = [];
        }

    }
    /**
     * saves class todos to file "todos.json"
     * throws error if saving is not successful
     */
    public async saveFile(): Promise<void> {
        try {
            await fs.writeFile(this.fileName, JSON.stringify(this.todos, null, 2), "utf-8");
        } catch (error) {
            throw new Error(`Failed to save todos: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * 
     * @param description description of the todo, e.g. "Aufräumen"
     * @param data optional data like Metadata, Tags, ...
     * @returns id of the added todo
     */
    public add(description: string, data: TData): string {

        const id = v4();
        const todo: Todo<TData> = {
            id,
            description,
            status: "open",
            createdAt: new Date().toISOString(),
            data
        }

        this.todos.push(todo);
        return id;
    }
    /**
     * 
     * @param id id of the todo to be listed, if not present Error is thrown
     * @returns todo 
     */
    public list(id?: string): Todo<TData> {
        let todo = this.todos.find(todo => todo.id === id)
        if (todo) {
            return todo;
        } else {
            throw new Error(`Failed to find todo with id ${id}`);
        }
    }

    /**
     * 
     * @returns all todos
     */
    public listAll(): Todo<TData>[] {
        return this.todos;
    }

    /**
     * 
     * @param id sets the status of a todo to "done" according to the given id
     * @returns todo
     */
    public done(id: string): Todo<TData> {
        let todo = this.todos.find(todo => todo.id === id)
        if (todo) {
            todo.status = "done";
            return todo;
        } else {
            throw new Error(`Failed to find todo with id ${id}`);
        }
    }

    /**
     * 
     * @param id  deletes a todo according to the given id
     * @returns id of deleted todo
     */
    public delete(id: string): string {
        let todoIndex = this.todos.findIndex(todo => todo.id === id)
        let todo = this.todos[todoIndex];

        if (todo) {
            this.todos.splice(todoIndex, 1);
            return todo.id;
        } else {
            throw new Error(`Failed to delete todo with id ${id}`);
        }
    }
}

export { Todos }