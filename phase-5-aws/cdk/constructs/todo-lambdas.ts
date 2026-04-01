import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";


export interface LambdaProps {
    tableName: string,
}

export class TodoLambdasConstruct extends Construct {

    public readonly createTodoLambda: NodejsFunction;
    public readonly getAllTodosLambda: NodejsFunction;
    public readonly getByIdTodoLambda: NodejsFunction;
    public readonly markDoneTodoLambda: NodejsFunction;
    public readonly deleteTodoLambda: NodejsFunction;

    public readonly readLambdas: NodejsFunction[];
    public readonly writeLambdas: NodejsFunction[];

    constructor(scope: Construct, id: string, props: LambdaProps) {
        super(scope, id);

        // could be minimalized using a small helper function, but its good for now :)

        this.createTodoLambda = new NodejsFunction(this, 'createTodoLambda', {
            handler: 'handler',
            entry: `${__dirname}/../../src/lambda/todo/create/index.ts`,
            environment: {
                tableName: props.tableName,
            }
        });

        this.getAllTodosLambda = new NodejsFunction(this, 'getAllTodosLambda', {
            handler: 'handler',
            entry: `${__dirname}/../../src/lambda/todo/get-all/index.ts`,
            environment: {
                tableName: props.tableName,
            }
        });

        this.getByIdTodoLambda = new NodejsFunction(this, 'getByIdTodoLambda', {
            handler: 'handler',
            entry: `${__dirname}/../../src/lambda/todo/get-by-id/index.ts`,
            environment: {
                tableName: props.tableName,
            }
        });

        this.markDoneTodoLambda = new NodejsFunction(this, 'markDoneTodoLambda', {
            handler: 'handler',
            entry: `${__dirname}/../../src/lambda/todo/mark-done/index.ts`,
            environment: {
                tableName: props.tableName,
            }
        });

        this.deleteTodoLambda = new NodejsFunction(this, 'deleteTodoLambda', {
            handler: 'handler',
            entry: `${__dirname}/../../src/lambda/todo/delete/index.ts`,
            environment: {
                tableName: props.tableName,
            }
        });

        this.readLambdas = [this.getAllTodosLambda, this.getByIdTodoLambda];
        this.writeLambdas = [this.createTodoLambda, this.deleteTodoLambda, this.markDoneTodoLambda];

    }
}