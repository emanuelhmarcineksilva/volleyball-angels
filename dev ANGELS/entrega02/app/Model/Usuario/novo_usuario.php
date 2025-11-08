<?php
error_reporting(0);
ini_set('display_errors', 0);
header("Content-Type: application/json; charset=utf-8");

include_once(__DIR__ . '/../../core/conexao.php');

$retorno = [
    'status' => '',
    'mensagem' => ''
];

if (
    isset($_POST['nome']) &&
    isset($_POST['email']) &&
    isset($_POST['senha']) &&
    isset($_POST['telefone']) &&
    isset($_POST['sexo']) &&
    isset($_POST['seletor-cargo'])
) {
    $nome = $_POST['nome'];
    $email = $_POST['email'];
    $senha = $_POST['senha'];
    $telefone = $_POST['telefone'];
    $sexo = $_POST['sexo'];
    $cargo = $_POST['seletor-cargo'];

    $stmt = $conexao->prepare("INSERT INTO usuario (nome, email, telefone, senha, sexo, cargo) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $nome, $email, $senha, $sexo, $cargo);

    if ($stmt->execute()) {
        $retorno['status'] = 'ok';
        $retorno['mensagem'] = 'Usuário cadastrado com sucesso!';
    } else {
        $retorno['status'] = 'nok';
        $retorno['mensagem'] = 'Erro ao cadastrar usuário.';
    }

    $stmt->close();
} else {
    $retorno['status'] = 'nok';
    $retorno['mensagem'] = 'Campos ausentes no POST.';
}

$conexao->close();
echo json_encode($retorno);
?>