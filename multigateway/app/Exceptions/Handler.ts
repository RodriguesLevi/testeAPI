import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger)
  }

  public async handle(error: any, ctx: HttpContextContract) {
    /**
     * Self handle the validation exception
     */
    if (error.code === 'E_VALIDATION_FAILURE') {
      return ctx.response.status(422).send({
        status: 'error',
        message: 'Validation failed',
        errors: error.messages
      })
    }

    /**
     * Handle authentication errors
     */
    if (error.code === 'E_UNAUTHORIZED_ACCESS') {
      return ctx.response.status(401).send({
        status: 'error',
        message: 'Unauthorized access'
      })
    }

    /**
     * Handle generic errors
     */
    if (['E_ROW_NOT_FOUND', 'E_INVALID_AUTH_UID'].includes(error.code)) {
      return ctx.response.status(404).send({
        status: 'error',
        message: 'Resource not found'
      })
    }

    /**
     * Forward rest of the exceptions to the parent class
     */
    return super.handle(error, ctx)
  }

  /**
   * Report exception for logging or sending to external tools
   */
  public async report(error: any, ctx: HttpContextContract) {
    if (!this.shouldReport(error)) {
      return
    }

    // Log error to the console in development mode
    if (process.env.NODE_ENV === 'development') {
      console.error(error)
    } else {
      // Log to external service in production
      Logger.error(error.message, {
        stack: error.stack,
        request: {
          url: ctx.request.url(),
          method: ctx.request.method(),
          headers: ctx.request.headers(),
          body: ctx.request.body()
        }
      })
    }
  }
}
