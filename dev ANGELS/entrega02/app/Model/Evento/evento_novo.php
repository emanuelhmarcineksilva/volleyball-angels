<?php
    include_once(__DIR__ . '/../../../core/permissao.php');
    include_once(__DIR__ . '/../../../core/conexao.php');

    // Usuario, Membro e Jogador não cadastram evento. A conference fica no
    // servidor: esconder o botão no front não impede chamada direta por URL.
    exigir_administrador('cadastrar eventos');

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