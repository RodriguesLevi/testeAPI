import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ClientValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({}, [
      rules.required(),
      rules.minLength(3)
    ]),
    email: schema.string({}, [
      rules.required(),
      rules.email(),
      rules.unique({ table: 'clients', column: 'email', whereNot: { id: this.ctx.params.id } })
    ])
  })

  public messages = {
    'name.required': 'Client name is required',
    'name.minLength': 'Client name must be at least 3 characters',
    'email.required': 'Client email is required',
    'email.email': 'Client email must be a valid email address',
    'email.unique': 'Client email is already in use'
  }
}
