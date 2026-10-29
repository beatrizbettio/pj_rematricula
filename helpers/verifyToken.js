// Requere as variáveis .env
require('dotenv').config()
// Requere a biblioteca JWT
const jwt = require('jsonwebtoken')
// Requere o token de getToken
const getToken = require('./getToken')

// Função de verificar o token
function checkToken(req, res, next) {

  // Validação caso o token esteja vazio
  if (!req.headers.authorization) {
    return res.status(401).json({
      message: 'Acesso negado!'
    })
  }

  // Recuperar o token
  const token = getToken(req)

  // Validação caso não exista o token
  if (!token) {
    return res.status(401).json({
      message: 'Acesso Negado!'
    })
  }

  // Try-catch com validação caso o token seja inválido ou expirado
  try {
    const verified = jwt.verify(token, process.env.CHAVETOKEN)
    req.user = verified
    next()
  } catch (error) {
    return res.status(401).json({ 
      message: 'Acesso Negado!' 
    })
  }
}

module.exports = checkToken