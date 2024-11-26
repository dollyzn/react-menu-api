import env from '#start/env'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class CookieAuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    if (env.get('AUTH_COOKIE_ENABLED')) {
      const token = ctx.request.cookie(env.get('AUTH_COOKIE_NAME'))
      ctx.request.request.headers['authorization'] = `Bearer ${token}`
    }
    return next()
  }
}
