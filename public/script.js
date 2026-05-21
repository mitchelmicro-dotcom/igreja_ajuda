/**
 * ARQUIVO: public/script.js
 * Comentários para entender a lógica de cada página.
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- FUNÇÃO: CARREGAR VERSÍCULOS NO MOSAICO ---
    async function carregarVersiculos() {
        const res = await fetch('/api/versiculos');
        const dados = await res.json();

        // Alvos na tela (Index e Página Comunidade)
        const divIndex = document.getElementById('listaVersiculosIndex');
        const divMosaico = document.getElementById('mosaicoCompleto');

        let htmlContent = "";
        dados.forEach(item => {
            htmlContent += `<p class="mb-2"><strong>${item.nome}:</strong> ${item.texto}</p>`;
        });

        if (divIndex) divIndex.innerHTML = htmlContent;
        if (divMosaico) divMosaico.innerHTML = htmlContent;
    }

    // Chama a função ao abrir qualquer página
    carregarVersiculos();

    // --- FORMULÁRIO: POSTAR VERSÍCULO ---
    const formVer = document.getElementById('formVersiculo');
    if (formVer) {
        formVer.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nome = document.getElementById('nomeMembro').value;
            const texto = document.getElementById('textoVersiculo').value;

            await fetch('/api/postar-versiculo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, texto })
            });

            alert("Sua palavra foi enviada ao Mosaico!");
            formVer.reset();
            carregarVersiculos(); // Atualiza a lista na hora
        });
    }

    // --- FORMULÁRIO: CONFISSIONÁRIO ---
    const formConf = document.getElementById('formConfissao');
    if (formConf) {
        formConf.addEventListener('submit', async (e) => {
            e.preventDefault();
            const mensagem = document.getElementById('mensagem').value;
            const res = await fetch('/api/enviar-mensagem', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mensagem })
            });
            const data = await res.json();
            document.getElementById('resultadoToken').classList.remove('d-none');
            document.getElementById('tokenGerado').innerText = data.token;
        });
    }

    // --- FORMULÁRIO: DOAÇÃO ---
    const formDoa = document.getElementById('formDoacao');
    if (formDoa) {
        formDoa.addEventListener('submit', async (e) => {
            e.preventDefault();
            const valor = document.getElementById('valorDoacao').value;
            const res = await fetch('/api/doar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ valor })
            });
            const data = await res.json();
            alert(data.mensagem);
        });
    }

    //inicio do novo código para consulta de resposta do confessionário
    const btnConsultar = document.getElementById('btnConsultar');
        if (btnConsultar) {
            btnConsultar.addEventListener('click', async () => {
                const token = document.getElementById('inputToken').value;
                const res = await fetch(`/api/consultar-resposta/${token}`);
                const data = await res.json();
                
                const area = document.getElementById('areaResposta');
                const texto = document.getElementById('textoResposta');
                
                area.classList.remove('d-none');
                if (data.success) {
                    texto.innerText = data.resposta;
                } else {
                    texto.innerText = data.mensagem;
                }
            });
        }
});