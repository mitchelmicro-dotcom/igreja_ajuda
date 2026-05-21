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

// 3. Rota do Confessionário (Gera Token)
app.post('/api/enviar-mensagem', (req, res) => {
    const { mensagem } = req.body;
    const token = crypto.randomBytes(4).toString('hex').toUpperCase();
    console.log(`[CONFISSÃO] Token: ${token} | Mensagem: ${mensagem}`);
    res.json({ success: true, token: token });
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
// No server.js, adicione um armazenamento para as mensagens inicio  --->
let mensagensConfessario = []; 

// Atualize a rota de envio para salvar a mensagem
app.post('/api/enviar-mensagem', (req, res) => {
    const { mensagem } = req.body;
    const token = crypto.randomBytes(4).toString('hex').toUpperCase();
    
    // Salva o objeto no "banco" temporário
    mensagensConfessario.push({
        token: token,
        pergunta: mensagem,
        resposta: null, // Começa sem resposta
        data: new Date()
    });

    res.json({ success: true, token: token });
});

// Nova rota para o usuário consultar
app.get('/api/consultar-resposta/:token', (req, res) => {
    const tokenBusca = req.params.token.toUpperCase();
    const registro = mensagensConfessario.find(m => m.token === tokenBusca);

    if (!registro) {
        return res.json({ success: false, mensagem: "Token não encontrado." });
    }
    
    res.json({ 
        success: true, 
        resposta: registro.resposta || "Sua mensagem ainda está sendo analisada. Por favor, volte mais tarde." 
    });
});