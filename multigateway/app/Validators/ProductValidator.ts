import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ProductValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({}, [
      rules.required(),
      rules.minLength(3)
    ]),
    amount: schema.number([
      rules.required(),
      rules.unsigned()
    ])
  })

  public messages = {
    'name.required': 'Product name is required',
    'name.minLength': 'Product name must be at least 3 characters',
    'amount.required': 'Product amount is required',
    'amount.unsigned': 'Product amount must be a positive number'
  }
}
