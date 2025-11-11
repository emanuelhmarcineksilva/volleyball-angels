<?php
    include_once('C:\xampp\htdocs\angels\dev ANGELS\entrega02\core\conexao.php'); 

    $retorno = [ 
        'status'    => '', 
        'mensagem'  => '', 
        'data'      => []
    ];

    if (isset($_GET['id'])){ 
        $stmt = $conexao->prepare("SELECT * from evento where id = ?");  
        $stmt->bind_param("i", $_GET['id']); 
    }else {
        $stmt = $conexao->prepare("SELECT * FROM evento"); 
    };
    $stmt->execute(); 
    $resultado = $stmt->get_result(); 

    $tabela = [];
    if($resultado->num_rows > 0){
        while($linha = $resultado->fetch_assoc()){ 
            $tabela[] = $linha;
        };

        $retorno = [
            'status'    => 'ok', 
            'mensagem'  => 'Sucesso, consulta efetuada.', 
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