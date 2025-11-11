<?php
    include_once('C:\xampp\htdocs\angels\dev ANGELS\entrega02\core\conexao.php');

    $retorno = [
        'status'    => '',
        'mensagem'  => '',
        'data'      => []
    ];

    if(isset($_GET['id'])){
        // Info do front
        $inicio        = $_POST['inicio'];
        $fim           = $_POST['fim'];
        $adversario    = $_POST['adversario'];
        $tipo          = $_POST['tipo'];
        $pontclube     = $_POST['pontclube'];
        $pontadvers    = $_POST['pontadvers'];
        $observ        = $_POST['observ'];
    
        // Preparando para inserção no banco de dados
        $stmt = $conexao->prepare("UPDATE jogo SET 
        data_hora_inicio = ?,  
        data_hora_fim = ?, 
        adversario = ?, 
        tipo_jogo = ?, 
        ponto_clube = ?,
        ponto_adversario = ?,
        observacoes = ?
        WHERE id = ?");

        $stmt->bind_param("ssssiisi", $inicio, $fim, $adversario, $tipo, $pontclube, $pontadvers, $observ, $_GET['id']);
        $stmt->execute();

        if($stmt->affected_rows > 0){
            $retorno = [
                'status'    => 'ok',
                'mensagem'  => 'Jogo alterado com sucesso.',
                'data'      => []
            ];
        }else{
            $retorno = [
                'status'    => 'nok',
                'mensagem'  => 'Não posso alterar um jogo.'.json_encode($_GET),
                'data'      => []
            ];
        }
        $stmt->close();
    }else{
        $retorno = [
            'status'    => 'nok',
            'mensagem'  => 'Não posso alterar um jogo sem um ID informado.',
            'data'      => []
        ];
    }
    
    $conexao->close();

    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);