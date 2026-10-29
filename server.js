// Requere as variáveis .env
require('dotenv').config()
// Requere o express
const express = require('express')
// Requere o cors
const cors = require('cors')
// Requere a conexão
const conn = require('./db/conn')
// Requere os Models
const Usuario = require('./models/Usuario')
const Matricula = require('./models/Matricula')
// Requere as Rotas
const authRoutes = require('./routes/authRoutes')
const matriculaRoutes = require('./routes/matriculaRoutes')

// Instância do express
const api = express()

// Configurando JSON response
api.use(express.json())

// Configurando cors
api.use(cors({ credentials: true, origin: 'http://localhost:3030' }))

// Registro das Rotas
api.use('/users', authRoutes)
api.use('/matriculas', matriculaRoutes)

// Recebe o número da porta
const PORT = process.env.PORT

// Executa a api
conn.sync()
    .then(() => {
        api.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))
    })
    .catch((error) => console.info('Erro ao conectar ao banco:', error))