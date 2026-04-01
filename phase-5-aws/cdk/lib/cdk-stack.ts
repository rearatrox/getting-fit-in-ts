import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { TodoLambdasConstruct } from '../constructs/todo-lambdas';
import { TodoTableConstruct } from '../constructs/todo-table';
import { TodoRestApi } from '../constructs/todo-api';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here


    // tableName in env/config auslagern
    const TABLE_NAME = "todoData";

    const todoTableConstruct = new TodoTableConstruct(this, 'TodoTableConstruct', {
      tableName: TABLE_NAME
    });

    const lambdasConstruct = new TodoLambdasConstruct(this, 'TodoLambdasConstruct', {
      tableName: TABLE_NAME
    });


    lambdasConstruct.readLambdas.forEach((lambda) => {
      todoTableConstruct.todoTable.grantReadData(lambda);
    })

    lambdasConstruct.writeLambdas.forEach((lambda) => {
      todoTableConstruct.todoTable.grantReadWriteData(lambda);
    })


    //Rest API
    const todoRestApi = new TodoRestApi(this, 'TodoRestApi', {lambdas: lambdasConstruct})

  }
}
