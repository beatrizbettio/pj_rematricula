// Requere somente o método DataTypes do Sequelize
const { DataTypes } = require('sequelize')
// Requere a conexão com o banco
const conn = require('../db/conn')

// Define o model Usuario
const Usuario = conn.define('usuarios', {
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('ALUNO', 'PROFESSOR', 'SECRETARIA'),
      defaultValue: 'ALUNO'
    },
    possuiDebito: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    cumpriuPreRequisito: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
})

module.exports = Usuario
