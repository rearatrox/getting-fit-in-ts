import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { IRepository } from "./IRepository";

class DynamoDbRepository<T extends { id: string }> implements IRepository<T> {
    private readonly client: DynamoDBDocumentClient;
    private readonly tableName: string;


    /**
     * 
     * @param tableName tablename of the dynamodb table 
     * @param endpoint optional endpoint for local testing with dynamodb-local
     */
    constructor(tableName: string, endpoint?: string) {
        const dynamo = new DynamoDBClient({
            region: "eu-west-1",
            ...(endpoint ? { endpoint } : {})
        });
        this.client = DynamoDBDocumentClient.from(dynamo);
        this.tableName = tableName;
    }

    /**
     * creates an item with PutCommand in the given table
     * @param item item to be created
     * @returns created item
     */
    async create(item: T): Promise<T> {
        const createCommand = new PutCommand({
            "TableName": this.tableName,
            "Item": item
        })
        await this.client.send(createCommand);
        return item;
    }

    /**
     * creates/updates an item with PutCommand in the given table
     * @param item 
     * @returns updated item
     */
    async update(item: T): Promise<T> {
        return this.create(item);
    }

    /**
     * deletes an item with DeleteCommand in the given table with a given id
     * @param id 
     * @returns id of deleted item
     */
    async delete(id: string): Promise<string> {
        const command = new DeleteCommand({
            TableName: this.tableName,
            Key: {
                id: id,
            },
        });
        
       const result = await this.client.send(command);
       return id;
    }

    /**
     * gets all items of a given table
     * @returns returns all found items of the given table
     */
    async getAll(): Promise<T[]> {
        const scanCommand = new ScanCommand({
            "TableName": this.tableName,
        });
        const response = await this.client.send(scanCommand);
        return (response.Items ?? []) as unknown as T[];
    }

    /**
     * gets a specific item of a given table by a given id
     * @param id identifier
     * @returns returns found item
     */
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