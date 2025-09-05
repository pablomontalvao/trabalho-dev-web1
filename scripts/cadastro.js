document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('cadastroForm');

    form.addEventListener('submit', (event) => {
        event.preventDefault();


        const funcaoSelecionada = document.querySelector('input[name="funcaoPessoa"]:checked');

        if (!funcaoSelecionada) {
            alert('Por favor, selecione uma função (Administrador ou Cliente).');
            return;
        }


        const valorFuncao = funcaoSelecionada.value;

        if (valorFuncao === 'cliente') {
            window.location.href = 'areaCliente.html';
        } else if (valorFuncao === 'adm') {
            window.location.href = 'areaAdm.html';
        }
    });

});