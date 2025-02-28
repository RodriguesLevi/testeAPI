import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Gateway from 'App/Models/Gateway'

export default class GatewaySeeder extends BaseSeeder {
  public async run() {
    await Gateway.createMany([
      {
        name: 'Gateway 1',
        is_active: true,
        priority: 1,
      },
      {
        name: 'Gateway 2',
        is_active: true,
        priority: 2,
      },
    ])
  }
}
