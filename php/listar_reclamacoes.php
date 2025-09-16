<?php
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Usuário não está logado'
    ]);
    exit();
}

require_once 'conexao.php';

try {
    $usuario_id = $_SESSION['usuario_id'];
    $funcao = $_SESSION['usuario_funcao'];
    
    if ($funcao === 'adm') {
        $stmt = $pdo->prepare("
            SELECT r.*, u.nome as usuario_nome, u.email as usuario_email 
            FROM reclamacoes r 
            INNER JOIN usuarios u ON r.usuario_id = u.id 
            ORDER BY r.data_criacao DESC
        ");
        $stmt->execute();
    } else {
        $stmt = $pdo->prepare("
            SELECT r.*, u.nome as usuario_nome, u.email as usuario_email 
            FROM reclamacoes r 
            INNER JOIN usuarios u ON r.usuario_id = u.id 
            WHERE r.usuario_id = ? 
            ORDER BY r.data_criacao DESC
        ");
        $stmt->execute([$usuario_id]);
    }
    
    $reclamacoes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'status' => 'success',
        'data' => $reclamacoes,
        'total' => count($reclamacoes)
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Erro no banco de dados: ' . $e->getMessage()
    ]);
}
?>
