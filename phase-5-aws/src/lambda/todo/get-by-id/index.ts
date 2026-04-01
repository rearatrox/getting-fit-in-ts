import { LambdaBase } from "@/lambda/LambdaBase";
import { Todo } from "@/models/interfaces/todo";
import { ValidationResult } from "@/models/interfaces/validationResult";
import { TodoService } from "@/services/TodoService";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { StatusCodes } from "http-status-codes";
import { DynamoDbRepository } from "@/repositories/DynamoDbRepository";

/**
 * This class implements the functionality to get a specific todo based on the given event
 * 
 */
export class GetTodoByIdLambda extends LambdaBase {
    private eventId!: string;

    /**
     * @inheritdoc
     */
    async validate(): Promise<ValidationResult> {
        if (!this.lambdaEvent.pathParameters?.id) {
            return { validated: false };

        } else {
            this.eventId = this.lambdaEvent.pathParameters.id;
            return { validated: true };
        };
    }

    /**
 * @inheritdoc
 */
    async process(): Promise<APIGatewayProxyResult> {

        try {
            const tableName = process.env.tableName ?? "todoData";
            const dynamoDbRepository = new DynamoDbRepository<Todo>(tableName, process.env.DYNAMO_ENDPOINT);
            const todoService = new TodoService(dynamoDbRepository);

            const getIdResult = await todoService.getById(this.eventId);
            const res: APIGatewayProxyResult = {
                statusCode: StatusCodes.OK,
                body: JSON.stringify({ message: "get todo successful.", item: getIdResult })
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
    const lambda = new GetTodoByIdLambda(event);
    return lambda.run();
};