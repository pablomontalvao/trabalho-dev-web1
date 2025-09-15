document.addEventListener('DOMContentLoaded', () => {

    const form = document.querySelector('form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Obter dados do formulário
        const nome = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        const telefone = document.getElementById('tel').value;
        const funcaoSelecionada = document.querySelector('input[name="funcaoPessoa"]:checked');

        // Validar campos obrigatórios
        if (!nome || !email || !senha || !telefone) {
            showMessage('Todos os campos são obrigatórios!', 'error');
            return;
        }

        if (!funcaoSelecionada) {
            showMessage('Por favor, selecione uma função (Administrador ou Cliente).', 'error');
            return;
        }

        // Validar senha (mínimo 6 caracteres)
        if (senha.length < 6) {
            showMessage('A senha deve ter pelo menos 6 caracteres!', 'error');
            return;
        }
        
        // Converter valor da função
        const valorFuncao = funcaoSelecionada.value === 'opcao1' ? 'adm' : 'cliente';

        // Preparar dados para envio
        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('email', email);
        formData.append('senha', senha);
        formData.append('telefone', telefone);
        formData.append('funcao', valorFuncao);

        try {
            // Enviar dados para o PHP
            const response = await fetch('../php/cadastro.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.status === 'success') {
                showMessage(result.message + ' Faça login para continuar.', 'success');
                
                // Redirecionar para login após sucesso
                setTimeout(() => {
                    window.location.href = 'loginpage.html';
                }, 2000);
            } else {
                showMessage(result.message, 'error');
            }
        } catch (error) {
            console.error('Erro:', error);
            showMessage('Erro ao processar cadastro. Tente novamente.', 'error');
        }
    });

    // Função para mostrar mensagens
    function showMessage(message, type) {
        // Remover mensagem anterior se existir
        const existingMessage = document.querySelector('.alert-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = 'alert-message';
        messageDiv.textContent = message;
        
        const bgColor = type === 'error' ? '#dc3545' : '#28a745';
        const icon = type === 'error' ? '❌' : '✅';
        
        messageDiv.style.cssText = `
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
        
        messageDiv.innerHTML = `${icon} ${message}`;
        document.body.appendChild(messageDiv);

        // Remover mensagem após 5 segundos
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => messageDiv.remove(), 300);
        }, 5000);
    }

    // Adicionar estilos CSS
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
});