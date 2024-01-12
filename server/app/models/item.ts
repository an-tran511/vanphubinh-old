import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { search } from '../utils/search.js'

export default class Item extends BaseModel {
  public static search = search(this, ['name'])

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare uomId: number

  @column()
  declare partnerId: number

  @column()
  declare categoryId: number

  @column()
  declare itemCode: string

  @column()
  declare note: string

  @column()
  declare specs: object

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
