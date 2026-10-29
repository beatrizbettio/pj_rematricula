const Usuario = require('../models/Usuario')
const Matricula = require('../models/Matricula')

module.exports = class MatriculaController {
  static async solicitar(req, res) {
    const { turmaId, disciplinaId } = req.body
    const alunoId = req.user.id

    try {
      const aluno = await Usuario.findByPk(alunoId)

      if (!aluno) {
        return res.status(444).json({ message: 'Aluno não encontrado!' })
      }

      // Regra 1: Débito financeiro
      if (aluno.possuiDebito) {
        return res.status(400).json({
          message: 'Rematrícula bloqueada: Pendência financeira ativa junto à instituição!'
        })
      }

      // Regra 2: Pré-requisito acadêmico
      if (!aluno.cumpriuPreRequisito) {
        return res.status(400).json({
          message: 'Rematrícula não permitida: Pré-requisito acadêmico obrigatório não cumprido!'
        })
      }

      const novaMatricula = await Matricula.create({
        alunoId,
        turmaId,
        disciplinaId,
        status: 'MATRICULADO'
      })

      res.status(201).json({
        message: 'Rematrícula solicitada com sucesso!',
        dados: novaMatricula
      })
    } catch (error) {
      res.status(500).json({ message: 'Erro interno ao processar rematrícula.' })
    }
  }
}