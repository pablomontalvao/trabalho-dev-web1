<?php
// Iniciar sessão
session_start();

// Definir header para JSON
header('Content-Type: application/json');

// Incluir conexão com o banco
require_once 'conexao.php';

// Verificar se o método é POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'status' => 'error',
        'message' => 'Método não permitido'
    ]);
    exit();
}

// Verificar se o usuário está logado
if (!isset($_SESSION['usuario_id'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Usuário não autenticado. Faça login novamente.'
    ]);
    exit();
}

// Receber dados do POST
$nome = $_POST['nome'] ?? '';
$email = $_POST['email'] ?? '';
$telefone = $_POST['telefone'] ?? '';
$id_usuario = $_SESSION['usuario_id']; // Pega o ID da sessão para segurança

// Validar campos obrigatórios
if (empty($nome) || empty($email) || empty($telefone)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Todos os campos são obrigatórios'
    ]);
    exit();
}

// Validar email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Email inválido'
    ]);
    exit();
}

// Validar telefone
if (!preg_match('/^\(\d{2}\)\s\d{4,5}-\d{4}$/', $telefone) && !preg_match('/^\d{2}\s\d{4,5}-\d{4}$/', $telefone)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Telefone inválido. Use o formato: (34) 99999-9999'
    ]);
    exit();
}

try {
    // Verificar se o novo email já está em uso por OUTRO usuário
    $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = ? AND id != ?");
    $stmt->execute([$email, $id_usuario]);
    
    if ($stmt->rowCount() > 0) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Este email já está sendo utilizado por outra conta.'
        ]);
        exit();
    }
    
    // Atualizar os dados do usuário no banco
    $stmt = $pdo->prepare("UPDATE usuarios SET nome = ?, email = ?, telefone = ? WHERE id = ?");
    $resultado = $stmt->execute([$nome, $email, $telefone, $id_usuario]);
    
    if ($resultado) {
        // Atualizar os dados da sessão com as novas informações
        $_SESSION['usuario_nome'] = $nome;
        $_SESSION['usuario_email'] = $email;
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Perfil atualizado com sucesso!'
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Erro ao atualizar o perfil. Tente novamente.'
        ]);
    }
    
} catch(PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Erro no banco de dados: ' . $e->getMessage()
    ]);
}
?>