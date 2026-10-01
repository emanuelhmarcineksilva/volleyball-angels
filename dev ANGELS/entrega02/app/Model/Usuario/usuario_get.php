<?php
    include_once(__DIR__ . '/../../../core/permissao.php');
    include_once(__DIR__ . '/../../../core/conexao.php');

    // Somente admin gerencia usuarios. Antes qualquer visitante — inclusive
    // deslogado — listava todo mundo e a coluna de senha em texto puro.
    exigir_administrador('gerenciar usuários');

    $retorno = [
        'status'    => '',
        'mensagem'  => '',
        'data'      => []
    ];

    // senha fora da lista: nao ha nenhum uso legitimo para o front ler a senha
    // de outra pessoa, e mandar isso em JSON expõe a conta inteira.
    if(isset($_GET['id'])){
        $stmt = $conexao->prepare("SELECT id, nome, email, telefone, sexo, cargo FROM usuario WHERE id = ?");
        $stmt->bind_param("i", $_GET['id']);
    }else{
        $stmt = $conexao->prepare("SELECT id, nome, email, telefone, sexo, cargo FROM usuario");
    }

    $stmt->execute();
    $resultado = $stmt->get_result();

    $tabela = [];
    if($resultado->num_rows > 0){
        while($linha = $resultado->fetch_assoc()){
            $tabela[] = $linha;
        }

        $retorno = [
            'status'    => 'ok',
            'mensagem'  => 'Sucesso, consulta efetuada!',
            'data'      => $tabela
        ];
    }else{
        $retorno = [
            'status'    => 'nok',
            'mensagem'  => 'Não há registros',
            'data'      => []
        ];
    }

    $stmt->close();
    $conexao->close();

    header("Content-type:application/json;charset:utf-8");
    echo json_encode($retorno);