<?php
    include_once('C:\xampp\htdocs\angels\dev ANGELS\entrega02\core\conexao.php');
    
    $retorno = [
        'status'    => '',
        'mensagem'  => '',
        'data'      => []
    ];
    // Simulando as informações que vem do front
    $inicio        = $_POST['inicio'];
    $fim           = $_POST['fim'];
    $adversario    = $_POST['adversario'];
    $tipo          = $_POST['tipo'];
    $pontclube     = $_POST['pontclube'];
    $pontadvers    = $_POST['pontadvers'];
    $observ        = $_POST['observ'];

    // Preparando para inserção no banco de dados
    $stmt = $conexao->prepare("INSERT INTO jogo (data_hora_inicio, data_hora_fim, adversario, tipo_jogo, ponto_clube, ponto_adversario, observacoes) VALUES (?,?,?,?,?,?,?)");
    $stmt->bind_param("ssssiis",$inicio, $fim, $adversario, $tipo, $pontclube, $pontadvers, $observ);
    $stmt->execute();

    if($stmt->affected_rows > 0){
        $retorno = [
            'status' => 'ok',
            'mensagem' => 'Jogo inserido com sucesso',
            'data' => []
        ];
    }else{
        $retorno = [
            'status' => 'nok',
            'mensagem' => 'falha ao inserir o Jogo',
            'data' => []
        ];
    }

    $stmt->close();
    $conexao->close();

    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);