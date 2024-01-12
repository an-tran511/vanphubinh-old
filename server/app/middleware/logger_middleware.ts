import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class LoggerMiddleware {
  async handle({ logger, routeKey }: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    logger.info(routeKey)
    /**
     * Call next method in the pipeline and return its output
     */
    await next()
  }
}
