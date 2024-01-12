import { SnakeCaseNamingStrategy } from '@adonisjs/lucid/orm'
import { LucidModel } from '@adonisjs/lucid/types/model'
import string from '@poppinss/utils/string'

export class CamelCaseNamingStrategy extends SnakeCaseNamingStrategy {
  serializedName(_: LucidModel, attributeName: string): string {
    return string.camelCase(attributeName)
  }

  paginationMetaKeys() {
    return {
      total: 'total',
      perPage: 'perPage',
      currentPage: 'currentPage',
      lastPage: 'lastPage',
      firstPage: 'firstPage',
      firstPageUrl: 'firstPageUrl',
      lastPageUrl: 'lastPageUrl',
      nextPageUrl: 'nextPageUrl',
      previousPageUrl: 'previousPageUrl',
    }
  }
}
