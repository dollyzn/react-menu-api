import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'stores'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('views').unsigned().defaultTo(0)
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('views')
    })
  }
}
