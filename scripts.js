const API_URL = 'http://localhost:5000';

let medicamentoSelecionado = null;
let medicamentoDelecao = null;

document.addEventListener('DOMContentLoaded', () => {
    inicializarNavegacao();
    inicializarFormularios();
    inicializarModais();
    carregarMedicamentos();
});
function inicializarNavegacao() {
    const navBtns = document.querySelectorAll('.nav-btn');

    navBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            navBtns.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            const pageName = btn.getAttribute('data-page');
            mostrarPagina(pageName);
        });
    });
}

function mostrarPagina(pageName) {
    const pages = document.querySelectorAll('.page');
    pages.forEach((page) => page.classList.remove('active'));

    const pageEl = document.getElementById(`${pageName}-page`);
    if (pageEl) {
        pageEl.classList.add('active');

        if (pageName === 'alertas') {
            carregarAlertas();
        } else if (pageName === 'historico') {
            carregarHistorico();
        } else if (pageName === 'medicamentos') {
            carregarMedicamentos();
        }
    }
}

function inicializarFormularios() {
    const formMedicamento = document.getElementById('form-medicamento');
    formMedicamento.addEventListener('submit', async (e) => {
        e.preventDefault();
        await adicionarMedicamento();
    });

    const formUso = document.getElementById('form-uso');
    formUso.addEventListener('submit', async (e) => {
        e.preventDefault();
        await registrarUso();
    });
}
async function carregarMedicamentos() {
    try {
        const response = await fetch(`${API_URL}/medicamentos`);
        const data = await response.json();

        const container = document.getElementById('medicamentos-container');
        const emptyState = document.getElementById('medicamentos-empty');

        container.innerHTML = '';

        if (data.medicamentos && data.medicamentos.length > 0) {
            emptyState.style.display = 'none';

            data.medicamentos.forEach((med) => {
                const card = criarCardMedicamento(med);
                container.appendChild(card);
            });
        } else {
            emptyState.style.display = 'block';
        }
    } catch (error) {
        console.error('Erro ao carregar medicamentos:', error);
        mostrarErro('Erro ao carregar medicamentos');
    }
}

function criarCardMedicamento(medicamento) {
    const card = document.createElement('div');
    card.className = 'medicamento-card';

    const emAlerta = medicamento.estoque_atual <= medicamento.estoque_minimo;
    if (emAlerta) {
        card.classList.add('alerta');
    }

    const percentual = Math.min(
        (medicamento.estoque_atual / (medicamento.estoque_minimo + 5)) * 100,
        100
    );

    const dataValidade = new Date(medicamento.data_validade);
    const dataFormatada = dataValidade.toLocaleDateString('pt-BR');

    const vencido = new Date() > dataValidade;

    card.innerHTML = `
        <div class="card-header">
            <div class="card-titulo">
                <h3>${medicamento.nome}</h3>
                <p class="card-dosagem">${medicamento.dosagem}</p>
            </div>
            ${emAlerta ? '<span class="card-alerta">BAIXO</span>' : ''}
        </div>

        <div class="card-info">
            <div class="info-item">
                <span class="info-label">Frequência</span>
                <span class="info-value">A cada ${medicamento.frequencia_horas}h</span>
            </div>
            <div class="info-item">
                <span class="info-label">Validade</span>
                <span class="info-value ${vencido ? 'style="color: #f44336"' : ''}">${dataFormatada}${vencido ? ' (VENCIDO)' : ''}</span>
            </div>
        </div>

        <div class="info-item">
            <span class="info-label">Estoque: ${medicamento.estoque_atual} unidades</span>
            <div class="estoque-barra ${emAlerta ? 'baixo' : ''}">
                <div class="estoque-preenchimento" style="width: ${percentual}%"></div>
            </div>
        </div>

        <div class="card-actions">
            <button class="btn-card btn-usar" onclick="abrirModalUso(${medicamento.id}, '${medicamento.nome}')">
                Registrar Uso
            </button>
            <button class="btn-card btn-deletar" onclick="abrirModalDeletar(${medicamento.id}, '${medicamento.nome}')">
                Deletar
            </button>
        </div>
    `;

    return card;
}

async function adicionarMedicamento() {
    const nome = document.getElementById('nome').value;
    const dosagem = document.getElementById('dosagem').value;
    const frequencia = parseInt(document.getElementById('frequencia').value);
    const estoque = parseInt(document.getElementById('estoque').value);
    const minimo = parseInt(document.getElementById('minimo').value);
    const validade = document.getElementById('validade').value;

    const mensagem = document.getElementById('form-message');

    try {
        const response = await fetch(`${API_URL}/medicamento`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nome,
                dosagem,
                frequencia_horas: frequencia,
                estoque_atual: estoque,
                estoque_minimo: minimo,
                data_validade: validade,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            mensagem.className = 'form-message success';
            mensagem.textContent = 'Medicamento cadastrado com sucesso!';

            document.getElementById('form-medicamento').reset();

            setTimeout(() => {
                carregarMedicamentos();
                mostrarPagina('medicamentos');
            }, 1500);
        } else {
            mensagem.className = 'form-message error';
            mensagem.textContent = data.message;
        }
    } catch (error) {
        console.error('Erro ao adicionar medicamento:', error);
        mensagem.className = 'form-message error';
        mensagem.textContent = 'Erro ao cadastrar medicamento';
    }
}

