// Requere a biblioteca Router do express
const router = require('express').Router()
// Requere o controller no AuthController
const AuthController = require('../controllers/authController')
// Requere as validações
const { registerValidationRules, validate } = require('../helpers/userValidator')
// Requere os helpers de validação do token e verificação do papel (role)
const verifyToken = require('../helpers/verifyToken')
const checkRole = require('../helpers/checkRole')

// Rotas
// Register (apenas autenticado com o papel SECRETARIA pode cadastrar)
router.post(
  '/register',
  verifyToken,
  checkRole('SECRETARIA'),
  registerValidationRules(),
  validate,
  AuthController.register
)
// Login
router.post('/login', AuthController.login)

module.exports = router