// Função que recebe o objeto da requisição HTTP como parâmetro
const getToken = (req) => {

    // Acessa e guarda o cabeçalho "authorization" vindo da requisição HTTP
    const authHeader = req.headers.authorization

    // Verifica se o cabeçalho foi enviado e se não existir interrompe 
    if(!authHeader) return null

    // Divide a string do cabeçalho pelo espaço em branco e pega o segundo elemento que é o token
    const token = authHeader.split(" ")[1]

    // Retorna a string contendo apenas o token JWT
    return token
}

module.exports = getToken