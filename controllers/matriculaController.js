const Usuario = require('../models/Usuario')
const Matricula = require('../models/Matricula')

module.exports = class MatriculaController {
  // SOLICITAR - Solicita nova matrícula
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

  // LER (READ) - Listar todas as matrículas do aluno logado
  static async listar(req, res) {
    const alunoId = req.user.id
    try {
      const matriculas = await Matricula.findAll({ where: { alunoId: alunoId } })
      res.status(200).json({ matriculas })
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar matrículas.' })
    }
  }

  // LER (READ) - Buscar uma matrícula específica pelo ID
  static async buscarPorId(req, res) {
    const { id } = req.params
    try {
      const matricula = await Matricula.findByPk(id)
      
      if (!matricula) {
        return res.status(404).json({ message: 'Matrícula não encontrada.' })
      }

      res.status(200).json({ matricula })
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar matrícula.' })
    }
  }

  // ATUALIZAR (UPDATE) - Atualizar o status da matrícula
  static async atualizar(req, res) {
    const { id } = req.params
    const { status } = req.body

    try {
      const matricula = await Matricula.findByPk(id)
      
      if (!matricula) {
        return res.status(404).json({ message: 'Matrícula não encontrada.' })
      }

      matricula.status = status || matricula.status
      await matricula.save()

      res.status(200).json({ message: 'Matrícula atualizada com sucesso!', matricula })
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar matrícula.' })
    }
  }

  // APAGAR (DELETE) - Excluir uma matrícula do banco de dados
  static async deletar(req, res) {
    const { id } = req.params

    try {
      const matricula = await Matricula.findByPk(id)
      
      if (!matricula) {
        return res.status(404).json({ message: 'Matrícula não encontrada.' })
      }

      await matricula.destroy()
      res.status(200).json({ message: 'Matrícula excluída com sucesso!' })
    } catch (error) {
      res.status(500).json({ message: 'Erro ao excluir matrícula.' })
    }
  }
}