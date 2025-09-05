
class ComplaintManager {
    constructor() {
        this.complaints = [];
        this.nextId = 4;
        this.init();
    }

    init() {
        this.setupForm();
        this.setupFilters();
        this.loadExistingComplaints();
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

    loadExistingComplaints() {
        console.log('Carregando reclamações existentes...');
        const existingCards = document.querySelectorAll('.card');
        console.log('Cards encontrados:', existingCards.length);

        existingCards.forEach((card, index) => {
            const id = parseInt(card.dataset.id);
            const status = card.dataset.status;
            const tipo = card.querySelector('.card__col:first-child .value').textContent;
            const endereco = card.querySelector('.card__col:nth-child(2) .value').textContent;
            const data = card.querySelector('.card__col:nth-child(3) .value').textContent;
            const hora = (card.querySelector('.card__col:nth-child(4) .value') || { textContent: '' }).textContent;
            const descricao = card.querySelector('.card__col--full .value').textContent;

            this.complaints.push({
                id,
                status,
                tipo,
                endereco,
                data,
                hora,
                descricao,
                numero: '',
                complemento: '',
            });

            console.log(`Card ${index + 1} carregado: ID ${id}, Status: ${status}, Tipo: ${tipo}`);
        });
    }

    submitComplaint() {
        const formData = new FormData(document.getElementById('complaint-form'));

        const complaint = {
            id: this.nextId++,
            status: 'recebido',
            endereco: formData.get('endereco'),
            numero: formData.get('numero'),
            complemento: formData.get('complemento'),
            data: this.formatDate(formData.get('data')),
            hora: formData.get('hora'),
            tipo: formData.get('tipo'),
            descricao: formData.get('descricao')
        };

        this.complaints.push(complaint);
        this.addComplaintCard(complaint);
        this.resetForm();
        this.showSuccessMessage();

        // Rola para a seção de reclamações
        document.querySelector('.claims').scrollIntoView({ behavior: 'smooth' });
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

        card.innerHTML = `
          <div class="card__status">
            <span class="status__label">Status</span>
            <img class="status__icon" src="../imagem/checkRecebido.png" alt="Ícone status recebido" />
            <span class="status__text status--recebido">Recebido</span>
          </div>
          <div class="card__body">
            <div class="card__grid">
              <div class="card__col"><span class="label">Tipo:</span><span class="value">${complaint.tipo}</span></div>
              <div class="card__col"><span class="label">Endereço:</span><span class="value">${enderecoCompleto}</span></div>
              <div class="card__col"><span class="label">Data:</span><span class="value">${complaint.data}</span></div>
              <div class="card__col"><span class="label">Hora:</span><span class="value">${complaint.hora || ''}</span></div>
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

    showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'success-message';
        message.textContent = 'Reclamação enviada com sucesso!';
        message.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #179800;
          color: white;
          padding: 16px 24px;
          border-radius: 8px;
          font-weight: 600;
          z-index: 1000;
          animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(message);

        setTimeout(() => {
            message.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => message.remove(), 300);
        }, 3000);
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