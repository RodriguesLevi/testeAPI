import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({}, [
      rules.email(),
      rules.required(),
      rules.unique({ table: 'users', column: 'email', whereNot: { id: this.ctx.params.id } })
    ]),
    password: schema.string.optional({}, [
      rules.minLength(6)
    ]),
    role: schema.enum(['ADMIN', 'MANAGER', 'FINANCE', 'USER'] as const)
  })

  public messages = {
    'email.required': 'Email is required',
    'email.email': 'Email must be a valid email address',
    'email.unique': 'Email is already in use',
    'password.minLength': 'Password must be at least 6 characters',
    'role.enum': 'Role must be one of: ADMIN, MANAGER, FINANCE, USER'
  }
}
