<?php
// Definir header para JSON
header('Content-Type: application/json');

// Incluir conexão com banco
require_once 'conexao.php';

// Verificar se é método POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'status' => 'error',
        'message' => 'Método não permitido'
    ]);
    exit();
}

// Receber dados do POST
$nome = $_POST['nome'] ?? '';
$email = $_POST['email'] ?? '';
$senha = $_POST['senha'] ?? '';
$telefone = $_POST['telefone'] ?? '';
$funcao = $_POST['funcao'] ?? '';

// Validar campos obrigatórios
if (empty($nome) || empty($email) || empty($senha) || empty($telefone) || empty($funcao)) {
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

try {
    // Verificar se email já existe
    $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    
    if ($stmt->rowCount() > 0) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Email já cadastrado'
        ]);
        exit();
    }
    
    // Gerar hash da senha
    $senhaHash = password_hash($senha, PASSWORD_DEFAULT);
    
    // Inserir novo usuário
    $stmt = $pdo->prepare("INSERT INTO usuarios (nome, email, senha, telefone, funcao) VALUES (?, ?, ?, ?, ?)");
    $resultado = $stmt->execute([$nome, $email, $senhaHash, $telefone, $funcao]);
    
    if ($resultado) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Cadastro realizado com sucesso!'
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Erro ao realizar cadastro'
        ]);
    }
    
} catch(PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Erro no banco de dados: ' . $e->getMessage()
    ]);
}
?>
