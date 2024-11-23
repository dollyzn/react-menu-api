import Category from '#models/category'
import { storeValidator, updateValidator } from '#validators/category'
import { uuidValidator } from '#validators/common'
import type { HttpContext } from '@adonisjs/core/http'

export default class CategoriesController {
  async index({}: HttpContext) {
    return Category.query()
  }

  async show({ params }: HttpContext) {
    const id = await uuidValidator.validate(params.id)

    return Category.findOrFail(id)
  }

  async store({ request }: HttpContext) {
    const data = await request.validateUsing(storeValidator)

    return Category.create(data)
  }

  async update({ params, request }: HttpContext) {
    const id = await uuidValidator.validate(params.id)

    const category = await Category.findOrFail(id)

    const data = await request.validateUsing(updateValidator)
    category.merge(data)

    return category.save()
  }

  async destroy({ params }: HttpContext) {
    const id = await uuidValidator.validate(params.id)

    const category = await Category.findOrFail(id)

    await category.delete()

    return category
  }
}
