import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { search } from '../utils/search.js'

export default class Category extends BaseModel {
  public static search = search(this, ['name'])

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare parentCatId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
