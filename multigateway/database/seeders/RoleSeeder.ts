import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'

export default class RoleSeeder extends BaseSeeder {
  public async run() {
    // Como estamos usando enum diretamente no modelo User,
    // este seeder serve apenas para fins de documentação.
    // Os roles são: 'ADMIN', 'MANAGER', 'FINANCE', 'USER'

    // Se no futuro migrarmos para uma tabela de roles separada,
    // podemos descomentar e adaptar o código abaixo:

    /*
    await Database.table('roles').multiInsert([
      {
        name: 'ADMIN',
        description: 'Administrator with full access'
      },
      {
        name: 'MANAGER',
        description: 'Can manage products and users'
      },
      {
        name: 'FINANCE',
        description: 'Can manage products and process refunds'
      },
      {
        name: 'USER',
        description: 'Regular user with limited access'
      }
    ])
    */
  }
}
