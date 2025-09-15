<?php
// Configurações do banco de dados
$host = 'localhost';
$dbname = 'tbweb_db';
$username = 'root';
$password = '';

try {
    // Conexão com o banco de dados
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    
    // Configurar PDO para lançar exceções em caso de erro
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Configurar charset
    $pdo->exec("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");
    
} catch(PDOException $e) {
    // Em caso de erro, retornar erro em JSON
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'error',
        'message' => 'Erro na conexão com o banco de dados: ' . $e->getMessage()
    ]);
    exit();
}
?>
