<?php
    $servidor = "localhost:3306";
    $usuario  = "root";
    $senha    = "";
    $nome_banco = "angels";

    $conexao = new mysqli($servidor, $usuario, $senha, $nome_banco);
    if ($conexao->connect_error) {
        echo $conexao->connect_error;
    }
