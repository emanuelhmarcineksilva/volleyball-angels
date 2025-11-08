<?php
    include_once(__DIR__ . '/../../core/conexao.php');
    $retorno = [
        'status'    => '', // ok - nok
        'mensagem'  => '', // mensagem que envio para o front
        'data'      => []
    ];

    $stmt = $conexao->prepare("SELECT * FROM usuario WHERE email = ? AND senha = ?");
    $stmt->bind_param("ss",$_POST['email'],$_POST['senha']);

    $stmt->execute();
    $resultado = $stmt->get_result();

    $tabela = [];
    if($resultado->num_rows > 0){
        while($linha = $resultado->fetch_assoc()){
            $tabela[] = $linha;
        }

        session_start();
        $_SESSION['usuario'] = $tabela;

        $retorno = [
            'status'    => 'ok', // ok - nok
            'mensagem'  => 'Sucesso, consulta efetuada.', // mensagem que envio para o front
            'data'      => $tabela
        ];
    }else{
        $retorno = [
            'status'    => 'nok', // ok - nok
            'mensagem'  => 'Não há registros', // mensagem que envio para o front
            'data'      => []
        ];
    }

    $stmt->close();
    $conexao->close();

    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);
?>