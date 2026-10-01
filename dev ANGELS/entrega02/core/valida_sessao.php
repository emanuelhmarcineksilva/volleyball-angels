<?php
    include_once(__DIR__ . '/permissao.php');

    // O front precisa saber o cargo para esconder os botoes de Alterar/Excluir/
    // Novo Produto e Novo Evento. Isso e conveniencia de UX, nao seguranca: a
    // autoridade real esta nos endpoints, via exigir_administrador().
    $usuario = usuario_atual();

    if($usuario !== null){
        $retorno = [
            'status'    => 'ok',
            'mensagem'  => 'Sessão validada com sucesso.',
            'data'      => [
                'id'    => (int) $usuario['id'],
                'nome'  => $usuario['nome'],
                'cargo' => $usuario['cargo'],
                'administrador' => eh_administrador()
            ]
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