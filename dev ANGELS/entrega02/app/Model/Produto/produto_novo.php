<?php
    include_once('C:\xampp\htdocs\angels\dev ANGELS\entrega02\core\conexao.php');

    $retorno = [
        'status'    => '',
        'mensagem'  => '',
        'data'      => []
    ];
    // Simulando as informações que vem do front
    $nome       = $_POST['nome']; // $_POST['nome'];
    $descricao  = $_POST['descricao'];
    $preco      = $_POST['preco'];
    $estoque    = $_POST['estoque'];
    $categoria  = $_POST['categoria'];

    // Preparando para inserção no banco de dados
    $stmt = $conexao->prepare("INSERT INTO produto (nome, descricao, preco, estoque, categoria) VALUES(?,?,?,?,?)");
    $stmt->bind_param("ssiss",$nome, $descricao, $preco, $estoque, $categoria);
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
