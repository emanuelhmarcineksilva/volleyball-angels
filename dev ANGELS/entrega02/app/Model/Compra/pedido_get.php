<?php
    // Historico de compras. Usuario comum ve so o proprio pedido; admin ve
    // qualquer um. Sem o WHERE por id_usuario, este endpoint entregaria o
    // endereco de entrega de todo mundo para qualquer conta logada.
    include_once(__DIR__ . '/../../../core/permissao.php');
    include_once(__DIR__ . '/../../../core/conexao.php');

    exigir_login();

    $usuario = usuario_atual();

    if(isset($_GET['id'])){
        $id_pedido = (int) $_GET['id'];
        $stmt = $conexao->prepare(
            "SELECT p.id, p.data_pedido, p.valor_total, p.forma_pagamento, p.situacao, u.nome AS comprador,
                    i.nome_produto, i.quantidade, i.preco_unitario
             FROM pedido p
             INNER JOIN usuario u ON u.id = p.id_usuario
             LEFT JOIN pedido_item i ON i.id_pedido = p.id
             WHERE p.id = ? AND (p.id_usuario = ? OR ? = 1)
             ORDER BY i.id"
        );
        $eh_admin = eh_administrador() ? 1 : 0;
        $id_usuario_atual = (int) $usuario['id'];
        $stmt->bind_param("iii", $id_pedido, $id_usuario_atual, $eh_admin);
    }else{
        $stmt = $conexao->prepare(
            "SELECT p.id, p.data_pedido, p.valor_total, p.forma_pagamento, p.situacao, u.nome AS comprador,
                    i.nome_produto, i.quantidade, i.preco_unitario
             FROM pedido p
             INNER JOIN usuario u ON u.id = p.id_usuario
             LEFT JOIN pedido_item i ON i.id_pedido = p.id
             WHERE ? = 1 OR p.id_usuario = ?
             ORDER BY p.id DESC, i.id"
        );
        $eh_admin = eh_administrador() ? 1 : 0;
        $id_usuario_atual = (int) $usuario['id'];
        $stmt->bind_param("ii", $eh_admin, $id_usuario_atual);
    }

    $stmt->execute();
    $resultado = $stmt->get_result();

    $pedidos = [];
    if($resultado->num_rows > 0){
        while($linha = $resultado->fetch_assoc()){
            // O JOIN traz uma linha por item. Agrupar por pedido aqui no PHP
            // evita uma segunda consulta so para buscar os itens.
            $id = (int) $linha['id'];
            if(!isset($pedidos[$id])){
                $pedidos[$id] = [
                    'id'             => $id,
                    'data_pedido'    => $linha['data_pedido'],
                    'valor_total'    => $linha['valor_total'],
                    'forma_pagamento'=> $linha['forma_pagamento'],
                    'situacao'       => $linha['situacao'],
                    'comprador'      => $linha['comprador'],
                    'itens'          => []
                ];
            }
            if($linha['nome_produto'] !== null){
                $pedidos[$id]['itens'][] = [
                    'nome_produto'    => $linha['nome_produto'],
                    'quantidade'      => (int) $linha['quantidade'],
                    'preco_unitario'  => $linha['preco_unitario']
                ];
            }
        }

        $retorno = [
            'status'    => 'ok',
            'mensagem'  => 'Sucesso, consulta efetuada.',
            'data'      => array_values($pedidos)
        ];
    }else{
        $retorno = [
            'status'    => 'nok',
            'mensagem'  => 'Nenhum pedido encontrado.',
            'data'      => []
        ];
    }

    $stmt->close();
    $conexao->close();

    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);