import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({}, [
      rules.email(),
      rules.required()
    ]),
    password: schema.string({}, [
      rules.required(),
      rules.minLength(6)
    ])
  })

  public messages = {
    'email.required': 'Email is required',
    'email.email': 'Email must be a valid email address',
    'password.required': 'Password is required',
    'password.minLength': 'Password must be at least 6 characters'
  }
}
