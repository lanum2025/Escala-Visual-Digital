// --- LÓGICA DO MODAL (TERMOS) ---
function aceitarTermos() {
    const modal = document.getElementById('modalTermos');
    if (modal) modal.style.display = 'none';
}


// --- ENVIO DE E-MAIL (WEB3FORMS COM CHAVE RESERVA) ---
// Cole aqui as Access Keys geradas em web3forms.com (uma por e-mail).
// Se a primeira estourar o limite, o código tenta a próxima automaticamente.
const CHAVES_WEB3FORMS = [
    "de056186-5d10-4c51-b7e7-7fea9bbd6826",
    // "COLE_AQUI_A_CHAVE_2",
];

// Monta os campos do e-mail com as perguntas como rótulo, na ordem do template antigo.
// O Web3Forms usa o nome de cada campo como título no e-mail.
function camposEmail(d) {
    return {
        "Nome": d.nome,
        "Quanto você está sentindo fome neste momento?": d.fome,
        "O quão cheio você se sente agora?": d.cheio,
        "O quanto você deseja comer agora?": d.desejo,
        "Quanto você acha que consegue comer agora?": d.capacidade,
        "Quando foi sua última refeição?": d.hora,
        "Qual foi sua última refeição?": d.ultima,
        "Consumiu algum alimento ou bebida após o almoço?": d.consumiuAlmoco
    };
}

async function enviarEmail(dados) {
    let ultimoErro = new Error("Nenhuma chave configurada");

    for (const chave of CHAVES_WEB3FORMS) {
        try {
            const resposta = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({
                    access_key: chave,
                    subject: "Uma mensagem de " + dados.nome + " foi recebida.",
                    from_name: "EVD - LANUM UFAL",
                    ...camposEmail(dados)
                })
            });
            const json = await resposta.json();
            if (json.success) return json;
            ultimoErro = new Error(json.message || "Falha ao enviar");
        } catch (e) {
            ultimoErro = e;
        }
    }
    throw ultimoErro;
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
