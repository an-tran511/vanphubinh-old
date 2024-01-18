import vine from '@vinejs/vine'

export const createPackageAndLabelValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    uomId: vine.number().positive(),
    partnerId: vine.number().positive().optional(),
    categoryId: vine.number().positive().optional(),
    itemCode: vine.string().trim().optional(),
    note: vine.string().trim().optional(),
    specifications: vine
      .object({
        dimension: vine.string().trim().optional(),
        seamingDimension: vine.string().trim().optional(),
        thickness: vine.number().positive().optional(),
        colorCount: vine.number().positive().optional(),
      })
      .optional(),
  })
)
