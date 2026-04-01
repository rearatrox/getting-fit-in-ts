import { Construct } from "constructs";
import { RestApi, LambdaIntegration, ApiKey, UsagePlan, ApiKeySourceType, Period } from "aws-cdk-lib/aws-apigateway";
import { TodoLambdasConstruct } from "./todo-lambdas";


export interface TodoRestApiProps {
    lambdas: TodoLambdasConstruct,
}


export class TodoRestApi extends Construct {

    constructor(scope: Construct, id: string, props: TodoRestApiProps) {
        super(scope, id);

        const lambdas = props.lambdas;
        const api = new RestApi(this, 'TodoApi', {
            apiKeySourceType: ApiKeySourceType.HEADER,
        });

        const todos = api.root.addResource('todos');
        todos.addMethod('GET', new LambdaIntegration(lambdas.getAllTodosLambda), { apiKeyRequired: true });
        todos.addMethod('POST', new LambdaIntegration(lambdas.createTodoLambda), { apiKeyRequired: true });

        const todoById = todos.addResource('{id}');
        todoById.addMethod('GET', new LambdaIntegration(lambdas.getByIdTodoLambda), { apiKeyRequired: true });
        todoById.addMethod('PUT', new LambdaIntegration(lambdas.markDoneTodoLambda), { apiKeyRequired: true });
        todoById.addMethod('DELETE', new LambdaIntegration(lambdas.deleteTodoLambda), { apiKeyRequired: true });


        // added for security reasons (crawler/ddos attacks against api)
        const apiKey = new ApiKey(this, 'TodoApiKey', {
            description: 'API Key für persönlichen Zugriff',
        });

        const usagePlan = new UsagePlan(this, 'TodoUsagePlan', {
            name: 'TodoUsagePlan',
            throttle: {
                rateLimit: 10,
                burstLimit: 20,
            },
            quota: {
                limit: 1000,
                period: Period.MONTH,
            },
        });

        usagePlan.addApiKey(apiKey);
        usagePlan.addApiStage({ api, stage: api.deploymentStage });
    }
}