<?php
    $servidor = "localhost:3306";
    $usuario  = "root";
    $senha    = "";
    $nome_banco = "angels";

    public function conectarBD(){
        $conexao = new mysqli($servidor, $usuario, $senha, $nome_banco);
        if ($conexao->connect_error) {
            die("Falha na conexão ao banco de dados: " . $conexao->connect_error);
        }
        return $conexao;
    }
?>