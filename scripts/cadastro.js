document.addEventListener('DOMContentLoaded', function () {
    (async function checkAdminMode() {
        try {
            var params = new URLSearchParams(window.location.search);
            if (params.get('admin') === '1') {
                var resp = await fetch('../php/verificar_sessao.php', { credentials: 'include' });
                var data = await resp.json();
                if (data && data.status === 'success' && data.usuario && data.usuario.funcao === 'adm') {
                    var container = document.getElementById('funcao-admin-container');
                    if (container) container.style.display = 'block';
                } else {
                    history.replaceState(null, '', window.location.pathname);
                }
            }
        } catch (e) {
        }
    })();

    var form = document.querySelector('form');
    if (!form) return;

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        var nome = document.getElementById('name').value;
        var email = document.getElementById('email').value;
        var senha = document.getElementById('senha').value;
        var telefone = document.getElementById('tel').value;
        var funcaoSelecionada = document.querySelector('input[name="funcaoPessoa"]:checked');

        if (!nome || !email || !senha || !telefone) {
            showMessage('Todos os campos são obrigatórios!', 'error');
            return;
        }

        if (senha.length < 6) {
            showMessage('A senha deve ter pelo menos 6 caracteres!', 'error');
            return;
        }

        var valorFuncao = 'cliente';
        if (funcaoSelecionada) {
            if (funcaoSelecionada.value === 'adm') {
                valorFuncao = 'adm';
            } else {
                valorFuncao = 'cliente';
            }
        }

        var formData = new FormData();
        formData.append('nome', nome);
        formData.append('email', email);
        formData.append('senha', senha);
        formData.append('telefone', telefone);
        formData.append('funcao', valorFuncao);

        try {
            var response = await fetch('../php/cadastro.php', { method: 'POST', body: formData });
            var result = await response.json();
            if (result && result.status === 'success') {
                showMessage(result.message + ' Faça login para continuar.', 'success');
                setTimeout(function () { window.location.href = 'loginpage.html'; }, 2000);
            } else {
                showMessage(result.message || 'Erro no cadastro', 'error');
            }
        } catch (error) {
            showMessage('Erro ao processar cadastro. Tente novamente.', 'error');
        }
    });

    function showMessage(message, type) {
        var existing = document.querySelector('.alert-message');
        if (existing) existing.remove();
        var div = document.createElement('div');
        div.className = 'alert-message';
        var bgColor = '#28a745';
        var icon = '✅';
        if (type === 'error') {
            bgColor = '#dc3545';
            icon = '❌';
        }
        div.style.cssText = 'position: fixed; top: 20px; right: 20px; background: ' + bgColor + '; color: white; padding: 16px 24px; border-radius: 8px; font-weight: 600; z-index: 1000; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);';
        div.innerHTML = icon + ' ' + message;
        document.body.appendChild(div);
        setTimeout(function () { div.remove(); }, 5000);
    }
});
