<?php
// Iniciar sessão
session_start();

// Definir header para JSON
header('Content-Type: application/json');

// Destruir sessão
session_destroy();

// Retornar sucesso
echo json_encode([
    'status' => 'success',
    'message' => 'Logout realizado com sucesso',
    'redirect' => '../pages/loginpage.html'
]);
?>
