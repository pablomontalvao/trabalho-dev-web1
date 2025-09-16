<?php
session_start();

header('Content-Type: application/json');

session_destroy();

echo json_encode([
    'status' => 'success',
    'message' => 'Logout realizado com sucesso',
    'redirect' => '../pages/loginpage.html'
]);
?>
