import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Item from './item.js'

export default class Addon extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare storeId: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column({ serialize: (value: string) => parseFloat(value) })
  declare price: number

  @column()
  declare photoUrl: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => Item)
  declare items: ManyToMany<typeof Item>
}
