import Partner from '#models/partner'
import { createPartnerValidator } from '#validators/partner'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { PartnerService } from '#services/partner_service'

@inject()
export default class PartnersController {
  constructor(protected partnerService: PartnerService) {}

  public async index({ request, response }: HttpContext) {
    const { page = 1, perPage = 30, searchValue = '' } = request.qs()
    const partners = await this.partnerService
      .all({ searchValue, page, perPage })
      .catch((error: any) => {
        return response.internalServerError(error)
      })

    return response.ok(partners)
  }

  public async store({ request, response }: HttpContext) {
    const data = request.all()
    const payload = await createPartnerValidator.validate(data)
    const partner = await Partner.create(payload).catch((error) => {
      return response.internalServerError(error)
    })
    return response.created(partner)
  }
}
