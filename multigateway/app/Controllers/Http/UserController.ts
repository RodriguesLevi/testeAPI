import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserValidator from 'App/Validators/UserValidator'

export default class UserController {
  public async index({ response }: HttpContextContract) {
    const users = await User.all()
    return response.ok(users)
  }

  public async store({ request, response }: HttpContextContract) {
    const data = await request.validate(UserValidator)

    const user = await User.create(data)

    return response.created(user)
  }

  public async show({ params, response }: HttpContextContract) {
    const user = await User.find(params.id)

    if (!user) {
      return response.notFound({ message: 'User not found' })
    }

    return response.ok(user)
  }

  public async update({ params, request, response }: HttpContextContract) {
    const user = await User.find(params.id)

    if (!user) {
      return response.notFound({ message: 'User not found' })
    }

    const data = await request.validate(UserValidator)

    user.merge(data)
    await user.save()

    return response.ok(user)
  }

  public async destroy({ params, response }: HttpContextContract) {
    const user = await User.find(params.id)

    if (!user) {
      return response.notFound({ message: 'User not found' })
    }

    await user.delete()

    return response.ok({ message: 'User deleted successfully' })
  }
}
