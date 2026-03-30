class ValidationError extends Error {
    public readonly statusCode = 400;
    
    constructor(message: string = "Anfrage konnte nicht validiert werden") {
        super(message)
    }
}

export {ValidationError};