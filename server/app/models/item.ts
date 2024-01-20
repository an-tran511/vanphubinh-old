import { DateTime } from 'luxon'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import { search } from '../utils/search.js'
import AppBaseModel from '#models/app_base_model'
import Partner from './partner.js'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Item extends AppBaseModel {
  public static search = search(this, ['name'], {
    name: (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
  })

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare uomId: number

  @column()
  declare secondaryUomId: number

  @column()
  declare purchaseUomId: number

  @column()
  declare partnerId: number

  @belongsTo(() => Partner)
  declare partner: BelongsTo<typeof Partner>

  @column()
  declare categoryId: number

  @column()
  declare itemCode: string

  @column()
  declare note: string

  @column()
  declare specs: object

  @column()
  declare isStockable: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
