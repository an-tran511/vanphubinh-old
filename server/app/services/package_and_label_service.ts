import PackageAndLabel from '#models/package_and_label'
import Partner from '#models/partner'

export class PackageAndLabelService {
  async store({
    name,
    note,
    partnerId,
    uomId,
    categoryId,
    specs,
  }: {
    name: string
    note: string | undefined
    partnerId: number | undefined
    uomId: number
    categoryId: number | undefined
    specs: object | undefined
  }) {
    const packageAndLabel = await PackageAndLabel.create({
      name,
      note,
      uomId,
      categoryId,
      partnerId,
      specs,
    }).catch((error) => {
      return error
    })
    return packageAndLabel
  }
}
