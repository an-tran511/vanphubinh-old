import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable().unique
      table.integer('category_id').unsigned().references('categories.id').nullable()
      table.integer('uom_id').unsigned().references('uoms.id').nullable()
      table.integer('secondary_uom_id').unsigned().references('uoms.id').nullable()
      table.integer('purchase_uom_id').unsigned().references('uoms.id').nullable()
      table.integer('partner_id').unsigned().references('partners.id').nullable()
      table.string('item_code').nullable()
      table.boolean('is_stockable').defaultTo(true)
      table.string('note').nullable()
      table.jsonb('specs').nullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
