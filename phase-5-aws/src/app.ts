//lambda handler einstiegspunkt
import { APIGatewayProxyEvent } from "aws-lambda";
import { handler as getAllHandler } from "./lambda/todo/get-all";
import { handler as createHandler } from "./lambda/todo/create";
import { handler as markDoneHandler } from "./lambda/todo/mark-done";
import { handler as deleteHandler } from "./lambda/todo/delete";
import { handler as getByIdHandler } from "./lambda/todo/get-by-id";

const TEST_ID = "cc084668-c260-4d43-9549-2d73595add4f";

const mockGetAllEvent: APIGatewayProxyEvent = {
    body: null,
    headers: {},
    multiValueHeaders: {},
    httpMethod: "GET",
    isBase64Encoded: false,
    path: "/todos",
    pathParameters: null,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: {} as any,
    resource: ""
};

const mockCreateEvent: APIGatewayProxyEvent = {
    body: JSON.stringify({ desciption: "Lokaler DynamoDB Test" }),
    headers: {},
    multiValueHeaders: {},
    httpMethod: "POST",
    isBase64Encoded: false,
    path: "/todos",
    pathParameters: null,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: {} as any,
    resource: ""
};

const mockMarkDoneEvent: APIGatewayProxyEvent = {
    body: null,
    headers: {},
    multiValueHeaders: {},
    httpMethod: "PATCH",
    isBase64Encoded: false,
    path: `/todos/${TEST_ID}/done`,
    pathParameters: { id: TEST_ID },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: {} as any,
    resource: ""
};

const mockDeleteEvent: APIGatewayProxyEvent = {
    body: null,
    headers: {},
    multiValueHeaders: {},
    httpMethod: "DELETE",
    isBase64Encoded: false,
    path: `/todos/${TEST_ID}`,
    pathParameters: { id: TEST_ID },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: {} as any,
    resource: ""
};

const mockGetByIdEvent: APIGatewayProxyEvent = {
    body: null,
    headers: {},
    multiValueHeaders: {},
    httpMethod: "GET",
    isBase64Encoded: false,
    path: `/todos/${TEST_ID}`,
    pathParameters: { id: TEST_ID },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: {} as any,
    resource: ""
};

(async () => {
    console.log("--- CREATE ---");
    await createHandler(mockCreateEvent);

    console.log("--- GET ALL ---");
    await getAllHandler(mockGetAllEvent);

    console.log("--- GET BY ID ---");
    await getByIdHandler(mockGetByIdEvent);

    console.log("--- MARK DONE ---");
    await markDoneHandler(mockMarkDoneEvent);

    console.log("--- DELETE ---");
    await deleteHandler(mockDeleteEvent);
})();


