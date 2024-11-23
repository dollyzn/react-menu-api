import vine from '@vinejs/vine'

export const uuidValidator = vine.compile(vine.string().uuid())

export const numberValidator = vine.compile(vine.number())
