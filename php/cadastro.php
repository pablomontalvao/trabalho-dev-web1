<?php
header('Content-Type: application/json');

require_once 'conexao.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'status' => 'error',
        'message' => 'Método não permitido'
    ]);
    exit();
}

$nome = $_POST['nome'] ?? '';
$email = $_POST['email'] ?? '';
$senha = $_POST['senha'] ?? '';
$telefone = $_POST['telefone'] ?? '';
$funcao = $_POST['funcao'] ?? 'cliente';

session_start();
if ($funcao === 'adm') {
    if (!isset($_SESSION['usuario_id']) || ($_SESSION['usuario_funcao'] ?? '') !== 'adm') {
        echo json_encode([
            'status' => 'error',
            'message' => 'Apenas administradores podem criar usuários com função de administrador.'
        ]);
        exit();
    }
}

if (empty($nome) || empty($email) || empty($senha) || empty($telefone)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Todos os campos são obrigatórios'
    ]);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Email inválido'
    ]);
    exit();
}

if (strlen($senha) < 6) {
    echo json_encode([
        'status' => 'error',
        'message' => 'A senha deve ter pelo menos 6 caracteres'
    ]);
    exit();
}

try {
    $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    
    if ($stmt->rowCount() > 0) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Email já cadastrado'
        ]);
        exit();
    }
    
    $senhaHash = password_hash($senha, PASSWORD_DEFAULT);
    
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
