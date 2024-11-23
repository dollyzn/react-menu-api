import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column } from '@adonisjs/lucid/orm'
import StoreStatus from '../enums/store-status.js'

export default class Store extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare status: StoreStatus

  @column()
  declare address: string | null

  @column()
  declare instagramUrl: string | null

  @column()
  declare ifoodUrl: string | null

  @column()
  declare bannerUrl: string | null

  @column()
  declare photoUrl: string | null

  @column()
  declare slug: string

  @column()
  declare isDefault: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeSave()
  public static async ensureSingleDefault(store: Store) {
    if (store.isDefault) {
      await Store.query()
        .whereNot('id', store.id || 0)
        .update({ isDefault: false })
    }
  }
}
