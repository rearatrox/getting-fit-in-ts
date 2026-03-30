import { LambdaBase } from "src/lambda/LambdaBase";
import { Todo } from "@/models/interfaces/todo";
import { ValidationResult } from "@/models/interfaces/validationResult";
import { TodoService } from "@/services/TodoService";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { StatusCodes } from "http-status-codes";
import { DynamoDbRepository } from "@/repositories/DynamoDbRepository";


export class GetAllEventsLambda extends LambdaBase {


    async validate(): Promise<ValidationResult> {
        return { validated: true };
    }

    async execute(): Promise<APIGatewayProxyResult> {

        try {
            const dynamoDbRepository = new DynamoDbRepository<Todo>("todoData", "http://localhost:8000");
            const todoService = new TodoService(dynamoDbRepository);

            const getAllResult = await todoService.getAll();
            const res: APIGatewayProxyResult = {
                statusCode: StatusCodes.OK,
                body: JSON.stringify({ message: "get todos successful.", item: getAllResult })
            }

            return res;
        } catch (error) {
                const res: APIGatewayProxyResult = {
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                body: JSON.stringify({ message: "internal server error.", error: error })
            }
            return res;
        }
    }
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const lambda = new GetAllEventsLambda(event);
    return lambda.startJob();
};