<?php
    include_once(__DIR__ . '/../../../core/permissao.php');
    include_once(__DIR__ . '/../../../core/conexao.php');

    // Usuario, Membro e Jogador sao proibidos de mexer em produtos. A
    // permissao e conferida no servidor porque o botao escondido no front
    // nao impede ninguem de chamar este arquivo direto pela URL.
    exigir_administrador('cadastrar produtos');

    // Simulando as informações que vem do front
    $nome       = $_POST['nome']; // $_POST['nome'];
    $descricao  = $_POST['descricao'];
    $preco      = $_POST['preco'];
    $estoque    = $_POST['estoque'];
    $categoria  = $_POST['categoria'];

    // Preparando para inserção no banco de dados
    $stmt = $conexao->prepare("INSERT INTO produto (nome, descricao, preco, estoque, categoria) VALUES(?,?,?,?,?)");
    $stmt->bind_param("ssiss",$nome, $descricao, $preco, $estoque, $categoria);
    $stmt->execute();

    if($stmt->affected_rows > 0){
        $retorno = [
            'status' => 'ok',
            'mensagem' => 'registro inserido com sucesso',
            'data' => []
        ];
    }else{
        $retorno = [
            'status' => 'nok',
            'mensagem' => 'falha ao inserir o registro',
            'data' => []
        ];
    }

    $stmt->close();
    $conexao->close();

    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);