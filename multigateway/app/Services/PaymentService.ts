import Gateway from 'App/Models/Gateway'
import Client from 'App/Models/Client'
import Product from 'App/Models/Product'
import Transaction from 'App/Models/Transaction'
import TransactionProduct from 'App/Models/TransactionProduct'
import Gateway1Service from './Gateway1Service'
import Gateway2Service from './Gateway2Service'
import Database from '@ioc:Adonis/Lucid/Database'

export default class PaymentService {
  private gateway1Service: Gateway1Service
  private gateway2Service: Gateway2Service

  constructor() {
    this.gateway1Service = new Gateway1Service()
    this.gateway2Service = new Gateway2Service()
  }

  /**
   * Process a payment using available gateways in order of priority
   */
  public async processPayment(data: {
    clientName: string,
    clientEmail: string,
    cardNumber: string,
    cvv: string,
    products: Array<{ id: number, quantity: number }>
  }) {
    // Validate products exist
    const products = await Product.query().whereIn('id', data.products.map(p => p.id))

    if (products.length !== data.products.length) {
      throw new Error('One or more products not found')
    }

    // Calculate total amount
    let totalAmount = 0
    for (const product of products) {
      const productOrder = data.products.find(p => p.id === product.id)
      if (productOrder) {
        totalAmount += product.amount * productOrder.quantity
      }
    }

    // Create or find client
    const client = await Client.firstOrCreate(
      { email: data.clientEmail },
      { name: data.clientName, email: data.clientEmail }
    )

    // Get active gateways ordered by priority
    const gateways = await Gateway.query()
      .where('is_active', true)
      .orderBy('priority', 'asc')

    if (gateways.length === 0) {
      throw new Error('No active payment gateways available')
    }

    // Try each gateway until one succeeds
    let transactionResult = null
    let usedGateway = null
    let externalId = ''

    // Use transaction to ensure data consistency
    return await Database.transaction(async (trx) => {
      // First create a pending transaction record
      const transaction = new Transaction()
      transaction.client_id = client.id
      transaction.amount = totalAmount
      transaction.status = 'PENDING'
      transaction.card_last_numbers = data.cardNumber.slice(-4)

      // Use transaction for database operations
      transaction.useTransaction(trx)
      await transaction.save()

      // Add transaction products
      for (const productOrder of data.products) {
        const transactionProduct = new TransactionProduct()
        transactionProduct.transaction_id = transaction.id
        transactionProduct.product_id = productOrder.id
        transactionProduct.quantity = productOrder.quantity

        // Use transaction for database operations
        transactionProduct.useTransaction(trx)
        await transactionProduct.save()
      }

      // Try each gateway
      for (const gateway of gateways) {
        try {
          if (gateway.name === 'Gateway 1') {
            transactionResult = await this.gateway1Service.createTransaction({
              amount: totalAmount,
              name: client.name,
              email: client.email,
              cardNumber: data.cardNumber,
              cvv: data.cvv
            })

            if (transactionResult.success) {
              usedGateway = gateway
              externalId = transactionResult.data.id
              break
            }
          } else if (gateway.name === 'Gateway 2') {
            transactionResult = await this.gateway2Service.createTransaction({
              valor: totalAmount,
              nome: client.name,
              email: client.email,
              numeroCartao: data.cardNumber,
              cvv: data.cvv
            })

            if (transactionResult.success) {
              usedGateway = gateway
              externalId = transactionResult.data.id
              break
            }
          }
        } catch (error) {
          console.error(`Error processing payment with gateway ${gateway.name}:`, error)
          // Continue to next gateway
        }
      }

      // If no gateway succeeded
      if (!usedGateway) {
        transaction.status = 'FAILED'
        await transaction.save()
        throw new Error('Payment processing failed on all available gateways')
      }

      // Update transaction with successful gateway
      transaction.gateway_id = usedGateway.id
      transaction.external_id = externalId
      transaction.status = 'PAID'
      await transaction.save()

      // Return transaction info
      return {
        success: true,
        transaction: {
          id: transaction.id,
          amount: totalAmount,
          status: transaction.status,
          gateway: usedGateway.name,
          externalId,
          client: {
            name: client.name,
            email: client.email
          },
          products: await Promise.all(products.map(async (product) => {
            const productOrder = data.products.find(p => p.id === product.id)
            return {
              id: product.id,
              name: product.name,
              unitAmount: product.amount,
              quantity: productOrder?.quantity || 0,
              totalAmount: product.amount * (productOrder?.quantity || 0)
            }
          }))
        }
      }
    })
  }

  /**
   * Refund a transaction
   */
  public async refundTransaction(transactionId: number) {
    const transaction = await Transaction.query()
      .where('id', transactionId)
      .preload('gateway')
      .first()

    if (!transaction) {
      throw new Error('Transaction not found')
    }

    if (transaction.status !== 'PAID') {
      throw new Error('Only paid transactions can be refunded')
    }

    let refundResult = null

    if (transaction.gateway.name === 'Gateway 1') {
      refundResult = await this.gateway1Service.refundTransaction(transaction.external_id)
    } else if (transaction.gateway.name === 'Gateway 2') {
      refundResult = await this.gateway2Service.refundTransaction(transaction.external_id)
    } else {
      throw new Error('Unknown gateway')
    }

    if (!refundResult.success) {
      throw new Error('Refund failed: ' + (refundResult.error || 'Unknown error'))
    }

    // Update transaction status
    transaction.status = 'REFUNDED'
    await transaction.save()

    return {
      success: true,
      transaction: {
        id: transaction.id,
        status: transaction.status
      }
    }
  }
}
