<?php
    include_once('C:\xampp\htdocs\angels\dev ANGELS\entrega02\core\conexao.php');

    $retorno = [
        'status'    => '',
        'mensagem'  => '',
        'data'      => []
    ];

    if(isset($_GET['id'])){
        $nome       = $_POST['nome'];
        $email      = $_POST['email'];
        $senha      = $_POST['senha'];
        $telefone   = $_POST['telefone'];
        $sexo       = $_POST['sexo'];
        $cargo      = $_POST['cargo'];

        $stmt = $conexao->prepare("UPDATE usuario SET nome = ?, email = ?, senha = ?, telefone = ?, sexo = ?, cargo = ? WHERE id = ?");
        $stmt->bind_param("ssssssi", $nome, $email, $senha, $telefone, $sexo, $cargo, $_GET['id']);
        $stmt->execute();

        if($stmt->affected_rows > 0){
            $retorno = [
                'status'    => 'ok',
                'mensagem'  => 'Registro alterado com sucesso!',
                'data'      => []
            ];
        }else{
                $retorno = [
                'status'    => 'nok',
                'mensagem'  => 'Não posso alterar um registro.'.json_encode($_GET),
                'data'      => []
            ];
        }
        $stmt->close();
    }else{
        $retorno = [
            'status'    => 'nok',
            'mensagem'  => 'Não posso alterar um registro sem um ID informado.',
            'data'      => []
        ];
    }

    $conexao->close();

    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);