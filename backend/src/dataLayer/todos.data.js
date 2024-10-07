import AWS from "aws-sdk";

const docClient = new AWS.DynamoDB.DocumentClient();
const s3Client = new AWS.S3({ signatureVersion: 'v4' });

export async function createToDoData(todoItem) {
  console.log("Creating new todo");

  const params = {
    TableName: process.env.TODOS_TABLE,
    Item: todoItem,
  };

  const result = await docClient.put(params).promise();
  console.log(result);

  return todoItem;
}

export async function updateToDoData(todoUpdate, todoId, userId) {
  console.log("Updating todo");

  const params = {
    TableName: process.env.TODOS_TABLE,
    Key: {
      userId: userId,
      todoId: todoId,
    },
    UpdateExpression: "set #a = :a, #b = :b, #c = :c",
    ExpressionAttributeNames: {
      "#a": "name",
      "#b": "dueDate",
      "#c": "done",
    },
    ExpressionAttributeValues: {
      ":a": todoUpdate["name"],
      ":b": todoUpdate["dueDate"],
      ":c": todoUpdate["done"],
    },
    ReturnValues: "ALL_NEW",
  };

  const result = await docClient.update(params).promise();
  console.log("updateToDoData", result);
  const attributes = result.Attributes;

  return attributes;
}

export async function deleteToDoData(todoId, userId) {
  console.log("Deleting todo");

  const params = {
    TableName: process.env.TODOS_TABLE,
    Key: {
      userId: userId,
      todoId: todoId,
    },
  };

  const result = await docClient.delete(params).promise();
  console.log(result);

  return result;
}

export async function generateUploadUrlData(todoId) {
  console.log("Generating URL");

  const url = s3Client.getSignedUrl("putObject", {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: todoId,
    Expires: 1000,
  });
  console.log(url);

  return url;
}

export async function getAllToDoData(userId) {
  console.log("Getting all todo");

  const params = {
    TableName: process.env.TODOS_TABLE,
    KeyConditionExpression: "#userId = :userId",
    ExpressionAttributeNames: {
      "#userId": "userId",
    },
    ExpressionAttributeValues: {
      ":userId": userId,
    },
  };

  const result = await docClient.query(params).promise();
  console.log(result);
  const items = result.Items;

  return items;
}
// export class ToDoAccess {
//     constructor(
//         private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
//         private readonly s3Client: Types = new AWS.S3({ signatureVersion: 'v4' }),
//         private readonly todoTable = process.env.TODOS_TABLE,
//         private readonly s3BucketName = process.env.S3_BUCKET_NAME) {
//     }

//     async getAllToDo(userId: string): Promise<TodoItem[]> {
//         console.log("Getting all todo");

//         const params = {
//             TableName: this.todoTable,
//             KeyConditionExpression: "#userId = :userId",
//             ExpressionAttributeNames: {
//                 "#userId": "userId"
//             },
//             ExpressionAttributeValues: {
//                 ":userId": userId
//             }
//         };

//         const result = await docClient.query(params).promise();
//         console.log(result);
//         const items = result.Items;

//         return items as TodoItem[];
//     }

//     async createToDo(todoItem: TodoItem): Promise<TodoItem> {
//         console.log("Creating new todo");

//         const params = {
//             TableName: this.todoTable,
//             Item: todoItem,
//         };

//         const result = await docClient.put(params).promise();
//         console.log(result);

//         return todoItem as TodoItem;
//     }

//     async updateToDo(todoUpdate: TodoUpdate, todoId: string, userId: string): Promise<TodoUpdate> {
//         console.log("Updating todo");

//         const params = {
//             TableName: this.todoTable,
//             Key: {
//                 "userId": userId,
//                 "todoId": todoId
//             },
//             UpdateExpression: "set #a = :a, #b = :b, #c = :c",
//             ExpressionAttributeNames: {
//                 "#a": "name",
//                 "#b": "dueDate",
//                 "#c": "done"
//             },
//             ExpressionAttributeValues: {
//                 ":a": todoUpdate['name'],
//                 ":b": todoUpdate['dueDate'],
//                 ":c": todoUpdate['done']
//             },
//             ReturnValues: "ALL_NEW"
//         };

//         const result = await docClient.update(params).promise();
//         console.log(result);
//         const attributes = result.Attributes;

//         return attributes as TodoUpdate;
//     }

//     async deleteToDo(todoId: string, userId: string): Promise<string> {
//         console.log("Deleting todo");

//         const params = {
//             TableName: this.todoTable,
//             Key: {
//                 "userId": userId,
//                 "todoId": todoId
//             },
//         };

//         const result = await docClient.delete(params).promise();
//         console.log(result);

//         return "" as string;
//     }

//     async generateUploadUrl(todoId: string): Promise<string> {
//         console.log("Generating URL");

//         const url = this.s3Client.getSignedUrl('putObject', {
//             Bucket: this.s3BucketName,
//             Key: todoId,
//             Expires: 1000,
//         });
//         console.log(url);

//         return url as string;
//     }
// }
