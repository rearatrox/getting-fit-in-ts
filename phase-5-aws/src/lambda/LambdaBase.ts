import { ValidationResult } from "@/models/interfaces/validationResult";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { StatusCodes } from "http-status-codes";


/**
 * This class implements the base for every Lambda function which is used.
 * it consists of 3 methods: validate, process and run
 *      > validate() and process() need to be implemented in the sub classes
 *      > run() should be called inside the handler when creating the Lambda object
 */
export abstract class LambdaBase {

    protected readonly lambdaEvent: APIGatewayProxyEvent;

    constructor(event: APIGatewayProxyEvent) {
        this.lambdaEvent = event;
    }

    /**
     * Validates the given APIGatewayProxyEvent
     * @returns A `ValidationResult` in the following shape:
     * ```json
     * {validated: true | false}
     * ```
     */
    abstract validate(): Promise<ValidationResult>;

    /**
     * Processes the given APIGatewayProxyEvent (business logic).
     * @returns A `APIGatewayProxyResult` in the following shape:
     * ```json
     * {
     *   "statusCode": 200,
     *   "body": "{ message: ..., item: ... }"
     * }
     * ```
     */
    abstract process(): Promise<APIGatewayProxyResult>;

    /**
     * orchestrates validate() and process(). 
     * Should be called when instantiating an object of this class.
     * @returns A message result of Type APIGatewayProxyResult in the following shape:
     * ```json
     * {
     *   "statusCode": 200,
     *   "body": "{ message: ..., item: ... }"
     * }
     * ```
     */
    async run(): Promise<APIGatewayProxyResult> {

        try {
            const validationResult = await this.validate();
            if (!validationResult.validated) {
                const badMessageResult: APIGatewayProxyResult = {
                    statusCode: StatusCodes.BAD_REQUEST,
                    body: JSON.stringify({
                        message: validationResult.message ?? "validation was not successful",
                    })
                }
                console.log(badMessageResult);
                return badMessageResult;
            }

            const processResult = await this.process();
            console.log(processResult)
            return processResult;
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