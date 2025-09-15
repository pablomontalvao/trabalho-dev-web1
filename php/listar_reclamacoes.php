<?php
// Iniciar sessão
session_start();

// Definir header para JSON
header('Content-Type: application/json');

// Verificar se usuário está logado
if (!isset($_SESSION['usuario_id'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Usuário não está logado'
    ]);
    exit();
}

// Incluir conexão com banco
require_once 'conexao.php';

try {
    $usuario_id = $_SESSION['usuario_id'];
    $funcao = $_SESSION['usuario_funcao'];
    
    // Preparar query baseada na função do usuário
    if ($funcao === 'adm') {
        // Admin vê todas as reclamações
        $stmt = $pdo->prepare("
            SELECT r.*, u.nome as usuario_nome, u.email as usuario_email 
            FROM reclamacoes r 
            INNER JOIN usuarios u ON r.usuario_id = u.id 
            ORDER BY r.data_criacao DESC
        ");
        $stmt->execute();
    } else {
        // Cliente vê apenas suas reclamações
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
