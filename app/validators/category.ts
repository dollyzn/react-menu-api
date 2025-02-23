import vine from '@vinejs/vine'

const name = vine.string().trim()
const description = vine.string().trim().optional()

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

const updateOrderValidator = vine.compile(
  vine.object({
    id: vine.number().exists(async (db, value) => {
      return await db.from('categories').select('id').where('id', value).first()
    }),
    order: vine.number().min(0),
  })
)

const bulkDeleteValidator = vine.compile(
  vine.object({
    ids: vine.array(
      vine
        .number()
        .exists(
          async (db, value) => await db.from('categories').select('id').where('id', value).first()
        )
    ),
  })
)

export { storeValidator, updateValidator, updateOrderValidator, bulkDeleteValidator }
