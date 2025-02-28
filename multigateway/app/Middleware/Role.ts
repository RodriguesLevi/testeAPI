import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { AuthenticationException } from '@adonisjs/auth/build/standalone'

/**
 * Role middleware to check if the authenticated user has the required role(s)
 */
export default class Role {
  /**
   * Handle request
   */
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>,
    allowedRoles: string[]
  ) {
    // Check if user is authenticated
    if (!auth.isAuthenticated) {
      throw new AuthenticationException('Unauthorized access', 'E_UNAUTHORIZED_ACCESS')
    }

    // Get current user
    const user = auth.user!

    // Check if user role is in allowed roles
    if (!allowedRoles.includes(user.role)) {
      return response.forbidden({ message: 'You do not have permission to access this resource' })
    }

    await next()
  }
}
