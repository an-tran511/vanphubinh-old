import Uom from '#models/uom'
import type { HttpContext } from '@adonisjs/core/http'

export default class UomsController {
  public async index({ request }: HttpContext) {
    const { page = 1, perPage = 30, searchValue = '' } = request.qs()
    const items = await Uom.query()
      .withScopes((scopes) => scopes.search(searchValue))
      .paginate(page, perPage)
    return items
  }
}
