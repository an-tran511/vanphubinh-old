import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Uom from 'App/Models/Uom'

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
