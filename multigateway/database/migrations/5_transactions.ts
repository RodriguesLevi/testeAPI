import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Transactions extends BaseSchema {
  protected tableName = 'transactions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('client_id').unsigned().references('id').inTable('clients').onDelete('CASCADE')
      table.integer('gateway_id').unsigned().references('id').inTable('gateways')
      table.string('external_id').notNullable()
      table.enum('status', ['PENDING', 'PAID', 'REFUNDED', 'FAILED']).defaultTo('PENDING')
      table.integer('amount').notNullable()
      table.string('card_last_numbers', 4)
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
