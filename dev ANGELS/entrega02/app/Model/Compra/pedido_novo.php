<?php
    // Fecha a compra do carrinho. Disponivel para qualquer usuario logado:
    // Usuario, Membro e Jogador compram igual, ninguem fora do cargo
    // Administrador altera ou exclui produto.
    include_once(__DIR__ . '/../../../core/permissao.php');
    include_once(__DIR__ . '/../../../core/conexao.php');

    exigir_login();

    $usuario = usuario_atual();

    // O front manda os itens como JSON em um unico campo, porque um FormData
    // com N produtos viraria N campos com nome repetido.
    $itens = json_decode($_POST['itens'] ?? '[]', true);

    if(!is_array($itens) || count($itens) === 0){
        responder('nok', 'Seu carrinho está vazio.');
    }

    $forma_pagamento = $_POST['forma_pagamento'] ?? '';
    $formas_validas = ['PIX', 'Cartao de credito', 'Cartao de debito', 'Dinheiro'];
    if(!in_array($forma_pagamento, $formas_validas, true)){
        responder('nok', 'Forma de pagamento inválida.');
    }

    // Trava contra corrida: dois Anglees clicando em "Finalizar" no mesmo
    // instante nao podem conseguir a ultima unidade do mesmo produto.
    $conexao->begin_transaction();

    try{
        $valor_total = 0;
        $produtos_do_pedido = [];

        foreach($itens as $item){
            $id_produto = (int) ($item['id'] ?? 0);
            $quantidade = (int) ($item['quantidade'] ?? 0);

            if($id_produto <= 0 || $quantidade <= 0){
                $conexao->rollback();
                responder('nok', 'Carrinho inválido: produto ou quantidade incorreta.');
            }

            // FOR UPDATE segura a linha enquanto a gente decide: o segundo
            // clique waits here e so entao ve o estoque ja descontado.
            $stmt = $conexao->prepare("SELECT nome, preco, estoque FROM produto WHERE id = ? FOR UPDATE");
            $stmt->bind_param("i", $id_produto);
            $stmt->execute();
            $produto = $stmt->get_result()->fetch_assoc();
            $stmt->close();

            if($produto === null){
                $conexao->rollback();
                responder('nok', 'Um dos produtos não existe mais.');
            }

            if($produto['estoque'] < $quantidade){
                $conexao->rollback();
                responder(
                    'nok',
                    'Estoque insuficiente de "' . $produto['nome'] . '". Disponível: ' . $produto['estoque'] . '.'
                );
            }

            $produtos_do_pedido[] = [
                'id'        => $id_produto,
                'nome'      => $produto['nome'],
                'quantidade'=> $quantidade,
                'preco'     => $produto['preco']
            ];
            $valor_total += $quantidade * $produto['preco'];
        }

        $stmt = $conexao->prepare("INSERT INTO pedido (id_usuario, data_pedido, valor_total, forma_pagamento, situacao) VALUES (?, NOW(), ?, ?, 'Aguardando pagamento')");
        $id_usuario = (int) $usuario['id'];
        // "ids" = 1 int + 1 double + 1 string, um para cada variavel abaixo
        $stmt->bind_param("ids", $id_usuario, $valor_total, $forma_pagamento);
        $stmt->execute();
        $id_pedido = $stmt->insert_id;
        $stmt->close();

        foreach($produtos_do_pedido as $produto){
            $stmt = $conexao->prepare("INSERT INTO pedido_item (id_pedido, id_produto, nome_produto, quantidade, preco_unitario) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("iisss", $id_pedido, $produto['id'], $produto['nome'], $produto['quantidade'], $produto['preco']);
            $stmt->execute();
            $stmt->close();

            // nome_produto e preco_unitario vao copiados no item justamente
            // para o historico do pedido nao mudar quando o admin edita o
            // produto depois.
            $stmt = $conexao->prepare("UPDATE produto SET estoque = estoque - ? WHERE id = ?");
            $quantidade = $produto['quantidade'];
            $id_produto = $produto['id'];
            $stmt->bind_param("ii", $quantidade, $id_produto);
            $stmt->execute();
            $stmt->close();
        }

        $conexao->commit();

        $retorno = [
            'status'    => 'ok',
            'mensagem'  => 'Compra registrada com sucesso!',
            'data'      => [
                'id_pedido'   => (int) $id_pedido,
                'valor_total' => number_format((float) $valor_total, 2, ',', '.')
            ]
        ];
    }catch(mysqli_sql_exception $erro){
        $conexao->rollback();
        responder('nok', 'Não foi possível concluir a compra: ' . $erro->getMessage());
    }

    $conexao->close();

    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);