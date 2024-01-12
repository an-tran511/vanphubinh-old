import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { faker } from '@faker-js/faker/locale/vi'
import Partner from 'App/Models/Partner'

export default class extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run() {
    // Write your database queries inside the run method
    const partners: object[] = []
    for (let i = 0; i < 100; i++) {
      partners.push({
        name: faker.company.name(),
        isCustomer: faker.datatype.boolean(),
        isSupplier: faker.datatype.boolean(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
      })
    }
    await Partner.createMany(partners)
  }
}
