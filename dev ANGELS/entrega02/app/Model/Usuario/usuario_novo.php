<?php
    // O cadastro e publico, entao nao ha exigir_login() aqui. O include existe
    // pela constante CARGOS_CADASTRO, que limita o cargo escolhido no form.
    include_once(__DIR__ . '/../../../core/permissao.php');
    include_once(__DIR__ . '/../../../core/conexao.php');

    $retorno = [
        'status'    => '',
        'mensagem'  => '',
        'data'      => []
    ];

    //dados do banco
    $nome       = $_POST['nome'];
    $email      = $_POST['email'];
    $senha      = $_POST['senha'];
    $telefone   = $_POST['telefone'];
    $sexo       = $_POST['sexo'];

    // O cadastro e aberto, mas o cargo vai contra a whitelist. Sem isso,
    // qualquer visitante criava conta como Administrador chamando este arquivo
    // direto, e a restricao de edicao vira enfeite. Cargo so muda por um admin,
    // em usuario_alterar.php.
    $cargo      = isset($_POST['cargo']) && in_array($_POST['cargo'], CARGOS_CADASTRO, true)
                    ? $_POST['cargo']
                    : 'Usuário';

    $stmt = $conexao->prepare("INSERT INTO usuario (nome, email, telefone, senha, sexo, cargo) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $nome, $email, $telefone, $senha, $sexo, $cargo);
    $stmt->execute();
    
    if($stmt->affected_rows > 0){
        $retorno = [
            'status'    => 'ok',
            'mensagem'  => 'Registro inserido com sucesso!',
            'data'      => []
        ];
    }else{
        $retorno = [
            'status'    => 'nok',
            'mensagem'  => 'Falha ao inserir o registro',
            'data'      => []   
        ];
    }

    $stmt->close();
    $conexao->close();

    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);