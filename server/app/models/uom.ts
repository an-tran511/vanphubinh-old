import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { search } from '../utils/search.js'

export default class Uom extends BaseModel {
  public static search = search(this, ['name'], {
    name: (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
  })

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
