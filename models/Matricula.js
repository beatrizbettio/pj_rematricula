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
const Usuario = require('./Usuario')

// Uma Matrícula pertence a um Utilizador
Matricula.belongsTo(Usuario, { foreignKey: 'alunoId' })
// Um Utilizador pode ter várias Matrículas
Usuario.hasMany(Matricula, { foreignKey: 'alunoId' })

module.exports = Matricula