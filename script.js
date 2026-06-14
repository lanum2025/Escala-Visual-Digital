// --- LÓGICA DO MODAL (TERMOS) ---
function aceitarTermos() {
    const modal = document.getElementById('modalTermos');
    if (modal) modal.style.display = 'none';
}


// --- INICIALIZAÇÃO EMAILJS ---
(function() {
    emailjs.init("ymPrb8uXsA_vimgr-");
})();

// --- LÓGICA DE INTERFACE (MOSTRAR/ESCONDER CAMPOS) ---
document.getElementById('ultimaRefeicao').addEventListener('change', function() {
    const valor = this.value;
    const prazerContainer = document.getElementById('prazerosaContainer');
    const familiarContainer = document.getElementById('familiarContainer');
    const perguntasPadrao = document.getElementById('perguntasPadrao');

    // 1. Estado inicial (vazio ou ---) -> Esconde tudo
    if (valor === "" || valor === "---") {
        prazerContainer.style.display = 'none';
        familiarContainer.style.display = 'none';
        perguntasPadrao.style.display = 'none';
    } 
    // 2. Acabou de comer -> Mostra prazer/familiar e esconde fome
    else if (valor === 'Jantar' || valor === 'Imediato') {
        prazerContainer.style.display = 'block';
        familiarContainer.style.display = 'block';
        perguntasPadrao.style.display = 'none';
    } 
    // 3. Outros tempos -> Mostra fome e esconde prazer/familiar
    else {
        prazerContainer.style.display = 'none';
        familiarContainer.style.display = 'none';
        perguntasPadrao.style.display = 'block';
    }
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

// --- EVENTO DE SUBMIT (ENVIO INTELIGENTE) ---
document.getElementById('fomeForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const btn = event.submitter || document.querySelector('button[type="submit"]');
    if (btn.disabled) return;

    btn.disabled = true;
    btn.textContent = "Enviando... aguarde";

    const timing = document.getElementById('ultimaRefeicao').value;
    const isImediato = (timing === 'Jantar' || timing === 'Imeditado');

    // 1. Criamos o objeto com os dados básicos
    const dados = {
        nome: document.getElementById('nome').value,
        hora: timing,
        ultima: document.getElementById('tipoRefeicao').value,
        consumiuAlmoco: (function() {
            const sel = document.querySelector('input[name="consumiuAlmoco"]:checked');
            return sel ? sel.value : 'N/A';
        })()
    };

    // 2. Filtramos as escalas baseado na escolha do usuário
    if (isImediato) {
        dados.fome = "N/A (Pós-refeição)";
        dados.cheio = "N/A (Pós-refeição)";
        dados.desejo = "N/A (Pós-refeição)";
        dados.capacidade = "N/A (Pós-refeição)";
        dados.prazerosa = document.getElementById('prazerosa').value;
        dados.familiar = document.getElementById('familiar').value;
    } else {
        dados.fome = document.getElementById('fome').value;
        dados.cheio = document.getElementById('cheio').value;
        dados.desejo = document.getElementById('desejoComer').value;
        dados.capacidade = document.getElementById('consegueComer').value;
        dados.prazerosa = "Não informado";
        dados.familiar = "Não informado";
    }
    
    // 3. ENVIO REAL PELO EMAILJS
    emailjs.send('service_l5eds5p', 'template_nuppf1f', dados)
        .then(() => {
            document.getElementById('nomeResposta').textContent = dados.nome;
            document.getElementById('formContainer').style.display = 'none';
            document.getElementById('resposta').style.display = 'block';
        })
        .catch(err => {
            console.error("Erro no envio:", err);
            alert("Erro ao enviar: " + JSON.stringify(err));
            btn.disabled = false;
            btn.textContent = "Enviar Resposta";
        });
});