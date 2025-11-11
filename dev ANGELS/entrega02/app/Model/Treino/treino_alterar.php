<?php
    include_once('C:\xampp\htdocs\angels\dev ANGELS\entrega02\core\conexao.php');

    $retorno = [
        'status'    => '',
        'mensagem'  => '',
        'data'      => []
    ];

    if(isset($_GET['id'])){
        $duracao    =$_POST['duracao'];
        $data       =$_POST['data'];
        $local      =$_POST['local'];
        $tipo       =$_POST['tipo'];          

        $stmt = $conexao->prepare("UPDATE treino SET
        duracao = ?,
        data_hora = ?,
        local = ?,
        tipo = ?
        WHERE id = ?");

        $stmt ->bind_param("ssssi",$duracao, $data, $local, $tipo, $_GET['id']);
        $stmt ->execute();

        if($stmt->affected_rows > 0){
            $retorno = [
                'status'    => 'ok',
                'mensagem'  => 'Treino alterado com sucesso',
                'data'      => []
            ];
        }else{
            $retorno = [
                'status'    => 'nok',
                'mensagem'  => 'Não foi possivel alterar o treino'.json_encode($_GET),
                'data'      => []
            ];
        }
        $stmt ->close();
    }else{
        $retorno = [
            'status'    => 'nok',
            'mensagem'  => 'Não posso alterar o treino sem um ID informado',
            'data'      => []
        ];
    }

    $conexao->close();

    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);
    