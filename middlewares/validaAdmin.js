/**
 * ARQUIVO: middlewares/validaAdmin.js
 * Objetivo: Proteger rotas e páginas que só o administrador pode acessar
 * Autor: Michel Santos
 * Data: 24/05/2026
 * */

function validaAdmin(req, res, next) {
    //1. Verificamoos se o objeto de sessão existe e se o status é 'SIM'
    //(Exatamente a mesma lógica que você usava no $_SESSION do PHP)
    if (req.session && req.session.autenticado === 'SIM') {

        //2. A função next() é o segredo do Node.js!
        // Ela diz: "Está tudo certo com a sessão , pode deixar o usuário passar para a rota que ele quer acessar"
        return next();
    }else {
        //3. Se a sessão não existir ou o status for diferente de 'SIM', vamos barrar e redirecionar
        //  Mandamos o usuário para a página de login (index) com o aviso na URL de que ele precisa se autenticar
        return res.redirect('/index.html?login=erro2');
    }

}

//4. Esportamos essa função para que o server.js consiga "enxergar" ela e usar como middleware
module.exports = validaAdmin;