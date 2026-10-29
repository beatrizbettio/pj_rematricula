// Requere a biblioteca Router do express
const router = require('express').Router()
// Requere o controller no MatriculaController
const MatriculaController = require('../controllers/matriculaController')
// Requere a validação do token
const verifyToken = require('../helpers/verify-token')
// Requere a validação do papel
const checkRole = require('../helpers/check-role')
// Requere as validações
const { matriculaValidationRules, validate } = require('../helpers/userValidator')

// Rota solicitar
router.post(
  '/solicitar',
  verifyToken,
  checkRole('ALUNO'),
  matriculaValidationRules(),
  validate,
  MatriculaController.solicitar
)

module.exports = router