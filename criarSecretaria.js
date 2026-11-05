const bcrypt = require('bcrypt')
const Usuario = require('./models/Usuario') 
const conn = require('./db/conn') 

async function criarPrimeiraSecretaria() {
  try {
    // Sincroniza e liga à base de dados
    await conn.sync()

    // Encripta a palavra-passe '123456'
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash('123456', salt)

    // Cria o utilizador com o papel SECRETARIA
    await Usuario.create({
      nome: 'Secretaria Principal',
      email: 'secretaria@teste.com',
      senha: passwordHash,
      role: 'SECRETARIA',
      possuiDebito: false,
      cumpriuPreRequisito: true
    })

    console.log('Secretaria criada com sucesso no banco de dados!')
    process.exit(0)
  } catch (error) {
    console.error('Erro ao criar secretaria:', error)
    process.exit(1)
  }
}

criarPrimeiraSecretaria()