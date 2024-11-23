import vine, { SimpleMessagesProvider } from '@vinejs/vine'

vine.messagesProvider = new SimpleMessagesProvider({
  required: 'Este campo é obrigatório',
  string: 'Este campo deve ser do tipo string',
  email: 'O email fornecido não é válido',
})
