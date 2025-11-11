<?php
    include_once('C:\xampp\htdocs\angels\dev ANGELS\entrega02\core\conexao.php');

    $retorno = [
        'status' => '',
        'mensagem' => '',
        'data' => []
    ];

    // pegando informações que vem do front
    $nome       = $_POST['nome'];
    $data       = $_POST['data'];
    $local      = $_POST['local'];
    $duracao    = $_POST['duracao'];
    $descricao  = $_POST['descricao'];

    $stmt = $conexao->prepare("INSERT INTO evento(nome, data_hora, local, duracao, descricao) VALUES (?,?,?,?,?)");
    $stmt->bind_param("sssss",  $nome, $data, $local, $duracao, $descricao);
    $stmt->execute();


    if($stmt->affected_rows > 0){
        $retorno = [
            'status' => 'ok',
            'mensagem' => 'registro inserido com sucesso',
            'data' => []
        ];
    }else{
        $retorno = [
            'status' => 'nok',
            'mensagem' => 'falha ao inserir o registro',
            'data' => []
        ];
    }

    $stmt->close();
    $conexao->close();

    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);