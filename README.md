**Escala Visual Digital (EVD)**
Protocolo de Percepção Alimentar — LANUM UFAL
Ferramenta digital para coleta de dados subjetivos sobre fome, desejo de comer e percepção pós-refeição, desenvolvida com foco em UX clínica e precisão na captura de dados nutricionais.

**Visão Geral**
A EVD digitaliza escalas analógicas de percepção alimentar, eliminando o ruído do papel e padronizando a coleta de dados para acompanhamento nutricional. O sistema foi projetado para minimizar vieses cognitivos e adaptar dinamicamente o formulário ao contexto temporal de cada participante.

**Decisões de Projeto**
1. Interface Sensorial — Sem Números Visíveis
Os sliders vão de 0 a 100 internamente, mas os valores não são exibidos ao usuário.

Por quê? Evita o viés de ancoragem. Ao ver um número, o participante tende a racionalizar a resposta com base em sessões anteriores. Sem referência numérica, a resposta reflete a sensação física do momento — dado mais fiel à realidade subjetiva.


2. Revalidação de Consentimento a Cada Sessão
Um modal obrigatório é exibido em todas as sessões, sem salvar o aceite no navegador.

Por quê? Segue protocolos de ética em pesquisa clínica (TCLE). Garante que o participante reconfirme o uso dos dados e releia a instrução crítica de manter o dispositivo em modo paisagem (horizontal) para precisão da escala linear.


3. Formulário Dinâmico por Contexto Temporal
O formulário se adapta conforme o tempo da última refeição:
SituaçãoPerguntas exibidasRefeição imediataPrazer e FamiliaridadeRefeição há mais tempoFome, Desejo e Capacidade

Por quê? Reduz a fadiga de decisão e elimina perguntas irrelevantes. Questionar "quanto você consegue comer?" logo após uma refeição polui a coleta. O sistema filtra o que é relevante para cada momento.


4. Explicações Técnicas por Escala
Cada seção exibe a pergunta como título, acompanhada de uma breve instrução fisiológica (ex: "Pense na sensação de estômago vazio").

Por quê? Padroniza a interpretação. O termo "fome" pode ser entendido de formas diferentes; a instrução direciona o participante aos sinais fisiológicos corretos, aumentando a acurácia dos dados.


**Implementação Técnica**
Arquitetura
evd/
├── index.html   # Estrutura e marcação
├── style.css    # Estética e responsividade
└── script.js    # Comportamento e lógica de envio
Design responsivo: sliders com largura de 95% para alinhamento consistente em diferentes tamanhos de tela, compensando paddings nativos de navegadores móveis.
Segurança e Integridade dos Dados

Trava de botão: Desabilitado imediatamente após o clique (texto muda para "Enviando..."), evitando duplicidade de registros e cobranças duplas na cota do EmailJS.
Payload inteligente: Perguntas não exibidas não enviam o valor padrão (50). O sistema registra "N/A (Pós-refeição)" ou "Não informado", mantendo o relatório limpo para o nutricionista.


**📱 Instruções de Uso**

Acesse o link → o modal de Termos e Instruções será exibido.
Gire o celular para o modo paisagem (horizontal).
Preencha seu nome e selecione o tempo da última refeição.
O formulário se adaptará automaticamente.
Deslize os marcadores de acordo com sua percepção no momento.
Clique em "Enviar Resposta".


**👨‍💻 Créditos**
Desenvolvido por Luan M. Tenório para o LANUM UFAL, com o objetivo de modernizar e digitalizar protocolos de acompanhamento nutricional clínico.
