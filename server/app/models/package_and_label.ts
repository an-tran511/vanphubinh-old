import { DateTime } from 'luxon'
import { column } from '@adonisjs/lucid/orm'
import Item from '#models/item'

export default class PackageAndLabel extends Item {
  public static table = 'items'

  @column()
  isStockable: boolean = false
}