<?php
include_once('C:\xampp\htdocs\angels\dev ANGELS\entrega02\core\conexao.php');

$retorno = [
    'status' => '',
    'mensagem' => '',
    'data' => []
];

if(isset($_GET['id'])){
    $stmt = $conexao->prepare("DELETE FROM evento WHERE id = ?");
    $stmt->bind_param("i", $_GET['id']);
    $stmt->execute();

    if($stmt->affected_rows > 0){
        $retorno = [
            'status' => 'ok',
            'mensagem' => 'Registro excluído',
            'data' => []
        ];
    }else{
        $retorno = [
            'status' => 'nok',
            'mensagem' => 'Registo não excluído',
            'data' => []
        ];
    }

    $stmt->close();
} else {
    $retorno = [
        'status' => 'nok',
        'mensagem' => 'É necessário informar um ID para exclusão',
        'data' => []
    ];
}
$conexao->close();

header("Content-type:application/json;charset:utf-8");
echo json_encode($retorno);