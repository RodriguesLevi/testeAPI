import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        email: 'admin@example.com',
        password: 'password123',
        role: 'ADMIN',
      },
      {
        email: 'manager@example.com',
        password: 'password123',
        role: 'MANAGER',
      },
      {
        email: 'finance@example.com',
        password: 'password123',
        role: 'FINANCE',
      },
      {
        email: 'user@example.com',
        password: 'password123',
        role: 'USER',
      },
    ])
  }
}
