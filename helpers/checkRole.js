// Realiza a autorização baseada em papéis
const checkRole = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user || !rolesPermitidos.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Acesso negado! Perfil não autorizado para esta operação.'
      })
    }
    next()
  }
}

module.exports = checkRole;