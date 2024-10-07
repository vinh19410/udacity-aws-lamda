import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { updateToDo } from '../../businessLogic/todos.js'
import { getUserId } from '../utils.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const todoId = event.pathParameters.todoId;
    const updatedTodo = JSON.parse(event.body);
    const userId = getUserId(event);
    console.log("updatedTodo", updatedTodo);
    const updateItem = await updateToDo(updatedTodo, todoId, userId);
    return {
      statusCode: 200,
      body: JSON.stringify({
        item: updateItem
      })
    }
  })