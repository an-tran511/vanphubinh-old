import { BaseModel } from '@adonisjs/lucid/orm'
import { CamelCaseNamingStrategy } from '#strategies/camel_case_naming_strategy'

export default class AppBaseModel extends BaseModel {
  static namingStrategy = new CamelCaseNamingStrategy()
}
