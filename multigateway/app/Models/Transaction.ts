import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  manyToMany,
  ManyToMany
} from '@ioc:Adonis/Lucid/Orm'
import Client from './Client'
import Gateway from './Gateway'
import Product from './Product'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public client_id: number

  @column()
  public gateway_id: number

  @column()
  public external_id: string

  @column()
  public status: 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED'

  @column()
  public amount: number

  @column()
  public card_last_numbers: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Client)
  public client: BelongsTo<typeof Client>

  @belongsTo(() => Gateway)
  public gateway: BelongsTo<typeof Gateway>

  @manyToMany(() => Product, {
    pivotTable: 'transaction_products',
    pivotColumns: ['quantity']
  })
  public products: ManyToMany<typeof Product>
}
