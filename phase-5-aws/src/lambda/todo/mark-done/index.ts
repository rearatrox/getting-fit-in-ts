import { LambdaBase } from "@/lambda/LambdaBase";
import { Todo } from "@/models/interfaces/todo";
import { ValidationResult } from "@/models/interfaces/validationResult";
import { TodoService } from "@/services/TodoService";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { StatusCodes } from "http-status-codes";
import { DynamoDbRepository } from "@/repositories/DynamoDbRepository";


/**
 * This class implements the functionality to mark a todo as "done" based on the given event
 * This should be replaced by a generic update lambda but for now its okay :)
 * 
 */
export class MarkDoneTodoLambda extends LambdaBase {
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
            const dynamoDbRepository = new DynamoDbRepository<Todo>("todoData", "http://localhost:8000");
            const todoService = new TodoService(dynamoDbRepository);

            const doneResult = await todoService.done(this.eventId);
            const res: APIGatewayProxyResult = {
                statusCode: StatusCodes.CREATED,
                body: JSON.stringify({ message: "marked todo as 'done' successully.", item: doneResult })
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
    const lambda = new MarkDoneTodoLambda(event);
    return lambda.run();
};