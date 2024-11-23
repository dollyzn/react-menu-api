import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import env from '#start/env'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    const email = env.get('ADMIN_USER')
    await User.firstOrCreate(
      { email },
      {
        email,
        password: env.get('ADMIN_PASS'),
      }
    )
  }
}
