import { Construct } from "constructs";
import {AttributeType, Table} from 'aws-cdk-lib/aws-dynamodb';


export interface TableProps {
    tableName: string,
}


export class TodoTableConstruct extends Construct {

    public readonly todoTable: Table;

    constructor(scope: Construct, id: string, props: TableProps) {
        super(scope, id);


        this.todoTable = new Table(this, 'todoDataTable', {
            tableName: props.tableName,
            partitionKey: {name: "id", type: AttributeType.STRING},
        } )
    }
}