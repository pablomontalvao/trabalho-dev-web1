document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-perfil');
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const telefoneInput = document.getElementById('telefone');
    const mensagemDiv = document.getElementById('mensagem');

    fetch('../php/verificar_sessao.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                
                nomeInput.value = data.usuario.nome;
                emailInput.value = data.usuario.email;
                
                telefoneInput.placeholder = '(12) 34567-8910';

            } else {
                //se o usuario nao estiver logado, redireciona para a página de login
                alert(data.message);
                window.location.href = data.redirect;
            }
        })
        .catch(error => {
            console.error('Erro ao verificar sessão:', error);
            mensagemDiv.innerHTML = `<div class="alert alert-danger">Ocorreu um erro ao carregar seus dados.</div>`;
        });

    form.addEventListener('submit', (event) => {
        event.preventDefault(); 

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
            let alertClass = data.status === 'success' ? 'alert-success' : 'alert-danger';
            mensagemDiv.innerHTML = `<div class="alert ${alertClass}">${data.message}</div>`;

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