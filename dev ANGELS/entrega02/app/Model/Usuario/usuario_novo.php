<?php
    include_once('C:\xampp\htdocs\angels\dev ANGELS\entrega02\core\conexao.php');

    $retorno = [
        'status'    => '',
        'mensagem'  => '',
        'data'      => []
    ];

    //dados do banco
    $nome       = $_POST['nome'];
    $email      = $_POST['email'];
    $senha      = $_POST['senha'];
    $telefone   = $_POST['telefone'];
    $sexo       = $_POST['sexo'];
    $cargo      = $_POST['cargo'];

    $stmt = $conexao->prepare("INSERT INTO usuario (nome, email, telefone, senha, sexo, cargo) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $nome, $email, $telefone, $senha, $sexo, $cargo);
    $stmt->execute();
    
    if($stmt->affected_rows > 0){
        $retorno = [
            'status'    => 'ok',
            'mensagem'  => 'Registro inserido com sucesso!',
            'data'      => []
        ];
    }else{
        $retorno = [
            'status'    => 'nok',
            'mensagem'  => 'Falha ao inserir o registro',
            'data'      => []   
        ];
    }

    $stmt->close();
    $conexao->close();

    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);