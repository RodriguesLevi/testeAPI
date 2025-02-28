import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Product from 'App/Models/Product'

export default class ProductSeeder extends BaseSeeder {
  public async run() {
    await Product.createMany([
      {
        name: 'Basic Plan',
        amount: 1000, // 10.00 in cents
      },
      {
        name: 'Pro Plan',
        amount: 2500, // 25.00 in cents
      },
      {
        name: 'Enterprise Plan',
        amount: 5000, // 50.00 in cents
      },
    ])
  }
}
