import vine from '@vinejs/vine'

export const createPartnerValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    email: vine.string().trim().optional(),
    isCustomer: vine.boolean(),
    isSupplier: vine.boolean(),
  })
)
