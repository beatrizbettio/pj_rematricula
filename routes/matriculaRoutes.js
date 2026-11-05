// Requere a biblioteca Router do express
const router = require('express').Router()
// Requere o controller no MatriculaController
const MatriculaController = require('../controllers/matriculaController')
// Requere a validação do token
const verifyToken = require('../helpers/verifyToken')
// Requere a validação do papel
const checkRole = require('../helpers/checkRole')
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
// Rota para visualizar estatisticas
router.get('/estatisticas', verifyToken, checkRole('SECRETARIA'), MatriculaController.painelEstatisticas)

// Rota para listar todas as matrículas
router.get('/', verifyToken, MatriculaController.listar)

// Rota para buscar uma matrícula por ID
router.get('/:id', verifyToken, MatriculaController.buscarPorId)

// Rota para atualizar o status de uma matrícula
router.patch('/:id', verifyToken, MatriculaController.atualizar)

// Rota para excluir uma matrícula
router.delete('/:id', verifyToken, MatriculaController.deletar)

module.exports = router