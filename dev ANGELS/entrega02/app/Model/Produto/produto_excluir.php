<?php
    include_once(__DIR__ . '/../../../core/permissao.php');
    include_once(__DIR__ . '/../../../core/conexao.php');

    exigir_administrador('excluir produtos');

    // Configurando o padrão de retorno em todas
    // as situações
    $retorno = [
        'status'    => '', // ok - nok
        'mensagem'  => '', // mensagem que envio para o front
        'data'      => []
    ];

    if(isset($_GET['id'])){
        // Segunda situação - RECEBENDO O ID por GET
        try{
            $stmt = $conexao->prepare("DELETE FROM produto WHERE id = ?");
            $stmt->bind_param("i",$_GET['id']);
            $stmt->execute();
        }catch(mysqli_sql_exception $erro){
            // produto_item guarda o id de cada produto ja comprado. Sem o
            // tratamento, o mysqli estouraria o erro cru do banco no alert.
            // Traduzir aqui: produto com pedido antigo não pode sumir, senão o
            // historico de compras fica sem referencia.
            if($erro->getCode() === 1451){
                $retorno = [
                    'status'    => 'nok',
                    'mensagem'  => 'Este produto já foi comprado e não pode ser excluído. Altere o estoque ou o preço.',
                    'data'      => []
                ];
            }else{
                $retorno = [
                    'status'    => 'nok',
                    'mensagem'  => 'Não foi possível excluir o produto.',
                    'data'      => []
                ];
            }
            $conexao->close();
            header("Content-type:application/json;charset:utf-8");
            echo json_encode($retorno);
            exit;
        }

        if($stmt->affected_rows > 0){
            $retorno = [
                'status'    => 'ok', // ok - nok
                'mensagem'  => 'Registro excluido', // mensagem que envio para o front
                'data'      => []
            ];
        }else{
            $retorno = [
                'status'    => 'nok', // ok - nok
                'mensagem'  => 'Registro não excluido', // mensagem que envio para o front
                'data'      => []
            ];
        }
        $stmt->close();
    }else{
        // Configurando o padrão de retorno em todas
        // as situações
        $retorno = [
            'status'    => 'nok', // ok - nok
            'mensagem'  => 'É necessário informar um ID para exclusão', // mensagem que envio para o front
            'data'      => []
        ];
    }
    $conexao->close();

    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);