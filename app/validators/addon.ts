import vine from '@vinejs/vine'

const name = vine.string().trim()
const description = vine.string().optional()
const price = vine.number().positive()
const photoUrl = vine.string().optional()

const storeValidator = vine.compile(
  vine.object({
    name,
    description,
    price,
    photoUrl,
  })
)

const updateValidator = vine.compile(
  vine.object({
    name: name.optional(),
    description,
    price: price.optional(),
    photoUrl,
  })
)

export { storeValidator, updateValidator }
