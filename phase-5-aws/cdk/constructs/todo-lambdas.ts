import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { LogGroup } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";
import { defaultLogGroupProps } from "../constants/config";
import { createLogGroupName, createResourceName } from "../utils.ts/resourceName";

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

        const createIdentifier = 'create-todo';
        this.createTodoLambda = new NodejsFunction(this, 'createTodoLambda', {
            functionName: createResourceName(createIdentifier),
            handler: 'handler',
            entry: `${__dirname}/../../src/lambda/todo/create/index.ts`,
            environment: { tableName: props.tableName },
            logGroup: new LogGroup(this, 'createTodoLambdaLogGroup', {
                logGroupName: createLogGroupName(createIdentifier),
                ...defaultLogGroupProps,
            }),
        });

        const getAllIdentifier = 'get-all-todos';
        this.getAllTodosLambda = new NodejsFunction(this, 'getAllTodosLambda', {
            functionName: createResourceName(getAllIdentifier),
            handler: 'handler',
            entry: `${__dirname}/../../src/lambda/todo/get-all/index.ts`,
            environment: { tableName: props.tableName },
            logGroup: new LogGroup(this, 'getAllTodosLambdaLogGroup', {
                logGroupName: createLogGroupName(getAllIdentifier),
                ...defaultLogGroupProps,
            }),
        });

        const getByIdIdentifier = 'get-by-id-todo';
        this.getByIdTodoLambda = new NodejsFunction(this, 'getByIdTodoLambda', {
            functionName: createResourceName(getByIdIdentifier),
            handler: 'handler',
            entry: `${__dirname}/../../src/lambda/todo/get-by-id/index.ts`,
            environment: { tableName: props.tableName },
            logGroup: new LogGroup(this, 'getByIdTodoLambdaLogGroup', {
                logGroupName: createLogGroupName(getByIdIdentifier),
                ...defaultLogGroupProps,
            }),
        });

        const markDoneIdentifier = 'mark-done-todo';
        this.markDoneTodoLambda = new NodejsFunction(this, 'markDoneTodoLambda', {
            functionName: createResourceName(markDoneIdentifier),
            handler: 'handler',
            entry: `${__dirname}/../../src/lambda/todo/mark-done/index.ts`,
            environment: { tableName: props.tableName },
            logGroup: new LogGroup(this, 'markDoneTodoLambdaLogGroup', {
                logGroupName: createLogGroupName(markDoneIdentifier),
                ...defaultLogGroupProps,
            }),
        });

        const deleteIdentifier = 'delete-todo';
        this.deleteTodoLambda = new NodejsFunction(this, 'deleteTodoLambda', {
            functionName: createResourceName(deleteIdentifier),
            handler: 'handler',
            entry: `${__dirname}/../../src/lambda/todo/delete/index.ts`,
            environment: { tableName: props.tableName },
            logGroup: new LogGroup(this, 'deleteTodoLambdaLogGroup', {
                logGroupName: createLogGroupName(deleteIdentifier),
                ...defaultLogGroupProps,
            }),
        });

        this.readLambdas = [this.getAllTodosLambda, this.getByIdTodoLambda];
        this.writeLambdas = [this.createTodoLambda, this.deleteTodoLambda, this.markDoneTodoLambda];
    }
}