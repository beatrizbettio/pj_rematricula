// Requere somente o método DataTypes do Sequelize
const { DataTypes } = require('sequelize')
// Requere a conexão com o banco
const conn= require('../db/conn')

// Define o model Matricula
const Matricula = conn.define('matriculas', {
  alunoId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  turmaId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  disciplinaId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'MATRICULADO'
  }
})

module.exports = Matricula