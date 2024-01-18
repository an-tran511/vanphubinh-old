import Item from '#models/item'
import PackageAndLabel from '#models/package_and_label'
import { PackageAndLabelService } from '#services/package_and_label_service'
import { createPackageAndLabelValidator } from '#validators/package_and_label'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class PackagesAndLabelsController {
  constructor(protected packageAndLabelService: PackageAndLabelService) {}

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

  public async store({ request, response }: HttpContext) {
    const data = request.all()
    const payload = await createPackageAndLabelValidator.validate(data)
    const item = await this.packageAndLabelService.store(payload).catch((error) => {
      return response.internalServerError(error)
    })
    return response.created(item)
  }
}
