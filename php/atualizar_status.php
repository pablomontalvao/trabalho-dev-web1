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

if ($_SESSION['usuario_funcao'] !== 'adm') {
    echo json_encode([
        'status' => 'error',
        'message' => 'Acesso negado. Apenas administradores podem atualizar status.'
    ]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'status' => 'error',
        'message' => 'Método não permitido'
    ]);
    exit();
}

require_once 'conexao.php';

$reclamacao_id = $_POST['id'] ?? '';
$novo_status = $_POST['status'] ?? '';
$observacoes_adm = $_POST['observacoes_adm'] ?? '';

if (empty($reclamacao_id) || empty($novo_status)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'ID da reclamação e status são obrigatórios'
    ]);
    exit();
}

$status_validos = ['pendente', 'andamento', 'resolvido'];
if (!in_array($novo_status, $status_validos)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Status inválido. Use: pendente, andamento ou resolvido'
    ]);
    exit();
}

try {
    $stmt = $pdo->prepare("SELECT id FROM reclamacoes WHERE id = ?");
    $stmt->execute([$reclamacao_id]);
    
    if ($stmt->rowCount() === 0) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Reclamação não encontrada'
        ]);
        exit();
    }
    
    $stmt = $pdo->prepare("
        UPDATE reclamacoes 
        SET status = ?, observacoes_adm = ? 
        WHERE id = ?
    ");
    
    $resultado = $stmt->execute([$novo_status, $observacoes_adm, $reclamacao_id]);
    
    if ($resultado) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Status atualizado com sucesso!'
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Erro ao atualizar status'
        ]);
    }
    
} catch(PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Erro no banco de dados: ' . $e->getMessage()
    ]);
}
?>
