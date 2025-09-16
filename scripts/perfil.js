document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('form-perfil');
    var nomeInput = document.getElementById('nome');
    var emailInput = document.getElementById('email');
    var telefoneInput = document.getElementById('telefone');
    var mensagemDiv = document.getElementById('mensagem');

    (async function loadProfile() {
        try {
            var response = await fetch('../php/verificar_sessao.php', { credentials: 'include' });
            var data = await response.json();
            if (data && data.status === 'success') {
                nomeInput.value = data.usuario.nome;
                emailInput.value = data.usuario.email;
                telefoneInput.placeholder = '(12) 34567-8910';
            } else {
                alert(data.message);
                window.location.href = data.redirect;
            }
        } catch (e) {
            mensagemDiv.innerHTML = '<div class="alert alert-danger">Ocorreu um erro ao carregar seus dados.</div>';
        }
    })();

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        var formData = new FormData();
        formData.append('nome', nomeInput.value);
        formData.append('email', emailInput.value);
        formData.append('telefone', telefoneInput.value);

        try {
            var response = await fetch('../php/atualizar_perfil.php', { method: 'POST', body: formData });
            var data = await response.json();
            var alertClass = 'alert-danger';
            if (data && data.status === 'success') {
                alertClass = 'alert-success';
            }
            mensagemDiv.innerHTML = '<div class="alert ' + alertClass + '">' + data.message + '</div>';
            setTimeout(function () { mensagemDiv.innerHTML = ''; }, 5000);
        } catch (error) {
            mensagemDiv.innerHTML = '<div class="alert alert-danger">Ocorreu um erro na comunicação com o servidor.</div>';
        }
    });
});