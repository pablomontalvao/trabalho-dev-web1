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

// Verificar se é método POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'status' => 'error',
        'message' => 'Método não permitido'
    ]);
    exit();
}

// Incluir conexão com banco
require_once 'conexao.php';

// Receber dados do POST
$tipo = $_POST['tipo'] ?? '';
$endereco = $_POST['endereco'] ?? '';
$numero = $_POST['numero'] ?? '';
$complemento = $_POST['complemento'] ?? '';
$data = $_POST['data'] ?? '';
$hora = $_POST['hora'] ?? '';
$descricao = $_POST['descricao'] ?? '';

// Validar campos obrigatórios
if (empty($tipo) || empty($endereco) || empty($numero) || empty($data) || empty($descricao)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Campos obrigatórios: tipo, endereço, número, data e descrição'
    ]);
    exit();
}

try {
    // Inserir nova reclamação
    $stmt = $pdo->prepare("
        INSERT INTO reclamacoes (usuario_id, tipo, endereco, numero, complemento, data_ocorrencia, hora_ocorrencia, descricao, status, data_criacao) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'recebido', NOW())
    ");

    $resultado = $stmt->execute([
        $_SESSION['usuario_id'],
        $tipo,
        $endereco,
        $numero,
        $complemento,
        $data,
        $hora,
        $descricao
    ]);

    if ($resultado) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Reclamação criada com sucesso!'
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Erro ao criar reclamação'
        ]);
    }

} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Erro no banco de dados: ' . $e->getMessage()
    ]);
}
?>