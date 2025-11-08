<?php
    session_start();
    if(isset($_SESSION['usuario'])){
        $retorno = [
            'status'    => 'ok',
            'mensagem'  => '',
            'data'      => []
        ];
    }else{
        $retorno = [
            'status'    => 'nok',
            'mensagem'  => '',
            'data'      => []
        ];
    }
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($retorno);
?>