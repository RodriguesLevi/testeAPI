import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Transaction from 'App/Models/Transaction'
import TransactionValidator from 'App/Validators/TransactionValidator'
import PaymentService from 'App/Services/PaymentService'

export default class TransactionController {
  private paymentService: PaymentService

  constructor() {
    this.paymentService = new PaymentService()
  }

  public async index({ response }: HttpContextContract) {
    const transactions = await Transaction.query()
      .preload('client')
      .preload('gateway')
      .orderBy('created_at', 'desc')

    return response.ok(transactions)
  }

  public async show({ params, response }: HttpContextContract) {
    const transaction = await Transaction.query()
      .where('id', params.id)
      .preload('client')
      .preload('gateway')
      .preload('products', (query) => {
        query.pivotColumns(['quantity'])
      })
      .first()

    if (!transaction) {
      return response.notFound({ message: 'Transaction not found' })
    }

    return response.ok(transaction)
  }

  public async store({ request, response }: HttpContextContract) {
    const data = await request.validate(TransactionValidator)

    try {
      const result = await this.paymentService.processPayment({
        clientName: data.name,
        clientEmail: data.email,
        cardNumber: data.cardNumber,
        cvv: data.cvv,
        products: data.products
      })

      return response.created(result)
    } catch (error) {
      return response.badRequest({
        message: error.message || 'Payment processing failed'
      })
    }
  }

  public async refund({ params, response }: HttpContextContract) {
    try {
      const result = await this.paymentService.refundTransaction(parseInt(params.id))

      return response.ok(result)
    } catch (error) {
      return response.badRequest({
        message: error.message || 'Refund processing failed'
      })
    }
  }
}
