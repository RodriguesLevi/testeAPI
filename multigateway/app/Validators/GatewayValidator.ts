import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GatewayValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schemaForUpdate = schema.create({
    is_active: schema.boolean.optional(),
    priority: schema.number.optional([
      rules.unsigned()
    ])
  })

  public messages = {
    'is_active.boolean': 'is_active must be a boolean',
    'priority.unsigned': 'Priority must be a positive number'
  }
}
