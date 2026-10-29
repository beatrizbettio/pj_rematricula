// Requere as variáveis .env
require('dotenv').config()
// Requere a biblioteca JWT
const jwt = require('jsonwebtoken')

// Cria o método para gerar o token
const createUserToken = async(user, req, res)=>{
    const token = jwt.sign(
        {
            id: user.id,
            nome: user.name,
            email: user.email,
            role: user.role
        },
        process.env.CHAVETOKEN
    )

    // Retorna o token
    res.status(200).json({
        message: 'Autenticado com sucesso!',
        token: token,
        userId: user.id
    })
}

module.exports = createUserToken