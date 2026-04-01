import { Construct } from "constructs";
import { RestApi, LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { TodoLambdasConstruct } from "./todo-lambdas";


export interface TodoRestApiProps {
    lambdas: TodoLambdasConstruct,
}


export class TodoRestApi extends Construct {

    constructor(scope: Construct, id: string, props: TodoRestApiProps) {
        super(scope, id);

        const lambdas = props.lambdas;
        const api = new RestApi(this, 'TodoApi');
        const todos = api.root.addResource('todos');

        todos.addMethod('GET', new LambdaIntegration(lambdas.getAllTodosLambda));
        todos.addMethod('POST', new LambdaIntegration(lambdas.createTodoLambda));

        const todoById = todos.addResource('{id}');
        todoById.addMethod('GET', new LambdaIntegration(lambdas.getByIdTodoLambda));
        todoById.addMethod('PUT', new LambdaIntegration(lambdas.markDoneTodoLambda));
        todoById.addMethod('DELETE', new LambdaIntegration(lambdas.deleteTodoLambda));

    }
}