async function deletarMedicamento(medicamentoId) {
    try {
        const response = await fetch(`${API_URL}/medicamento/${medicamentoId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            mostrarSucesso('Medicamento deletado com sucesso');
            carregarMedicamentos();
            fecharModalDeletar();
        } else {
            mostrarErro('Erro ao deletar medicamento');
        }
    } catch (error) {
        console.error('Erro ao deletar:', error);
        mostrarErro('Erro ao deletar medicamento');
    }
}

async function registrarUso() {
    if (!medicamentoSelecionado) return;

    const observacao = document.getElementById('observacao').value;
    const mensagem = document.getElementById('uso-message');

    try {
        const response = await fetch(`${API_URL}/registro_uso`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                medicamento_id: medicamentoSelecionado,
                observacao: observacao || null,
            }),
        });

        if (response.ok) {
            mensagem.className = 'form-message success';
            mensagem.textContent = '✅ Uso registrado com sucesso!';

            document.getElementById('form-uso').reset();

            setTimeout(() => {
                fecharModal();
                carregarMedicamentos();
                carregarHistorico();
            }, 1500);
        } else {
            mensagem.className = 'form-message error';
            mensagem.textContent = '❌ Erro ao registrar uso';
        }
    } catch (error) {
        console.error('Erro ao registrar uso:', error);
        mensagem.className = 'form-message error';
        mensagem.textContent = '❌ Erro ao registrar uso';
    }
}

async function carregarHistorico() {
    try {
        const response = await fetch(`${API_URL}/historico`);
        const data = await response.json();

        const container = document.getElementById('historico-container');
        const emptyState = document.getElementById('historico-empty');

        container.innerHTML = '';

        if (data.registros && data.registros.length > 0) {
            emptyState.style.display = 'none';

            data.registros.forEach((registro) => {
                const item = criarItemHistorico(registro);
                container.appendChild(item);
            });
        } else {
            emptyState.style.display = 'block';
        }
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        mostrarErro('Erro ao carregar histórico');
    }
}

function criarItemHistorico(registro) {
    const item = document.createElement('div');
    item.className = 'registro-item';

    const data = new Date(registro.data_hora);
    const dataFormatada = data.toLocaleDateString('pt-BR');
    const horaFormatada = data.toLocaleTimeString('pt-BR');

    item.innerHTML = `
        <div class="registro-cabecalho">
            <span class="registro-medicamento">${registro.medicamento_nome}</span>
            <span class="registro-data">${dataFormatada} às ${horaFormatada}</span>
        </div>
        ${
            registro.observacao
                ? `<div class="registro-observacao">Observação: ${registro.observacao}</div>`
                : ''
        }
    `;

    return item;
}

async function carregarAlertas() {
    try {
        const response = await fetch(`${API_URL}/medicamentos/alertas`);
        const data = await response.json();

        const container = document.getElementById('alertas-container');
        const emptyState = document.getElementById('alertas-empty');

        container.innerHTML = '';

        if (data.medicamentos && data.medicamentos.length > 0) {
            emptyState.style.display = 'none';

            data.medicamentos.forEach((med) => {
                const card = criarCardMedicamento(med);
                container.appendChild(card);
            });
        } else {
            emptyState.style.display = 'block';
        }
    } catch (error) {
        console.error('Erro ao carregar alertas:', error);
        mostrarErro('Erro ao carregar alertas');
    }
}

function inicializarModais() {
    const modalUso = document.getElementById('modal-uso');
    const modalDeletar = document.getElementById('modal-deletar');

    window.addEventListener('click', (e) => {
        if (e.target === modalUso) {
            fecharModal();
        }
        if (e.target === modalDeletar) {
            fecharModalDeletar();
        }
    });

    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            if (btn.closest('#modal-uso')) {
                fecharModal();
            } else if (btn.closest('#modal-deletar')) {
                fecharModalDeletar();
            }
        });
    });
}

function abrirModalUso(medicamentoId, medicamentoNome) {
    medicamentoSelecionado = medicamentoId;
    document.getElementById('medicamento-nome').value = medicamentoNome;
    document.getElementById('observacao').value = '';
    document.getElementById('uso-message').innerHTML = '';

    const modal = document.getElementById('modal-uso');
    modal.classList.add('show');
}

function fecharModal() {
    const modal = document.getElementById('modal-uso');
    modal.classList.remove('show');
    medicamentoSelecionado = null;
}

function abrirModalDeletar(medicamentoId, medicamentoNome) {
    medicamentoDelecao = medicamentoId;
    document.getElementById('medicamento-deletar-nome').textContent = medicamentoNome;

    const modal = document.getElementById('modal-deletar');
    modal.classList.add('show');
}

function fecharModalDeletar() {
    const modal = document.getElementById('modal-deletar');
    modal.classList.remove('show');
    medicamentoDelecao = null;
}

function confirmarDelecao() {
    if (medicamentoDelecao) {
        deletarMedicamento(medicamentoDelecao);
    }
}

function mostrarSucesso(mensagem) {
    console.log(mensagem);
}

function mostrarErro(mensagem) {
    console.error(mensagem);
    alert(mensagem);
}
