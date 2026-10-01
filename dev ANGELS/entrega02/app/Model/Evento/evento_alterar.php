<?php
    include_once(__DIR__ . '/../../../core/permissao.php');
    include_once(__DIR__ . '/../../../core/conexao.php');

    exigir_administrador('alterar eventos');

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
            'mensagem'  => 'Registro não encontrado ou sem alterações (affected_rows = 0).',
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