import Item from '#models/item'
import PackageAndLabel from '#models/package_and_label'
import type { HttpContext } from '@adonisjs/core/http'

export default class PackagesAndLabelsController {
  public async index({ request }: HttpContext) {
    const { page = 1, perPage = 30, searchValue = '' } = request.qs()
    const items = await PackageAndLabel.query()
      .withScopes((scopes) => scopes.search(searchValue))
      .paginate(page, perPage)
    return items
  }

  public async show({ params }: HttpContext) {
    const item = await PackageAndLabel.findOrFail(params.id)
    return item
  }

  public async store({ request }: HttpContext) {
    const item = await PackageAndLabel.create(request.body())
    return item
  }
}
