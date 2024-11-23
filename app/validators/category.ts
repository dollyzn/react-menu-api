import vine from '@vinejs/vine'

const name = vine.string().trim()
const description = vine.string().optional()

export const storeValidator = vine.compile(
  vine.object({
    storeId: vine.number(),
    name,
    description,
  })
)

export const updateValidator = vine.compile(
  vine.object({
    name: name.optional(),
    description,
  })
)
