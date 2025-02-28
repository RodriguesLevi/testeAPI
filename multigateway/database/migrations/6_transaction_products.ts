import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TransactionProducts extends BaseSchema {
  protected tableName = 'transaction_products'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('transaction_id').unsigned().references('id').inTable('transactions').onDelete('CASCADE')
      table.integer('product_id').unsigned().references('id').inTable('products').onDelete('CASCADE')
      table.integer('quantity').notNullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
