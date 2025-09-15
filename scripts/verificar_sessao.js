// Verificar se usuário está logado
async function verificarSessao() {
    try {
        const response = await fetch('../php/verificar_sessao.php');
        const result = await response.json();

        if (result.status === 'error') {
            // Usuário não está logado, redirecionar para login
            window.location.href = result.redirect;
            return false;
        }

        // Usuário está logado, mostrar informações se necessário
        console.log('Usuário logado:', result.usuario);
        return result.usuario;
    } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        window.location.href = '../pages/loginpage.html';
        return false;
    }
}

// Função para fazer logout
async function fazerLogout() {
    try {
        const response = await fetch('../php/logout.php');
        const result = await response.json();

        if (result.status === 'success') {
            window.location.href = result.redirect;
        }
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        window.location.href = '../pages/loginpage.html';
    }
}

// Verificar sessão quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    verificarSessao();
});
