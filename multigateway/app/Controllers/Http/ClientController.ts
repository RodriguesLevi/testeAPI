import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Client from 'App/Models/Client'

export default class ClientController {
  public async index({ response }: HttpContextContract) {
    const clients = await Client.all()
    return response.ok(clients)
  }

  public async show({ params, response }: HttpContextContract) {
    const client = await Client.find(params.id)

    if (!client) {
      return response.notFound({ message: 'Client not found' })
    }

    return response.ok(client)
  }

  public async showWithTransactions({ params, response }: HttpContextContract) {
    const client = await Client.query()
      .where('id', params.id)
      .preload('transactions', (query) => {
        query.preload('gateway')
        query.preload('products')
      })
      .first()

    if (!client) {
      return response.notFound({ message: 'Client not found' })
    }

    return response.ok(client)
  }
}
