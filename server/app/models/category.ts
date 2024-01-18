import { DateTime } from 'luxon'
import { column } from '@adonisjs/lucid/orm'
import { search } from '../utils/search.js'
import AppBaseModel from '#models/app_base_model'

export default class Category extends AppBaseModel {
  public static search = search(this, ['name'], {
    name: (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
  })

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
