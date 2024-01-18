import Uom from '#models/uom'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run() {
    // Write your database queries inside the run method
    await Uom.createMany([
      {
        name: 'cái',
      },
      {
        name: 'kg',
      },
      {
        name: 'cây',
      },
    ])
  }
}
