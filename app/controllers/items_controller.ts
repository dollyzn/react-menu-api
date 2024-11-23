import Item from '#models/item'
import { uuidValidator } from '#validators/common'
import { storeValidator, updateValidator } from '#validators/item'
import type { HttpContext } from '@adonisjs/core/http'

export default class ItemsController {
  async index({}: HttpContext) {
    return Item.query()
  }

  async show({ params }: HttpContext) {
    const id = await uuidValidator.validate(params.id)

    return Item.query().where('id', id).preload('addons').preload('category').firstOrFail()
  }

  async store({ request }: HttpContext) {
    const data = await request.validateUsing(storeValidator)

    return Item.create(data)
  }

  async update({ params, request }: HttpContext) {
    const id = await uuidValidator.validate(params.id)

    const item = await Item.findOrFail(id)

    const data = await request.validateUsing(updateValidator)
    item.merge(data)

    return item.save()
  }

  async destroy({ params }: HttpContext) {
    const id = await uuidValidator.validate(params.id)

    const item = await Item.findOrFail(id)

    await item.delete()

    return item
  }
}
