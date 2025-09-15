
class ComplaintManager {
    constructor() {
        this.complaints = [];
        this.nextId = 4;
        this.init();
    }

    init() {
        this.setupForm();
        this.setupFilters();
        this.loadComplaintsFromServer();
        this.setMaxDate();
    }

    setMaxDate() {
        // Definir data máxima como hoje
        const dataInput = document.getElementById('data');
        if (dataInput) {
            const hoje = new Date().toISOString().split('T')[0];
            dataInput.max = hoje;
        }
    }

    setupForm() {
        const form = document.getElementById('complaint-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitComplaint();
        });
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
        console.log('Mostrando todos os cards...');
        const cards = document.querySelectorAll('.card');
        console.log('Total de cards encontrados:', cards.length);

        cards.forEach((card, index) => {
            card.style.display = 'grid';
            console.log(`Card ${index + 1} configurado como visível`);
        });
    }

    async loadComplaintsFromServer() {
        try {
            const response = await fetch('../php/listar_reclamacoes.php');
            const result = await response.json();

            if (result.status === 'success') {
                // Limpar lista atual
                const cardsList = document.getElementById('claims-list');
                cardsList.innerHTML = '';
                this.complaints = [];

                // Adicionar reclamações do servidor
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

    async submitComplaint() {
        const formData = new FormData(document.getElementById('complaint-form'));

        // Validar data (não pode ser futura)
        const dataOcorrencia = formData.get('data');
        const hoje = new Date().toISOString().split('T')[0];

        if (dataOcorrencia > hoje) {
            this.showSuccessMessage('A data da ocorrência não pode ser futura!', 'error');
            return;
        }

        try {
            // Enviar dados para o PHP
            const response = await fetch('../php/criar_reclamacao.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.status === 'success') {
                this.showSuccessMessage(result.message);
                this.resetForm();

                // Recarregar reclamações do servidor
                await this.loadComplaintsFromServer();

                // Rola para a seção de reclamações
                document.querySelector('.claims').scrollIntoView({ behavior: 'smooth' });
            } else {
                this.showSuccessMessage(result.message, 'error');
            }
        } catch (error) {
            console.error('Erro:', error);
            this.showSuccessMessage('Erro ao enviar reclamação. Tente novamente.', 'error');
        }
    }

    addComplaintCard(complaint) {
        const cardsList = document.getElementById('claims-list');
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
          </div>
        `;

        cardsList.insertBefore(card, cardsList.firstChild);
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

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }

    resetForm() {
        document.getElementById('complaint-form').reset();
    }

    showSuccessMessage(messageText = 'Reclamação enviada com sucesso!', type = 'success') {
        const message = document.createElement('div');
        message.className = 'success-message';
        message.textContent = messageText;

        const bgColor = type === 'error' ? '#dc3545' : '#28a745';
        const icon = type === 'error' ? '❌' : '✅';

        message.style.cssText = `
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

        message.innerHTML = `${icon} ${messageText}`;
        document.body.appendChild(message);

        setTimeout(() => {
            message.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => message.remove(), 300);
        }, 4000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ComplaintManager();
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