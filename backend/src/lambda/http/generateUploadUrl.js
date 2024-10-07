import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { generateUploadUrl } from '../../businessLogic/todos.js'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const todoId = event.pathParameters.todoId;
    const URL = await generateUploadUrl(todoId);
    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl: URL
      })
    }
  })