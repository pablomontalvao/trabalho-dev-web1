class AdminComplaintManager {
    constructor() {
        this.complaints = [];
        this.currentComplaintId = null;
        this.init();
    }

    init() {
        console.log('Inicializando AdminComplaintManager...');
        this.setupFilters();
        this.loadComplaintsFromServer();
        this.setupStatusForm();
        console.log('AdminComplaintManager inicializado');
    }

    setupFilters() {
        const statusFilter = document.getElementById('f-status');
        const enderecoFilter = document.getElementById('f-endereco');
        const tipoFilter = document.getElementById('f-tipo');
        const dataInicioFilter = document.getElementById('f-data-inicio');
        const dataFimFilter = document.getElementById('f-data-fim');
        const clearFiltersBtn = document.getElementById('clear-filters-btn');

        [statusFilter, enderecoFilter, tipoFilter, dataInicioFilter, dataFimFilter].forEach(filter => {
            if (filter) {
                filter.addEventListener('input', () => this.applyFilters());
            }
        });

        clearFiltersBtn.addEventListener('click', () => this.clearFilters());

        this.showAllCards();
    }

    clearFilters() {
        document.getElementById('f-status').value = '';
        document.getElementById('f-endereco').value = '';
        document.getElementById('f-tipo').value = '';
        document.getElementById('f-data-inicio').value = '';
        document.getElementById('f-data-fim').value = '';

        document.getElementById('no-results-message').style.display = 'none';

        this.showAllCards();
    }

    showAllCards() {
        const cards = document.querySelectorAll('.card');
        cards.forEach((card) => {
            card.style.display = 'grid';
        });
    }

    async loadComplaintsFromServer() {
        try {
            const response = await fetch('../php/listar_reclamacoes.php');
            const result = await response.json();

            if (result.status === 'success') {
                const cardsList = document.getElementById('claims-list');
                if (cardsList) {
                    cardsList.innerHTML = '';
                }
                this.complaints = [];

                result.data.forEach(complaint => {
                    this.complaints.push(complaint);
                    this.addComplaintCard(complaint);
                });

                console.log(`Carregadas ${result.data.length} reclamações do servidor`);
            } else {
                console.error('Erro ao carregar reclamações:', result.message);
                this.showSuccessMessage('Erro ao carregar reclamações', 'error');
            }
        } catch (error) {
            console.error('Erro ao carregar reclamações:', error);
            this.showSuccessMessage('Erro ao carregar reclamações', 'error');
        }
    }

    addComplaintCard(complaint) {
        const cardsList = document.getElementById('claims-list');
        if (!cardsList) return;

        const card = document.createElement('li');
        card.className = 'card';
        card.dataset.id = complaint.id;
        card.dataset.status = complaint.status;

        const enderecoCompleto = complaint.complemento
            ? `${complaint.endereco}, ${complaint.numero} - ${complaint.complemento}`
            : `${complaint.endereco}, ${complaint.numero}`;

        // Formatar data
        const dataFormatada = complaint.data_ocorrencia ?
            new Date(complaint.data_ocorrencia).toLocaleDateString('pt-BR') :
            complaint.data;

        // Determinar ícone e texto do status
        let statusIcon, statusText, statusClass;
        switch (complaint.status) {
            case 'recebido':
                statusIcon = '../imagem/checkRecebido.png';
                statusText = 'Recebido';
                statusClass = 'status--recebido';
                break;
            case 'andamento':
                statusIcon = '../imagem/checkEmAndamento.png';
                statusText = 'Em andamento';
                statusClass = 'status--andamento';
                break;
            case 'resolvido':
                statusIcon = '../imagem/checkResolvido.png';
                statusText = 'Resolvido';
                statusClass = 'status--resolvido';
                break;
            default:
                statusIcon = '../imagem/checkRecebido.png';
                statusText = 'Recebido';
                statusClass = 'status--recebido';
        }

        card.innerHTML = `
          <div class="card__status">
            <span class="status__label">Status</span>
            <img class="status__icon" src="${statusIcon}" alt="Ícone status" />
            <span class="status__text ${statusClass}">${statusText}</span>
          </div>
          <div class="card__body">
            <div class="card__grid">
              <div class="card__col"><span class="label">Tipo:</span><span class="value">${complaint.tipo}</span></div>
              <div class="card__col"><span class="label">Endereço:</span><span class="value">${enderecoCompleto}</span></div>
              <div class="card__col"><span class="label">Data:</span><span class="value">${dataFormatada}</span></div>
              <div class="card__col"><span class="label">Hora:</span><span class="value">${complaint.hora_ocorrencia || ''}</span></div>
              <div class="card__col card__col--full"><span class="label">Descrição:</span><span class="value">${complaint.descricao}</span></div>
            </div>
            <div class="card__actions">
              <button class="btn btn--small" onclick="viewDetails(${complaint.id})">Ver Detalhes</button>
            </div>
          </div>
        `;

        cardsList.insertBefore(card, cardsList.firstChild);
    }

    setupStatusForm() {
        console.log('Configurando formulário de status...');
        const form = document.getElementById('status-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Formulário de status submetido');
                this.submitStatusUpdate();
            });
            console.log('Formulário de status configurado com sucesso');
        } else {
            console.error('Formulário de status não encontrado!');
        }
    }

    applyFilters() {
        const statusFilter = document.getElementById('f-status').value;
        const enderecoFilter = document.getElementById('f-endereco').value.toLowerCase();
        const tipoFilter = document.getElementById('f-tipo').value;
        const dataInicioFilter = document.getElementById('f-data-inicio').value;
        const dataFimFilter = document.getElementById('f-data-fim').value;

        const cards = document.querySelectorAll('.card');
        let visibleCardsCount = 0;

        const inicioDate = dataInicioFilter ? new Date(`${dataInicioFilter}T00:00:00`) : null;
        const fimDate = dataFimFilter ? new Date(`${dataFimFilter}T00:00:00`) : null;

        cards.forEach(card => {
            let show = true;
            const status = card.dataset.status;
            const tipo = card.querySelector('.card__col:first-child .value').textContent;
            const endereco = card.querySelector('.card__col:nth-child(2) .value').textContent.toLowerCase();
            const dataTexto = card.querySelector('.card__col:nth-child(3) .value').textContent;

            if (statusFilter && status !== statusFilter) {
                show = false;
            }

            if (enderecoFilter && !endereco.includes(enderecoFilter)) {
                show = false;
            }

            if (tipoFilter && tipo !== tipoFilter) {
                show = false;
            }

            if (show && (inicioDate || fimDate)) {
                const [dia, mes, ano] = dataTexto.split('/');
                const cardDate = new Date(ano, mes - 1, dia);

                if (inicioDate && cardDate < inicioDate) {
                    show = false;
                }

                if (fimDate && cardDate > fimDate) {
                    show = false;
                }
            }

            card.style.display = show ? 'grid' : 'none';
            if (show) {
                visibleCardsCount++;
            }
        });



        const noResultsMessage = document.getElementById('no-results-message');
        if (visibleCardsCount === 0) {
            noResultsMessage.style.display = 'block';
        } else {
            noResultsMessage.style.display = 'none';
        }
    }

    updateComplaintStatus(id, newStatus, notes = '') {
        const complaint = this.complaints.find(c => c.id === id);
        if (complaint) {
            complaint.status = newStatus;
            complaint.notes = notes;
            complaint.lastUpdate = new Date().toLocaleString('pt-BR');

            this.updateCardStatus(id, newStatus);

            console.log(`Status atualizado para ID ${id}: ${newStatus}`);

            return true;
        }
        return false;
    }

    updateCardStatus(id, newStatus) {
        const card = document.querySelector(`[data-id="${id}"]`);
        if (card) {
            card.dataset.status = newStatus;

            const statusIcon = card.querySelector('.status__icon');
            const statusText = card.querySelector('.status__text');

            if (statusIcon && statusText) {
                statusText.className = 'status__text';

                switch (newStatus) {
                    case 'recebido':
                        statusIcon.src = '../imagem/checkRecebido.png';
                        statusIcon.alt = 'Recebido';
                        statusText.textContent = 'Recebido';
                        statusText.classList.add('status--recebido');
                        break;
                    case 'andamento':
                        statusIcon.src = '../imagem/checkEmAndamento.png';
                        statusIcon.alt = 'Em andamento';
                        statusText.textContent = 'Em andamento';
                        statusText.classList.add('status--andamento');
                        break;
                    case 'resolvido':
                        statusIcon.src = '../imagem/checkResolvido.png';
                        statusIcon.alt = 'Resolvido';
                        statusText.textContent = 'Resolvido';
                        statusText.classList.add('status--resolvido');
                        break;
                }
            }
        }
    }

    getComplaintDetails(id) {
        return this.complaints.find(c => c.id === id);
    }

    showSuccessMessage(message, type = 'success') {
        // Remover mensagem anterior se existir
        const existingMessage = document.querySelector('.success-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.textContent = message;

        const bgColor = type === 'error' ? '#d32f2f' : '#179800';
        const icon = type === 'error' ? '❌' : '✅';

        successMsg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        `;

        successMsg.innerHTML = `${icon} ${message}`;

        document.body.appendChild(successMsg);

        setTimeout(() => {
            successMsg.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => successMsg.remove(), 300);
        }, 4000);
    }

    async submitStatusUpdate() {
        console.log('submitStatusUpdate chamado na classe');
        console.log('this.currentComplaintId:', this.currentComplaintId);

        if (!this.currentComplaintId) {
            console.error('Nenhuma reclamação selecionada para atualização');
            this.showSuccessMessage('Erro: Nenhuma reclamação selecionada', 'error');
            return;
        }

        const newStatusElement = document.getElementById('new-status');
        const notesElement = document.getElementById('status-notes');

        if (!newStatusElement) {
            console.error('Elemento new-status não encontrado');
            return;
        }

        if (!notesElement) {
            console.error('Elemento status-notes não encontrado');
            return;
        }

        const newStatus = newStatusElement.value;
        const notes = notesElement.value;

        console.log('Novo status:', newStatus);
        console.log('Observações:', notes);

        try {
            // Enviar dados para o PHP
            const formData = new FormData();
            formData.append('id', this.currentComplaintId);
            formData.append('status', newStatus);
            formData.append('observacoes_adm', notes);

            const response = await fetch('../php/atualizar_status.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.status === 'success') {
                this.showSuccessMessage(result.message);
                closeStatusModal();

                // Recarregar reclamações do servidor
                await this.loadComplaintsFromServer();

                const detailsModal = document.getElementById('details-modal');
                if (detailsModal && detailsModal.style.display === 'block') {
                    const complaint = this.getComplaintDetails(this.currentComplaintId);
                    showDetailsModal(complaint);
                }
            } else {
                this.showSuccessMessage(result.message, 'error');
            }
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            this.showSuccessMessage('Erro ao atualizar status', 'error');
        }
    }
}

let adminManager;
let currentComplaintId = null;

function viewDetails(id) {
    const complaint = adminManager.getComplaintDetails(id);
    if (complaint) {
        currentComplaintId = id;
        showDetailsModal(complaint);
    }
}

function showDetailsModal(complaint) {
    const modal = document.getElementById('details-modal');
    const modalBody = document.getElementById('modal-body');
    const modalTitle = document.getElementById('modal-title');

    modalTitle.textContent = `Reclamação #${complaint.id}`;

    modalBody.innerHTML = `
        <div class="details-grid">
          <div class="detail-item">
            <span class="detail-label">ID:</span>
            <span class="detail-value">#${complaint.id}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Status:</span>
            <span class="detail-value status--${complaint.status}">${complaint.status === 'recebido' ? 'Recebido' : complaint.status === 'andamento' ? 'Em andamento' : 'Resolvido'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Cliente:</span>
            <span class="detail-value">${complaint.usuario_nome || 'N/A'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Email:</span>
            <span class="detail-value">${complaint.usuario_email || 'N/A'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Tipo:</span>
            <span class="detail-value">${complaint.tipo}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Endereço:</span>
            <span class="detail-value">${complaint.endereco}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Número:</span>
            <span class="detail-value">${complaint.numero}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Complemento:</span>
            <span class="detail-value">${complaint.complemento || 'Não informado'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Data:</span>
            <span class="detail-value">${complaint.data_ocorrencia ? new Date(complaint.data_ocorrencia).toLocaleDateString('pt-BR') : complaint.data}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Hora:</span>
            <span class="detail-value">${complaint.hora_ocorrencia || ''}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Data de Criação:</span>
            <span class="detail-value">${complaint.data_criacao ? new Date(complaint.data_criacao).toLocaleDateString('pt-BR') : 'N/A'}</span>
          </div>
          <div class="detail-item detail-item--full">
            <span class="detail-label">Descrição:</span>
            <span class="detail-value">${complaint.descricao}</span>
          </div>
          ${complaint.observacoes_adm ? `
          <div class="detail-item detail-item--full">
            <span class="detail-label">Observações do Administrador:</span>
            <span class="detail-value">${complaint.observacoes_adm}</span>
          </div>
          ` : ''}
          ${complaint.lastUpdate ? `
          <div class="detail-item detail-item--full">
            <span class="detail-label">Última atualização:</span>
            <span class="detail-value">${complaint.lastUpdate}</span>
          </div>
          ` : ''}
        </div>
        <div class="modal__actions">
          <button class="btn btn--secondary" onclick="updateStatus(${complaint.id})">Atualizar Status</button>
          <button class="btn btn--ghost" onclick="closeModal()">Fechar</button>
        </div>
      `;

    modal.style.display = 'block';
}

function updateStatus(id) {
    console.log('updateStatus chamado com ID:', id);
    currentComplaintId = id;
    adminManager.currentComplaintId = id;

    const complaint = adminManager.getComplaintDetails(id);
    console.log('Reclamação encontrada:', complaint);

    if (complaint) {
        const statusSelect = document.getElementById('new-status');
        if (statusSelect) {
            statusSelect.value = complaint.status;
            console.log('Status atual definido como:', complaint.status);
        } else {
            console.error('Elemento new-status não encontrado');
        }

        const statusModal = document.getElementById('status-modal');
        const detailsModal = document.getElementById('details-modal');

        if (statusModal && detailsModal) {
            statusModal.style.display = 'block';
            detailsModal.style.display = 'none';
            console.log('Modal de status aberto');
        } else {
            console.error('Modais não encontrados');
        }
    } else {
        console.error('Reclamação não encontrada para ID:', id);
    }
}

function closeModal() {
    const detailsModal = document.getElementById('details-modal');
    if (detailsModal) {
        detailsModal.style.display = 'none';
        console.log('Modal de detalhes fechado');
    }
}

function closeStatusModal() {
    const statusModal = document.getElementById('status-modal');
    const form = document.getElementById('status-form');

    if (statusModal) {
        statusModal.style.display = 'none';
        console.log('Modal de status fechado');
    }

    if (form) {
        form.reset();
        console.log('Formulário resetado');
    }
}

function submitStatusUpdate() {
    console.log('submitStatusUpdate chamado');
    console.log('currentComplaintId:', currentComplaintId);
    console.log('adminManager.currentComplaintId:', adminManager.currentComplaintId);

    adminManager.submitStatusUpdate();
}

function showSuccessMessage(message, type = 'success') {
    // Remover mensagem anterior se existir
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    successMsg.textContent = message;

    const bgColor = type === 'error' ? '#d32f2f' : '#179800';
    const icon = type === 'error' ? '❌' : '✅';

    successMsg.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      `;

    successMsg.innerHTML = `${icon} ${message}`;

    document.body.appendChild(successMsg);

    setTimeout(() => {
        successMsg.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => successMsg.remove(), 300);
    }, 4000);
}

window.onclick = function (event) {
    const detailsModal = document.getElementById('details-modal');
    const statusModal = document.getElementById('status-modal');

    if (event.target === detailsModal) {
        closeModal();
    }
    if (event.target === statusModal) {
        closeStatusModal();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado, inicializando sistema...');

    const requiredElements = [
        'details-modal',
        'status-modal',
        'status-form',
        'new-status',
        'status-notes'
    ];

    const missingElements = requiredElements.filter(id => !document.getElementById(id));

    if (missingElements.length > 0) {
        console.error('Elementos faltando:', missingElements);
        alert('Erro: Alguns elementos necessários não foram encontrados. Verifique o console para mais detalhes.');
        return;
    }

    console.log('Todos os elementos necessários encontrados');

    try {
        adminManager = new AdminComplaintManager();
        console.log('Sistema inicializado com sucesso');
    } catch (error) {
        console.error('Erro ao inicializar sistema:', error);
        alert('Erro ao inicializar o sistema. Verifique o console para mais detalhes.');
    }
});

const style = document.createElement('style');
style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
document.head.appendChild(style);