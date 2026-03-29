import { NotFoundError } from "../errors/NotFoundError";
import { ValidationError } from "../errors/ValidationError";
import { Request, Response, NextFunction } from "express";

function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
    if (err instanceof NotFoundError || err instanceof ValidationError) {
        return res.status(err.statusCode).json({ statusCode: err.statusCode, message: err.message});
    } else {
        return res.status(500).json({ statusCode: 500, message: "Interner Serverfehler."});
    }
}

export {errorHandler};