// Requere as variáveis .env
require('dotenv').config()

// Requere o sequelize
const { Sequelize } = require('sequelize')

// Parâmetros de conexão
const conn = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: 3306,
        logging: false
    }
)

// Try-catch exibindo ao console se foi possível ou não a conexão com o banco
try{
    conn.authenticate()
    console.info('Banco de Dados conectado com sucesso!')
}catch(error){
    console.info('Não foi possível conectar ao banco: ', error)
}

module.exports = conn;