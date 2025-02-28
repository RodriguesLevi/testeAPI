import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AuthValidator from 'App/Validators/AuthValidator'

export default class AuthController {
  public async login({ request, auth, response }: HttpContextContract) {
    // Validate input
    const { email, password } = await request.validate(AuthValidator)

    try {
      // Attempt to authenticate
      const token = await auth.use('api').attempt(email, password, {
        expiresIn: '1 day'
      })

      // Return token and user
      return {
        token: token.token,
        user: {
          id: token.user.id,
          email: token.user.email,
          role: token.user.role
        }
      }
    } catch (error) {
      return response.unauthorized({
        message: 'Invalid credentials'
      })
    }
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.use('api').revoke()
    return response.ok({
      message: 'Logged out successfully'
    })
  }

  public async me({ auth }: HttpContextContract) {
    const user = auth.user!
    return {
      id: user.id,
      email: user.email,
      role: user.role
    }
  }
}
