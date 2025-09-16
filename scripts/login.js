document.addEventListener('DOMContentLoaded', function () {
    var form = document.querySelector('form');
    if (!form) return;

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        var email = document.getElementById('email').value;
        var senha = document.getElementById('senha').value;
        if (!email || !senha) {
            showMessage('Email e senha são obrigatórios!', 'error');
            return;
        }

        var formData = new FormData();
        formData.append('email', email);
        formData.append('senha', senha);

        try {
            var response = await fetch('../php/login.php', { method: 'POST', body: formData });
            var result = await response.json();
            if (result && result.status === 'success') {
                showMessage(result.message, 'success');
                setTimeout(function () { window.location.href = result.redirect; }, 1500);
            } else {
                showMessage(result.message || 'Erro no login', 'error');
            }
        } catch (error) {
            showMessage('Erro ao processar login. Tente novamente.', 'error');
        }
    });

    function showMessage(message, type) {
        var existing = document.querySelector('.alert-message');
        if (existing) existing.remove();
        var div = document.createElement('div');
        div.className = 'alert-message';
        var bgColor = '#28a745';
        var icon = '✅';
        if (type === 'error') { bgColor = '#dc3545'; icon = '❌'; }
        div.style.cssText = 'position: fixed; top: 20px; right: 20px; background: ' + bgColor + '; color: white; padding: 16px 24px; border-radius: 8px; font-weight: 600; z-index: 1000; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);';
        div.innerHTML = icon + ' ' + message;
        document.body.appendChild(div);
        setTimeout(function () { div.remove(); }, 5000);
    }

    var style = document.createElement('style');
    style.textContent = '@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } } @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }';
    document.head.appendChild(style);
});
