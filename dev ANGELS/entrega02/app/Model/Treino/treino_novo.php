<?php
    include_once('C:\xampp\htdocs\angels\dev ANGELS\entrega02\core\conexao.php');
    
    $retorno = [
        'status'   => '',
        'mensagem'  => '',
        'data'     => []
    ];

    $duracao    = $_POST['duracao'];
    $data       = $_POST['data'];
    $local      = $_POST['local'];
    $tipo       = $_POST['tipo'];       

    $stmt = $conexao->prepare("INSERT INTO treino (duracao, data_hora, local, tipo) VALUES (?,?,?,?);");
    $stmt->bind_param("ssss",$duracao, $data, $local, $tipo);
    $stmt->execute();

    if($stmt->affected_rows > 0 ){
        $retorno = [
            'status'   => 'ok',
            'mensagem'  => 'Treino inserido com sucesso',
            'data'     => []
        ];
    }else{
        $retorno = [
            'status'   => 'nok',
            'mensagem'  => 'Falha ao inserir treino',
            'data'     => []
        ];
    }

    $stmt->close();
    $conexao->close();

    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);