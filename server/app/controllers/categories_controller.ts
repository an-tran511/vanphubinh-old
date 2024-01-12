import Category from '#models/category'
import type { HttpContext } from '@adonisjs/core/http'

export default class CategoriesController {
  public async index({ request }: HttpContext) {
    const { page = 1, perPage = 30, searchValue = '' } = request.qs()
    const items = await Category.query()
      .withScopes((scopes) => scopes.search(searchValue))
      .paginate(page, perPage)
    return items
  }
}
