import Partner from '#models/partner'

export class PartnerService {
  async all({
    searchValue,
    page,
    perPage,
  }: {
    searchValue: string
    page: number
    perPage: number
  }) {
    return await Partner.query()
      .withScopes((scopes) => scopes.search(searchValue))
      .paginate(page, perPage)
  }
}
