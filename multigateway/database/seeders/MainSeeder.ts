import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Application from '@ioc:Adonis/Core/Application'

export default class MainSeeder extends BaseSeeder {
  private async runSeeder(seeder: { default: typeof BaseSeeder }) {
    /**
     * Do not run when not in dev mode and seeder is development
     * only
     */
    if (seeder.default.developmentOnly && !Application.inDev) {
      return
    }

    await new seeder.default(this.client).run()
  }

  public async run() {
    await this.runSeeder(await import('../seeders/UserSeeder'))
    await this.runSeeder(await import('../seeders/GatewaySeeder'))
    await this.runSeeder(await import('../seeders/ProductSeeder'))
  }
}
