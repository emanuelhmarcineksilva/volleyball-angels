<?php
    // Inscricao em evento. Aberto a qualquer usuario logado — Usuario, Membro
    // e Jogador — porque e o unico uso de evento liberado a eles. Alterar ou
    // excluir o evento em si continua exclusivo do Administrador.
    include_once(__DIR__ . '/../../../core/permissao.php');
    include_once(__DIR__ . '/../../../core/conexao.php');

    exigir_login();

    $usuario = usuario_atual();

    $id_evento = (int) ($_POST['id_evento'] ?? 0);
    if($id_evento <= 0){
        responder('nok', 'É necessário informar o evento.');
    }

    $id_usuario = (int) $usuario['id'];

    // O indice unico (id_evento, id_usuario) do banco e a trava real contra
    // inscricao duplicada; o SELECT antes do INSERT e so para devolver uma
    // mensagem de verdade em vez de um erro de constraint.
    $stmt = $conexao->prepare("SELECT nome FROM evento WHERE id = ?");
    $stmt->bind_param("i", $id_evento);
    $stmt->execute();
    $evento = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if($evento === null){
        responder('nok', 'Evento não encontrado.');
    }

    $stmt = $conexao->prepare("SELECT id FROM inscricao_evento WHERE id_evento = ? AND id_usuario = ?");
    $stmt->bind_param("ii", $id_evento, $id_usuario);
    $stmt->execute();
    $ja_inscrito = $stmt->get_result()->num_rows > 0;
    $stmt->close();

    if($ja_inscrito){
        responder('nok', 'Você já está inscrito em "' . $evento['nome'] . '".');
    }

    $stmt = $conexao->prepare("INSERT INTO inscricao_evento (id_evento, id_usuario, data_inscricao) VALUES (?, ?, NOW())");
    $stmt->bind_param("ii", $id_evento, $id_usuario);
    $stmt->execute();

    if($stmt->affected_rows > 0){
        $retorno = [
            'status'    => 'ok',
            'mensagem'  => 'Inscrição confirmada em "' . $evento['nome'] . '".',
            'data'      => []
        ];
    }else{
        $retorno = [
            'status'    => 'nok',
            'mensagem'  => 'Não foi possível confirmar a inscrição.',
            'data'      => []
        ];
    }

    $stmt->close();
    $conexao->close();

    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);