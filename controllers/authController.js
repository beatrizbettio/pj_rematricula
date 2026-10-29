const Usuario = require('../models/Usuario')
const bcrypt = require('bcrypt')
const createUserToken = require('../helpers/createUserToken')

module.exports = class AuthController {
  static async register(req, res) {
    const { name, email, password, role } = req.body

    const userExists = await Usuario.findOne({ where: { email: email } })
    if (userExists) {
      return res.status(422).json({ message: 'E-mail já cadastrado!' })
    }

    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    try {
      const newUser = await Usuario.create({
        name,
        email,
        password: passwordHash,
        role: role || 'ALUNO'
      })

      await createUserToken(newUser, req, res)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  static async login(req, res) {
    const { email, password } = req.body

    const user = await Usuario.findOne({ where: { email: email } })
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas!' })
    }

    const checkPassword = await bcrypt.compare(password, user.password)
    if (!checkPassword) {
      return res.status(401).json({ message: 'Credenciais inválidas!' })
    }

    await createUserToken(user, req, res)
  }
}