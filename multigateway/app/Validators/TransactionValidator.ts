import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TransactionValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({}, [
      rules.required(),
      rules.minLength(3)
    ]),
    email: schema.string({}, [
      rules.required(),
      rules.email()
    ]),
    cardNumber: schema.string({}, [
      rules.required(),
      rules.regex(/^\d{16}$/)
    ]),
    cvv: schema.string({}, [
      rules.required(),
      rules.regex(/^\d{3}$/)
    ]),
    products: schema.array([rules.minLength(1)]).members(
      schema.object().members({
        id: schema.number([
          rules.required(),
          rules.exists({ table: 'products', column: 'id' })
        ]),
        quantity: schema.number([
          rules.required(),
          rules.unsigned(),
          rules.range(1, 100)
        ])
      })
    )
  })

  public messages = {
    'name.required': 'Name is required',
    'name.minLength': 'Name must be at least 3 characters',
    'email.required': 'Email is required',
    'email.email': 'Email must be a valid email address',
    'cardNumber.required': 'Card number is required',
    'cardNumber.regex': 'Card number must be 16 digits',
    'cvv.required': 'CVV is required',
    'cvv.regex': 'CVV must be 3 digits',
    'products.required': 'Products are required',
    'products.minLength': 'At least one product is required',
    'products.*.id.required': 'Product ID is required',
    'products.*.id.exists': 'Product ID does not exist',
    'products.*.quantity.required': 'Product quantity is required',
    'products.*.quantity.unsigned': 'Product quantity must be a positive number',
    'products.*.quantity.range': 'Product quantity must be between 1 and 100'
  }
}
