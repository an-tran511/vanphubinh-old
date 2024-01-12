import Partner from '#models/partner'
import type { HttpContext } from '@adonisjs/core/http'

export default class PartnersController {
  public async index({ request }: HttpContext) {
    const { page = 1, perPage = 30, searchValue = '' } = request.qs()
    const items = await Partner.query()
      .withScopes((scopes) => scopes.search(searchValue))
      .paginate(page, perPage)
    return items
  }

  // public async store({ request, response }: HttpContext) {
  //   const newPartnerSchema = schema.create({
  //     name: schema.string(),
  //     email: schema.string.optional(),
  //     address: schema.string.optional(),
  //     isCustomer: schema.boolean(),
  //     isSupplier: schema.boolean(),
  //   })
  //   const payload = await request.qs({
  //     schema: newPartnerSchema,
  //   })
  //   const partner = await Partner.create(payload)
  //   return response.ok(partner)
  // }
}
