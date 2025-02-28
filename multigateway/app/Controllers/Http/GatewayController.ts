import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Gateway from 'App/Models/Gateway'
import GatewayValidator from 'App/Validators/GatewayValidator'

export default class GatewayController {
  public async index({ response }: HttpContextContract) {
    const gateways = await Gateway.query().orderBy('priority', 'asc')
    return response.ok(gateways)
  }

  public async show({ params, response }: HttpContextContract) {
    const gateway = await Gateway.find(params.id)

    if (!gateway) {
      return response.notFound({ message: 'Gateway not found' })
    }

    return response.ok(gateway)
  }

  public async update({ params, request, response }: HttpContextContract) {
    const gateway = await Gateway.find(params.id)

    if (!gateway) {
      return response.notFound({ message: 'Gateway not found' })
    }

    const validator = new GatewayValidator(request.ctx!)
    const data = await request.validate({ schema: validator.schemaForUpdate })

    gateway.merge(data)
    await gateway.save()

    return response.ok(gateway)
  }

  public async toggleActive({ params, response }: HttpContextContract) {
    const gateway = await Gateway.find(params.id)

    if (!gateway) {
      return response.notFound({ message: 'Gateway not found' })
    }

    gateway.is_active = !gateway.is_active
    await gateway.save()

    return response.ok(gateway)
  }

  public async updatePriority({ params, request, response }: HttpContextContract) {
    const gateway = await Gateway.find(params.id)

    if (!gateway) {
      return response.notFound({ message: 'Gateway not found' })
    }

    const { priority } = request.only(['priority'])

    if (typeof priority !== 'number' || priority < 0) {
      return response.badRequest({ message: 'Priority must be a positive number' })
    }

    gateway.priority = priority
    await gateway.save()

    return response.ok(gateway)
  }
}
