import { parseUserId } from "../auth/utils.mjs";
import { createToDoData, getAllToDoData, updateToDoData, deleteToDoData, generateUploadUrlData } from "../dataLayer/todos.data.js";
import { v4 as uuidv4 } from 'uuid';

export async function getAllToDo(jwtToken) {
    const userId = parseUserId(jwtToken);
    return getAllToDoData(userId);
}

export function createToDo(createTodoRequest, userId) {
    const todoId =  uuidv4();
    const s3BucketName = process.env.S3_BUCKET_NAME;
    
    return createToDoData({
        userId: userId,
        todoId: todoId,
        attachmentUrl:  `https://${s3BucketName}.s3.amazonaws.com/${todoId}`, 
        createdAt: new Date().getTime().toString(),
        done: false,
        ...createTodoRequest,
    });
}

export function updateToDo(updateTodoRequest, todoId, userId) {
    return updateToDoData(updateTodoRequest, todoId, userId);
}

export function deleteToDo(todoId, userId) {
    return deleteToDoData(todoId, userId);
}

export function generateUploadUrl(todoId) {
    return generateUploadUrlData(todoId);
}