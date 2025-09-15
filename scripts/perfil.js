document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-perfil');
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const telefoneInput = document.getElementById('telefone');
    const mensagemDiv = document.getElementById('mensagem');

    // 1. Verificar a sessão e carregar os dados do usuário
    fetch('../php/verificar_sessao.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Preenche o formulário com os dados do usuário
                nomeInput.value = data.usuario.nome;
                emailInput.value = data.usuario.email;
                // O telefone não está na sessão, então idealmente buscaríamos ele do banco.
                // Por enquanto, deixaremos como está, mas o ideal seria adicionar o telefone
                // à resposta de `verificar_sessao.php`.
                // Assumindo que o telefone não está na sessão:
                telefoneInput.placeholder = '(12) 34567-8910'; // Exemplo
                // Se você adicionar o telefone à sessão, descomente a linha abaixo:
                // telefoneInput.value = data.usuario.telefone;

            } else {
                // Se o usuário não estiver logado, redireciona para a página de login
                alert(data.message);
                window.location.href = data.redirect;
            }
        })
        .catch(error => {
            console.error('Erro ao verificar sessão:', error);
            mensagemDiv.innerHTML = `<div class="alert alert-danger">Ocorreu um erro ao carregar seus dados.</div>`;
        });


    // 2. Adicionar listener para o envio do formulário
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Impede o recarregamento da página

        // Criar um objeto FormData para enviar os dados do formulário
        const formData = new FormData();
        formData.append('nome', nomeInput.value);
        formData.append('email', emailInput.value);
        formData.append('telefone', telefoneInput.value);

        fetch('../php/atualizar_perfil.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Exibe a mensagem de resposta do backend
            let alertClass = data.status === 'success' ? 'alert-success' : 'alert-danger';
            mensagemDiv.innerHTML = `<div class="alert ${alertClass}">${data.message}</div>`;

            // Limpa a mensagem após 5 segundos
            setTimeout(() => {
                mensagemDiv.innerHTML = '';
            }, 5000);
        })
        .catch(error => {
            console.error('Erro ao atualizar perfil:', error);
            mensagemDiv.innerHTML = `<div class="alert alert-danger">Ocorreu um erro na comunicação com o servidor.</div>`;
        });
    });
});