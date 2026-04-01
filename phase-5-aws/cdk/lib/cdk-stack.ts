import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { TodoLambdasConstruct } from '../constructs/todo-lambdas';
import { TodoTableConstruct } from '../constructs/todo-table';
import { TodoRestApi } from '../constructs/todo-api';
import { tableName } from '../constants/config';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    /**
     * generates the dynamodb construct (one table atm)
     */
    const todoTableConstruct = new TodoTableConstruct(this, 'TodoTableConstruct', {
      tableName: tableName
    });

    /**
     * generates all necessary lambdas for the todo-servie-stack:
     * create, delete, markAsDone, getAll, getById
     */
    const lambdasConstruct = new TodoLambdasConstruct(this, 'TodoLambdasConstruct', {
      tableName: tableName
    });


    /**
     * grants necessary dynamo permissions for lambdas
     */
    lambdasConstruct.readLambdas.forEach((lambda) => {
      todoTableConstruct.todoTable.grantReadData(lambda);
    })

    lambdasConstruct.writeLambdas.forEach((lambda) => {
      todoTableConstruct.todoTable.grantReadWriteData(lambda);
    })


    /**
     * generates the REST Api construct
     */
    const todoRestApi = new TodoRestApi(this, 'TodoRestApi', {lambdas: lambdasConstruct})

  }
}
