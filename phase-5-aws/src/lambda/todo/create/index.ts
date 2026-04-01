import { LambdaBase } from "@/lambda/LambdaBase";
import { Todo } from "@/models/interfaces/todo";
import { ValidationResult } from "@/models/interfaces/validationResult";
import { TodoService } from "@/services/TodoService";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { StatusCodes } from "http-status-codes";
import { DynamoDbRepository } from "@/repositories/DynamoDbRepository";


/**
 * This class implements the functionality to create a todo based on the given event
 * 
 */
export class CreateTodoLambda extends LambdaBase {

    private parsedEvent!: { description: string };

    /**
     * @inheritdoc
     */
    async validate(): Promise<ValidationResult> {

        if (!this.lambdaEvent.body) return {validated: false};
        this.parsedEvent = JSON.parse(this.lambdaEvent.body);

        if (this.parsedEvent.description && this.parsedEvent.description.length > 0) {
            return {validated: true};
        } else return {validated: false};
    }

    /**
     * @inheritdoc
     */
    async process(): Promise<APIGatewayProxyResult> {

        try {
            const tableName = process.env.tableName ?? "todoData";
            const dynamoDbRepository = new DynamoDbRepository<Todo>(tableName, process.env.DYNAMO_ENDPOINT);
            const todoService = new TodoService(dynamoDbRepository);

            const createResult = await todoService.add(this.parsedEvent.description);
            const res: APIGatewayProxyResult = {
                statusCode: StatusCodes.CREATED,
                body: JSON.stringify({ message: "add todo successful.", item: createResult })
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
    const lambda = new CreateTodoLambda(event);
    return lambda.run();
};