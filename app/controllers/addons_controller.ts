import Addon from '#models/addon'
import { storeValidator, updateValidator } from '#validators/addon'
import { uuidValidator } from '#validators/common'
import type { HttpContext } from '@adonisjs/core/http'

export default class AddonsController {
  async index({}: HttpContext) {
    return Addon.query()
  }

  async show({ params }: HttpContext) {
    const id = await uuidValidator.validate(params.id)

    return Addon.findOrFail(id)
  }

  async store({ request }: HttpContext) {
    const data = await request.validateUsing(storeValidator)

    return Addon.create(data)
  }

  async update({ params, request }: HttpContext) {
    const id = await uuidValidator.validate(params.id)

    const addons = await Addon.findOrFail(id)

    const data = await request.validateUsing(updateValidator)
    addons.merge(data)

    return addons.save()
  }

  async destroy({ params }: HttpContext) {
    const id = await uuidValidator.validate(params.id)

    const addons = await Addon.findOrFail(id)

    await addons.delete()

    return addons
  }
}
