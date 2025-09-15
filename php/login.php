<?php
// Iniciar sessão
session_start();

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
$email = $_POST['email'] ?? '';
$senha = $_POST['senha'] ?? '';

// Validar campos obrigatórios
if (empty($email) || empty($senha)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Email e senha são obrigatórios'
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
    // Buscar usuário no banco
    $stmt = $pdo->prepare("SELECT id, nome, email, senha, funcao FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    
    if ($stmt->rowCount() === 0) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Email ou senha incorretos'
        ]);
        exit();
    }
    
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Verificar senha
    if (password_verify($senha, $usuario['senha'])) {
        // Senha correta - armazenar dados na sessão
        $_SESSION['usuario_id'] = $usuario['id'];
        $_SESSION['usuario_nome'] = $usuario['nome'];
        $_SESSION['usuario_funcao'] = $usuario['funcao'];
        $_SESSION['usuario_email'] = $usuario['email'];
        
        // Determinar página de redirecionamento baseada na função
        $pagina = ($usuario['funcao'] === 'adm') ? 'areaAdm.html' : 'areaCliente.html';
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Login realizado com sucesso!',
            'redirect' => $pagina
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Email ou senha incorretos'
        ]);
    }
    
} catch(PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Erro no banco de dados: ' . $e->getMessage()
    ]);
}
?>
