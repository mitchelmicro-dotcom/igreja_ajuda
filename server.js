/**
 * ARQUIVO: server.js - Backend Node.js
 * Comentários detalhados para cada funcionalidade.
 */

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// BANCO DE DADOS TEMPORÁRIO (Lista de Versículos)
let versiculos = [
    { nome: "Irmão Michel", texto: "O Senhor é meu pastor, nada me faltará." },
    { nome: "Irmã Maria", texto: "Tudo posso naquele que me fortalece." }
];

// ADICIONE ESTA LINHA PARA ARMAZENAR AS MENSAGENS DO CONFESSIONÁRIO
let conselho = [];

// --- ROTAS DA API ---

// 1. Rota para buscar todos os versículos
app.get('/api/versiculos', (req, res) => {
    res.json(versiculos);
});

// 2. Rota para postar novo versículo (Simulando aprovação automática)
app.post('/api/postar-versiculo', (req, res) => {
    const { nome, texto } = req.body;
    versiculos.push({ nome, texto }); // Adiciona na lista
    console.log(`[MOSAICO] Novo versículo de ${nome}`);
    res.json({ success: true });
});

// 3. Rota do Confessionário (Gera Token e Salva Mensagem)
app.post('/api/enviar-mensagem', (req, res) => {
    const { mensagem } = req.body;

    let tokenUnico = false;
    let token = '';

    //Lógica para gerar um token aleatório e garantir que não é repetido
    while (!tokenUnico) {
        // gera 2 bytes aleatórios e converte para hexadecimal (ex: "A1B2")

        const codigo = crypto.randomBytes(2).toString('hex').toUpperCase();
        token = `CONSELHO-${codigo}`; // Fica no formato: CONSELHO-A8F3

        // Verifica no nosso "banco" (array) se o token já existe
        const tokenJaExiste = conselho.find(c => c.token === token);

        if (!tokenJaExiste) {
            tokenUnico = true; // Se não achou nenhum igual, o token é válido
        }

    }

    // Salva a mensagem anônima, o token e deixa a resposta vazia
    conselho.push({
        token: token,
        mensagem: mensagem,
        resposta: '' // Fica vazio até o administrador responder
    });

    console.log(`[CONFISSÃO SALVA] Token: ${token} | Mensagem: ${mensagem}`);

    //De volve o token para o front-end ( o script.js já estyá programado para mostrar isso na tela)
    res.json({ success: true, token: token});

});

// 4. Rota de Doação
app.post('/api/doar', (req, res) => {
    console.log(`[DOAÇÃO] Intenção de R$ ${req.body.valor}`);
    res.json({ success: true, mensagem: "Obrigado por sua generosidade!" });
});

// INICIAR SERVIDOR
app.listen(PORT, () => {
    console.log(`Servidor Elo Comunitário rodando em http://localhost:${PORT}`);
});







//inicio do novo código

// Nova rota para o usuário consultar a resposta do confessionário
app.get('/api/consultar-resposta/:token', (req, res) => {
    const tokenBusca = req.params.token.toUpperCase();
    
    // Procura o token dentro da nossa lista oficial "conselho"
    const registro = conselho.find(m => m.token === tokenBusca);

    if (!registro) {
        return res.json({ success: false, mensagem: "Token não encontrado. Verifique se digitou corretamente." });
    }
    
    // Se achou, mas a resposta ainda está vazia
    if (registro.resposta === '') {
        return res.json({ success: true, resposta: "Sua mensagem ainda está sendo analisada. Por favor, volte mais tarde." });
    }

    // Se achou e tem resposta do administrador
    res.json({ success: true, resposta: registro.resposta });
});