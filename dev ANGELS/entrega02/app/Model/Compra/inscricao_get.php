<?php
    // Lista inscricoes. Usuario comum ve apenas os proprios eventos; admin
    // ve a lista completa, util para contar os presentes de cada evento.
    include_once(__DIR__ . '/../../../core/permissao.php');
    include_once(__DIR__ . '/../../../core/conexao.php');

    exigir_login();

    $usuario = usuario_atual();
    $eh_admin = eh_administrador() ? 1 : 0;
    $id_usuario_atual = (int) $usuario['id'];

    if(isset($_GET['id_evento'])){
        $stmt = $conexao->prepare(
            "SELECT i.id, i.id_evento, i.data_inscricao, e.nome AS evento, e.data_hora, u.nome AS inscrito
             FROM inscricao_evento i
             INNER JOIN evento e ON e.id = i.id_evento
             INNER JOIN usuario u ON u.id = i.id_usuario
             WHERE i.id_evento = ? AND (? = 1 OR i.id_usuario = ?)
             ORDER BY i.id"
        );
        $id_evento = (int) $_GET['id_evento'];
        $stmt->bind_param("iii", $id_evento, $eh_admin, $id_usuario_atual);
    }else{
        $stmt = $conexao->prepare(
            "SELECT i.id, i.id_evento, i.data_inscricao, e.nome AS evento, e.data_hora, u.nome AS inscrito
             FROM inscricao_evento i
             INNER JOIN evento e ON e.id = i.id_evento
             INNER JOIN usuario u ON u.id = i.id_usuario
             WHERE (? = 1 OR i.id_usuario = ?)
             ORDER BY i.id DESC"
        );
        $stmt->bind_param("ii", $eh_admin, $id_usuario_atual);
    }

    $stmt->execute();
    $resultado = $stmt->get_result();

    $tabela = [];
    if($resultado->num_rows > 0){
        while($linha = $resultado->fetch_assoc()){
            $tabela[] = $linha;
        }

        $retorno = [
            'status'    => 'ok',
            'mensagem'  => 'Sucesso, consulta efetuada.',
            'data'      => $tabela
        ];
    }else{
        $retorno = [
            'status'    => 'nok',
            'mensagem'  => 'Nenhuma inscrição encontrada.',
            'data'      => []
        ];
    }

    $stmt->close();
    $conexao->close();

    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);