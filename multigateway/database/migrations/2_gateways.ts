import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Gateways extends BaseSchema {
  protected tableName = 'gateways'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name', 255).notNullable().unique()
      table.boolean('is_active').defaultTo(true)
      table.integer('priority').notNullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
