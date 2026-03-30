import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { IRepository } from "./IRepository";

class DynamoDbRepository<T extends { id: string }> implements IRepository<T> {
    private readonly client: DynamoDBDocumentClient;
    private readonly tableName: string;

    constructor(tableName: string, endpoint?: string) {
        const dynamo = new DynamoDBClient({
            region: "eu-west-1",
            ...(endpoint ? { endpoint } : {})
        });
        this.client = DynamoDBDocumentClient.from(dynamo);
        this.tableName = tableName;
    }


    async create(item: T): Promise<T> {
        const createCommand = new PutCommand({
            "TableName": this.tableName,
            "Item": item
        })
        await this.client.send(createCommand);
        return item;
    }

    async update(item: T): Promise<T> {
        return this.create(item);
    }

    async delete(id: string): Promise<string> {
        const command = new DeleteCommand({
            TableName: this.tableName,
            Key: {
                id: id,
            },
        });
        
       await this.client.send(command);
       return id;
    }

    async getAll(): Promise<T[]> {
        const scanCommand = new ScanCommand({
            "TableName": this.tableName,
        });
        const response = await this.client.send(scanCommand);
        return (response.Items ?? []) as unknown as T[];
    }

    async getById(id: string): Promise<T | undefined> {
        const getCommand = new GetCommand({
            "TableName": this.tableName,
            "Key": {
                id: id,
            }
        });
        const response = await this.client.send(getCommand);
        return response.Item as unknown as T | undefined;
    }

}

export {DynamoDbRepository}