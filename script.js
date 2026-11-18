// --- LÓGICA DO MODAL (TERMOS) ---
function aceitarTermos() {
    const modal = document.getElementById('modalTermos');
    if (modal) modal.style.display = 'none';
}

const URL_APPS_SCRIPT = "https://script.google.com/macros/s/AKfycbyxI65qP7Duk_rQUbcpVfmHMFzMmfM25yHcQ9-fcEuBz8cb638WvGKAj8kk_b9wKwIjbw/exec";

async function enviarEmail(dados) {
  const resposta = await fetch(URL_APPS_SCRIPT, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(dados),
  });
  const json = await resposta.json();
  if (!json.success) throw new Error(json.message || "Falha ao enviar");
  return json;
}
// --- LÓGICA DE INTERFACE (MOSTRAR/ESCONDER CAMPOS) ---
document.getElementById('ultimaRefeicao').addEventListener('change', function() {
    const perguntasPadrao = document.getElementById('perguntasPadrao');
    // Vazio ou "---" esconde as perguntas; qualquer tempo escolhido mostra
    perguntasPadrao.style.display = (this.value === "" || this.value === "---") ? 'none' : 'block';
});

// --- LÓGICA CONDICIONAL: PERGUNTA EXTRA PARA ALMOÇO ---
document.getElementById('tipoRefeicao').addEventListener('change', function() {
    const container = document.getElementById('almocoPerguntaContainer');
    if (this.value === 'Almoço') {
        container.style.display = 'block';
        container.querySelectorAll('input[name="consumiuAlmoco"]').forEach(r => r.required = true);
    } else {
        container.style.display = 'none';
        container.querySelectorAll('input[name="consumiuAlmoco"]').forEach(r => {
            r.required = false;
            r.checked = false;
        });
    }
});

// --- EVENTO DE SUBMIT ---
document.getElementById('fomeForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const btn = event.submitter || document.querySelector('button[type="submit"]');
    if (btn.disabled) return;

    btn.disabled = true;
    btn.textContent = "Enviando... aguarde";

    const timing = document.getElementById('ultimaRefeicao').value;

    // Monta o objeto com as respostas
    const dados = {
        nome: document.getElementById('nome').value,
        hora: timing,
        ultima: document.getElementById('tipoRefeicao').value,
        consumiuAlmoco: (function() {
            const sel = document.querySelector('input[name="consumiuAlmoco"]:checked');
            return sel ? sel.value : 'N/A';
        })(),
        fome: document.getElementById('fome').value,
        cheio: document.getElementById('cheio').value,
        desejo: document.getElementById('desejoComer').value,
        capacidade: document.getElementById('consegueComer').value
    };

    // Envio real pelo Web3Forms
    enviarEmail(dados)
        .then(() => {
            document.getElementById('nomeResposta').textContent = dados.nome;
            document.getElementById('formContainer').style.display = 'none';
            document.getElementById('resposta').style.display = 'block';
        })
        .catch(err => {
            console.error("Erro no envio:", err);
            alert("Não foi possível enviar agora. Tente novamente em instantes.\n\n(" + (err.message || err) + ")");
            btn.disabled = false;
            btn.textContent = "Enviar Resposta";
        });
});
