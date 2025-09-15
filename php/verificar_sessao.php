<?php
// Iniciar sessão
session_start();

// Definir header para JSON
header('Content-Type: application/json');

// Verificar se usuário está logado
if (!isset($_SESSION['usuario_id'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Usuário não está logado',
        'redirect' => '../pages/loginpage.html'
    ]);
    exit();
}

// Retornar dados do usuário
echo json_encode([
    'status' => 'success',
    'usuario' => [
        'id' => $_SESSION['usuario_id'],
        'nome' => $_SESSION['usuario_nome'],
        'email' => $_SESSION['usuario_email'],
        'funcao' => $_SESSION['usuario_funcao']
    ]
]);
?>
