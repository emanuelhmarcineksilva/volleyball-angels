<?php
    include_once('C:\xampp\htdocs\angels\dev ANGELS\entrega02\core\conexao.php');

    $retorno = [
        'status'    => '',
        'mensagem'  => '',
        'data'      => []
    ];

if (isset($_GET['id'])) {
    // Simulando as informações que vem do front
    $nome       = $_POST['nome'];
    $data_hora  = $_POST['data'];
    $local      = $_POST['local'];
    $duracao    = $_POST['duracao'];
    $descricao  = $_POST['descricao'];

    // Preparando para inserção no banco de dados
    $stmt = $conexao->prepare("UPDATE evento SET nome = ?, data_hora = ?, local = ?, duracao = ?, descricao = ? WHERE id = ?");
    $stmt->bind_param("sssssi", $nome, $data_hora, $local, $duracao, $descricao, $_GET['id']);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        $retorno = [
            'status'    => 'ok',
            'mensagem'  => 'Registro alterado com sucesso.',
            'data'      => []
        ];
    } else {
        $retorno = [
            'status'    => 'nok',
            'mensagem'  => 'Não posso alterar um registro.' . json_encode($_GET),
            'data'      => []
        ];
    }
    $stmt->close();
} else {
    $retorno = [
        'status'    => 'nok',
        'mensagem'  => 'Não posso alterar um registro sem um ID informado.',
        'data'      => []
    ];
}

$conexao->close();

header("Content-type:application/json;charset:utf-8");
echo json_encode($retorno);