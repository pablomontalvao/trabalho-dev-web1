async function verificarSessao() {
    try {
        var response = await fetch('../php/verificar_sessao.php', { credentials: 'include' });
        var result = await response.json();
        if (result && result.status === 'error') {
            window.location.href = result.redirect;
            return false;
        }
        return result.usuario;
    } catch (error) {
        window.location.href = '../pages/loginpage.html';
        return false;
    }
}

async function fazerLogout() {
    try {
        var response = await fetch('../php/logout.php', { credentials: 'include' });
        var result = await response.json();
        if (result && result.status === 'success') {
            window.location.href = result.redirect;
        }
    } catch (error) {
        window.location.href = '../pages/loginpage.html';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    verificarSessao();
});
