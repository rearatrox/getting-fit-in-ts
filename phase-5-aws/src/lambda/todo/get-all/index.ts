import { LambdaBase } from "@/lambda/LambdaBase";
import { Todo } from "@/models/interfaces/todo";
import { ValidationResult } from "@/models/interfaces/validationResult";
import { TodoService } from "@/services/TodoService";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { StatusCodes } from "http-status-codes";
import { DynamoDbRepository } from "@/repositories/DynamoDbRepository";



/**
 * This class implements the functionality to get all todos based on the given event
 * 
 */
export class GetAllTodosLambda extends LambdaBase {

    /**
     * @inheritdoc
     */
    async validate(): Promise<ValidationResult> {
        return { validated: true };
    }

    /**
 * @inheritdoc
 */
    async process(): Promise<APIGatewayProxyResult> {

        try {
           const tableName = process.env.tableName ?? "todoData";
            const dynamoDbRepository = new DynamoDbRepository<Todo>(tableName, "http://localhost:8000");
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

/**
 * 
 * @param event event of the API Gateway
 * @returns A message result of Type APIGatewayProxyResult in the following shape:
     * ```json
     * {
     *   "statusCode": 200,
     *   "body": "{ message: ..., item: ... }"
     * }
     * ```
*/
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const lambda = new GetAllTodosLambda(event);
    return lambda.run();
};