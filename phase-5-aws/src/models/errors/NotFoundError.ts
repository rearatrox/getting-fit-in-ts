class NotFoundError extends Error {
    public readonly statusCode = 404;

    constructor(message: string = "Ressource nicht gefunden") {
        super(message)
    }
}

export {NotFoundError};