import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'
import { createToDo } from '../../businessLogic/todos.js'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const newTodo = JSON.parse(event.body);
    const userId = getUserId(event);
    console.log("newTodo", newTodo);
    const newItem = await createToDo(newTodo, userId);
    return {
      statusCode: 201,
      body: JSON.stringify({
        item: newItem
      })
    }
  })