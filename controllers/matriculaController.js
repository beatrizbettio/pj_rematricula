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

  // LER (READ) - Listar todas as matrículas
  static async listar(req, res) {
    const utilizador = req.user

    let opcoesBusca = {
      include: [
        {
          model: Usuario,
          attributes: ['nome', 'email', 'cumpriuPreRequisito'] // Traz apenas os campos essenciais
        }
      ],
      order: [['createdAt', 'DESC']]
    }

    // Se quem fez o pedido for ALUNO, restringimos a busca apenas ao seu ID
    if (utilizador.role === 'ALUNO') {
      opcoesBusca.where = { alunoId: utilizador.id }
    }

    // Se for SECRETARIA procura todas as matrículas no banco
    
    try {
      const matriculas = await Matricula.findAll(opcoesBusca)
      res.status(200).json({ total: matriculas.length, matriculas })
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar matrículas.', erro: error.message })
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

  // Estatisticas para Secretaria
  static async painelEstatisticas(req, res) {
    if (req.user.role !== 'SECRETARIA') {
      return res.status(403).json({ message: 'Acesso negado.' })
    }

    try {
      const ativas = await Matricula.count({ where: { status: 'MATRICULADO' } })
      const canceladas = await Matricula.count({ where: { status: 'CANCELADA' } })
      const total = ativas + canceladas

      res.status(200).json({
        resumo: {
          totalDeMatriculas: total,
          matriculasAtivas: ativas,
          matriculasCanceladas: canceladas,
          taxaDeRetencao: total > 0 ? `${((ativas / total) * 100).toFixed(1)}%` : '0%'
        }
      })
    } catch (error) {
      res.status(500).json({ message: 'Erro ao gerar estatísticas.' })
    }
  }
}