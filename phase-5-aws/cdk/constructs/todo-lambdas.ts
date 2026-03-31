import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";


export class TodoLambdasConstruct extends Construct {

    public readonly createTodoLambda: NodejsFunction;
    public readonly getAllTodosLambda: NodejsFunction;
    public readonly getByIdTodoLambda: NodejsFunction;
    public readonly markDoneTodoLambda: NodejsFunction;
    public readonly deleteTodoLambda: NodejsFunction;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.createTodoLambda = new NodejsFunction(this, 'createTodoLambda', {
            handler: 'handler',
            entry: `${__dirname}/../../src/lambda/todo/create/index.ts`,
        });

        this.getAllTodosLambda = new NodejsFunction(this, 'getAllTodosLambda', {
            handler: 'handler',
            entry: `${__dirname}/../../src/lambda/todo/get-all/index.ts`,
        });

        this.getByIdTodoLambda = new NodejsFunction(this, 'getByIdTodoLambda', {
            handler: 'handler',
            entry: `${__dirname}/../../src/lambda/todo/get-by-id/index.ts`,
        });

        this.markDoneTodoLambda = new NodejsFunction(this, 'markDoneTodoLambda', {
            handler: 'handler',
            entry: `${__dirname}/../../src/lambda/todo/mark-done/index.ts`,
        });

        this.deleteTodoLambda = new NodejsFunction(this, 'deleteTodoLambda', {
            handler: 'handler',
            entry: `${__dirname}/../../src/lambda/todo/delete/index.ts`,
        });
    }
}