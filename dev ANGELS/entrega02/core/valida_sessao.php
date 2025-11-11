<?php
    session_start();
    if(isset($_SESSION['email']) && !empty($_SESSION['email'][0]['nome'])){
        $nome_usuario = $_SESSION['email'][0]['nome'];

        $retorno = [
            'status'    => 'ok',
            'mensagem'  => 'Nome do usuário retornado com sucesso.',
            'data'      => ['nome' => $nome_usuario]
        ];
    }else{
        $retorno = [
            'status'    => 'nok',
            'mensagem'  => 'Usuário não logado.',
            'data'      => []
        ];
    }
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($retorno);
