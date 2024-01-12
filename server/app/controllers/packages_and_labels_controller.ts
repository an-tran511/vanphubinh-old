import Item from '#models/item'
import type { HttpContext } from '@adonisjs/core/http'

export default class PackagesAndLabelsController {
  public async index({ request }: HttpContext) {
    const { page = 1, perPage = 30, searchValue = '' } = request.qs()
    const items = await Item.query()
      .withScopes((scopes) => scopes.search(searchValue))
      .paginate(page, perPage)
    return items
  }
}
