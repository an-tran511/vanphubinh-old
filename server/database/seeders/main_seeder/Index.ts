import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { Application } from '@adonisjs/core/app'

export default class IndexSeeder extends BaseSeeder {
  private async runSeeder(Seeder: { default: typeof BaseSeeder }) {
    /**
     * Do not run when not in a environment specified in Seeder
     */
    if (
      (!Seeder.default.environment.includes('development') && Application.inDev) ||
      (!Seeder.default.environment.includes('testing') && Application.inTest) ||
      (!Seeder.default.environment.includes('production') && Application.inProduction)
    ) {
      return
    }

    await new Seeder.default(this.client).run()
  }

  public async run() {
    await this.runSeeder(await import('../partner_seeder.js'))
    await this.runSeeder(await import('../uom_seeder.js'))
    await this.runSeeder(await import('../category_seeder.js'))
  }
}
