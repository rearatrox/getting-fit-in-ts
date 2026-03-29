import { ValidationError } from "../errors/ValidationError";
import { Todo } from "@/models/interfaces/todo";
import { TodoService } from "@/services/TodoService";
import { Router } from "express";
import * as z from "zod";

type ApiResponse<T> = {
    statusCode: number,
    timestamp: string,
    message: string,
    item: T,
}

const postBody = z.object({
    description: z.string().min(1),
})



function createTodoRouter(service: TodoService): Router {
    const r = Router();

    r.get('/', async (req, res, next) => {
        try {
            const todos = await service.getAll();
            const response: ApiResponse<Todo[]> = {
                statusCode: 200,
                timestamp: new Date().toISOString(),
                message: "GET todos erfolgreich",
                item: todos
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    });

    r.post('/', async (req, res, next) => {
        try {
            const result = postBody.safeParse(req.body);
            if (!result.success) throw new ValidationError();
            
            const todoId = await service.add(result.data.description);
            const response: ApiResponse<string> = {
                statusCode: 201,
                timestamp: new Date().toISOString(),
                message: "todo angelegt",
                item: todoId
            };
            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    });

    r.get('/:id', async (req, res, next) => {

        try {
            const todo = await service.getById(req.params.id);
            const response: ApiResponse<Todo> = {
                statusCode: 200,
                timestamp: new Date().toISOString(),
                message: "GET todo erfolgreich",
                item: todo
            };
            res.json(response);
        } catch (error) {
            next(error);
        }
    });

    r.patch('/:id/done', async (req, res, next) => {
        try {
            const todo = await service.done(req.params.id);
            const response: ApiResponse<Todo> = {
                statusCode: 200,
                timestamp: new Date().toISOString(),
                message: "todo erfolgreich abgehakt.",
                item: todo
            };
            res.status(200).json(response);

        } catch (error) {
            next(error);
        }
    })

    r.delete('/:id', async (req, res, next) => {
        try {
            const todoId = await service.delete(req.params.id);
            const response: ApiResponse<string> = {
                statusCode: 200,
                timestamp: new Date().toISOString(),
                message: "todo erfolgreich gelöscht.",
                item: todoId
            };
            res.status(200).json(response);

        } catch (error) {
            next(error);
        }
    })

    return r;
}

export { createTodoRouter }