<?php
    // Cancelar a propria inscricao. Endpoint separado do evento_alterar.php de
    // proposito: o usuario comum tem permissao de sair do evento, nunca de
    // mexer no evento. O WHERE por id_usuario garante que ninguem cancele a
    // inscricao de outra pessoa, nem que seja admin.
    include_once(__DIR__ . '/../../../core/permissao.php');
    include_once(__DIR__ . '/../../../core/conexao.php');

    exigir_login();

    $usuario = usuario_atual();

    $retorno = [
        'status'    => '',
        'mensagem'  => '',
        'data'      => []
    ];

    if(isset($_GET['id_evento'])){
        $id_usuario = (int) $usuario['id'];

        $stmt = $conexao->prepare("DELETE FROM inscricao_evento WHERE id_evento = ? AND id_usuario = ?");
        $id_evento = (int) $_GET['id_evento'];
        $stmt->bind_param("ii", $id_evento, $id_usuario);
        $stmt->execute();

        if($stmt->affected_rows > 0){
            $retorno = [
                'status'    => 'ok',
                'mensagem'  => 'Inscrição cancelada.',
                'data'      => []
            ];
        }else{
            $retorno = [
                'status'    => 'nok',
                'mensagem'  => 'Você não está inscrito neste evento.',
                'data'      => []
            ];
        }
        $stmt->close();
    }else{
        $retorno = [
            'status'    => 'nok',
            'mensagem'  => 'É necessário informar o evento.',
            'data'      => []
        ];
    }

    $conexao->close();

    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);