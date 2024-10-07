import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { deleteToDo } from '../../businessLogic/todos.js'
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
    const userId = getUserId(event);
    const deleteItem = await deleteToDo(todoId, userId);
    return {
      statusCode: 200,
      body: JSON.stringify({
        item: deleteItem
      })
    }
  })