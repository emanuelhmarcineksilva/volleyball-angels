<?php
    // o mysqli lanca excecao (padrao do PHP 8.1+) quando o INSERT/update viola
    // uma regra do banco, e a excecao nao tratada matava o script com HTTP 500
    // e corpo vazio -- o front quebrava no res.json(). Handler abaixo devolve
    // JSON sempre, inclusive nessa hora.
    set_exception_handler(function ($erro) {
        if (!headers_sent()) {
            header("Content-type:application/json;charset=utf-8");
        }
        echo json_encode([
            'status'    => 'nok',
            'mensagem'  => 'Erro no banco: ' . $erro->getMessage(),
            'data'      => []
        ]);
        exit;
    });

    // 127.0.0.1 e nao "localhost": o mysqli usaria o socket unix quando o host
    // e "localhost". 3307 porque o MySQL do XAMPP foi movido pra ca pra
    // liberar a 3306, que agora e a porta do dev server.
    $servidor = "127.0.0.1:3307";
    $usuario  = "root";
    $senha    = "";
    $nome_banco = "angels";

    $conexao = new mysqli($servidor, $usuario, $senha, $nome_banco);
    if ($conexao->connect_error) {
        echo $conexao->connect_error;
    }

    // sem isso o mysqli anuncia latin1 e o "Usuário" do formulario (que chega
    // em utf8) nao casa com o ENUM da tabela
    $conexao->set_charset("utf8mb4");
