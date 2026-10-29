// Requere as bibliotecas do express-validator
const { body, validationResult } = require('express-validator')

// Regras de Validações
const registerValidationRules = () => {
    return [
        body('name').notEmpty().withMessage('O nome é obrigatório'),
        body('email').notEmpty().withMessage('O e-email é obrigatório e deve ser válido'),
        body('password').notEmpty().withMessage('A senha é obrigatória')
    ]
}
// Regras de Validações da Matricula
const matriculaValidationRules = () => {
    return [
        body('turmaId').isInt().withMessage('O código da turma deve ser um número inteiro'),
        body('disciplinaId').isInt().withMessage('O código da disciplina deve ser um número inteiro')
    ]
}

// Validação
const validate = (req, res, next) => {
    const errors = validationResult(req)
    if(errors.isEmpty()){
        return next()
    }
    //Retorna o primeiro erro 
    return res.status(422).json({message: errors.array()[0].msg})
}

module.exports = {
    registerValidationRules,
    matriculaValidationRules,
    validate
}