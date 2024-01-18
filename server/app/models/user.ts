import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { column, beforeSave } from '@adonisjs/lucid/orm'
import AppBaseModel from '#models/app_base_model'
import { search } from '../utils/search.js'

export default class User extends AppBaseModel {
  public static search = search(this, ['fullName'], {
    fullName: (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
  })
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column()
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @beforeSave()
  static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await hash.make(user.password)
    }
  }

  async verifyPasswordForAuth(plainTextPassword: string) {
    return hash.verify(this.password, plainTextPassword)
  }

  static async getUserForAuth(uids: string[], value: string) {
    const query = this.query()
      .where('account_status', 'active')
      .where((builder) => {
        uids.forEach((uid) => builder.orWhere(uid, value))
      })

    return query.first()
  }
}
