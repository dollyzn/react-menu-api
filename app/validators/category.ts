import vine from '@vinejs/vine'

const name = vine.string().trim()
const description = vine.string().optional()

const storeValidator = vine.compile(
  vine.object({
    name,
    description,
  })
)

const updateValidator = vine.compile(
  vine.object({
    name: name.optional(),
    description,
  })
)

export { storeValidator, updateValidator }
