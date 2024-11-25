import Store from '#models/store'
import { storeExistValidator } from '#validators/menu'
import type { HttpContext } from '@adonisjs/core/http'

export default class MenuController {
  async show({ params, response }: HttpContext) {
    const slug = await storeExistValidator.validate(params.slug)

    const store = Store.query()

    if (slug) {
      store
        .where('slug', slug)
        .preload('categories', (query) => {
          query.preload('items', (query) => query.preload('addons'))
        })
        .first()
    } else {
      store
        .where('is_default', true)
        .preload('categories', (query) => {
          query.preload('items', (query) => query.preload('addons'))
        })
        .first()
    }

    if (!store) {
      return response.notFound({ message: 'Loja não encontrada' })
    }

    return store
  }
}
