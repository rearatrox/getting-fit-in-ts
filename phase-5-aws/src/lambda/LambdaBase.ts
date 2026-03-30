import { ValidationResult } from "@/models/interfaces/validationResult";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { StatusCodes } from "http-status-codes";

export abstract class LambdaBase {


    private readonly lambdaEvent: APIGatewayProxyEvent;

    constructor(event: APIGatewayProxyEvent) {
        this.lambdaEvent = event;
    }

    abstract validate(): Promise<ValidationResult>;

    abstract execute(): Promise<APIGatewayProxyResult>;

    async startJob(): Promise<APIGatewayProxyResult> {

        try {
            const validationResult = await this.validate();
            if (!validationResult.validated) {
                console.warn('validation was not successful.');
                const badMessageResult: APIGatewayProxyResult = {
                    statusCode: StatusCodes.BAD_REQUEST,
                    body: JSON.stringify({
                        message: validationResult.message ?? "validation was not successful",
                    })
                }
                return badMessageResult
            }

            const executeResult = await this.execute();
            console.log(executeResult)
            return executeResult;
        } catch (error) {
            console.error(`there was an unexpected error.`, error);
            const errorMessage: APIGatewayProxyResult = {
                    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                    body: JSON.stringify({
                        message: "there was an unexpected error.",
                        error: error,
                    })
                }
                return errorMessage;
        }

    }

}