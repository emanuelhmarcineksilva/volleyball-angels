<?php
    include_once(__DIR__ . '/../../../core/permissao.php');
    include_once(__DIR__ . '/../../../core/conexao.php');

    exigir_administrador('gerenciar usuários');

    $retorno = [
        'status'    => '',
        'mensagem'  => '',
        'data'      => []
    ];

    if(isset($_GET['id'])){
        $nome       = $_POST['nome'];
        $email      = $_POST['email'];
        $telefone   = $_POST['telefone'];
        $sexo       = $_POST['sexo'];
        $cargo      = $_POST['cargo'];

        // Senha em branco no formulario = manter a senha atual. Sem esse
        // desvio, editar o cargo de alguem zeraria a senha da pessoa.
        $senha = senha_do_post();

        if($senha === null){
            $stmt = $conexao->prepare("UPDATE usuario SET nome = ?, email = ?, telefone = ?, sexo = ?, cargo = ? WHERE id = ?");
            $stmt->bind_param("sssssi", $nome, $email, $telefone, $sexo, $cargo, $_GET['id']);
        }else{
            $stmt = $conexao->prepare("UPDATE usuario SET nome = ?, email = ?, senha = ?, telefone = ?, sexo = ?, cargo = ? WHERE id = ?");
            $stmt->bind_param("ssssssi", $nome, $email, $senha, $telefone, $sexo, $cargo, $_GET['id']);
        }
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
                'mensagem'  => 'Registro não encontrado ou sem alterações (affected_rows = 0).',
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