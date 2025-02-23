import type { HttpContext } from '@adonisjs/core/http'
import { storeExistValidator, uuidValidator } from '#validators/common'
import {
  categoryExistValidator,
  storeValidator,
  updateOrderValidator,
  updateValidator,
} from '#validators/item'
import Item from '#models/item'
import Addon from '#models/addon'
import db from '@adonisjs/lucid/services/db'

export default class ItemsController {
  async indexByCategory({ params }: HttpContext) {
    const categoryId = await categoryExistValidator.validate(params.id)

    return Item.query().where('categoryId', categoryId).orderBy('order', 'asc')
  }

  async indexByStore({ params }: HttpContext) {
    const storeId = await storeExistValidator.validate(params.id)

    return Item.query()
      .whereHas('category', (query) => {
        query.where('storeId', storeId)
      })
      .preload('category')
      .withCount('addons', (query) => {
        query.as('addonsCount')
      })
      .orderBy('createdAt', 'desc')
  }

  async show({ params }: HttpContext) {
    const id = await uuidValidator.validate(params.id)

    const item = await Item.query()
      .where('id', id)
      .preload('addons')
      .preload('category')
      .firstOrFail()
    await item.incrementViews()

    return item
  }

  async store({ request, params }: HttpContext) {
    const categoryId = await categoryExistValidator.validate(params.categoryId)

    const { addonIds, ...data } = await request.validateUsing(storeValidator)

    const item = await Item.create({ categoryId, ...data })

    await item.load('category')

    if (addonIds) {
      const validAddonIds = (
        await Addon.query()
          .whereIn('id', addonIds)
          .andWhere('store_id', item.category.storeId)
          .select('id')
      ).map((addon) => addon.id)

      await item.related('addons').sync(validAddonIds)
      const countResult = await item.related('addons').query().count('* as total')
      const addonsCount = countResult[0].$extras.total ?? 0
      item.$extras = { addonsCount }
    }

    return await item.refresh()
  }

  async update({ params, request }: HttpContext) {
    const id = await uuidValidator.validate(params.id)

    const item = await Item.findOrFail(id)

    const { addonIds, ...data } = await request.validateUsing(updateValidator)

    item.merge(data)

    await item.load('category')

    if (addonIds) {
      const validAddonIds = (
        await Addon.query()
          .whereIn('id', addonIds)
          .andWhere('store_id', item.category.storeId)
          .select('id')
      ).map((addon) => addon.id)

      await item.related('addons').sync(validAddonIds)
      const countResult = await item.related('addons').query().count('* as total')
      const addonsCount = countResult[0].$extras.total ?? 0
      item.$extras = { addonsCount }
    }

    return item.save()
  }

  public async updateOrder({ request, response }: HttpContext) {
    const { id, order } = await request.validateUsing(updateOrderValidator)

    const item = await Item.query().where('id', id).firstOrFail()

    const trx = await db.transaction()

    try {
      if (order < item.order) {
        await trx
          .from('items')
          .where('category_id', item.categoryId)
          .andWhereBetween('order', [order, item.order - 1])
          .increment('order', 1)
      } else if (order > item.order) {
        await trx
          .from('items')
          .where('category_id', item.categoryId)
          .andWhereBetween('order', [item.order + 1, order])
          .decrement('order', 1)
      }

      item.merge({ order: order })
      await item.useTransaction(trx).save()

      await trx.commit()

      return Item.query()
        .where('categoryId', item.categoryId)
        .select('id', 'order', 'updatedAt')
        .orderBy('order', 'asc')
    } catch (error) {
      await trx.rollback()
      return response.status(500).send({
        message: 'Ocorreu um erro ao atualizar ordem',
      })
    }
  }

  async destroy({ params }: HttpContext) {
    const id = await uuidValidator.validate(params.id)

    const item = await Item.findOrFail(id)

    await item.delete()

    return item
  }
}
