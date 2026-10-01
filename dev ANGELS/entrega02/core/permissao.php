<?php
    // Controle de permissao por cargo. Todo endpoint que escreve (produto,
    // evento, usuario) chama exigir_administrador() no topo; todo endpoint que
    // depende de quem esta logado chama exigir_login().
    //
    // A checagem precisa acontecer aqui, no servidor, e nao so escondendo botao
    // no front: qualquer um pode digitar a URL do endpoint direto no navegador.

    if(session_status() === PHP_SESSION_ACTIVE){
        // nada a fazer, a sessao ja foi aberta por outro include
    }else{
        session_start();
    }

    // Cargos que o proprio visitante pode escolher no cadastro publico.
    // "Administrador" fica de fora de proposito: essa conta nao pode nascer de
    // um cadastro aberto, e sim de um admin mudar o cargo de outro usuario.
    const CARGOS_CADASTRO = ['Usuário', 'Membro', 'Jogador'];

    // Usuario logado, ou null. A sessao guarda a linha inteira do usuario em
    // $_SESSION['email'] (nome antigo do login), entao o primeiro elemento e o
    // registro. A senha fica aqui dentro por heranca do login antigo: nunca
    // devolver esse array inteiro para o front.
    function usuario_atual(){
        if(isset($_SESSION['email'][0]['id'])){
            return $_SESSION['email'][0];
        }
        return null;
    }

    function eh_administrador(){
        $usuario = usuario_atual();
        return $usuario !== null && $usuario['cargo'] === 'Administrador';
    }

    // Envelope de resposta no mesmo formato do resto do projeto. Encerra o
    // script: quem chama nao deve seguir executando INSERT depois de um 403.
    function responder($status, $mensagem, $data = []){
        if(!headers_sent()){
            header("Content-type:application/json;charset=utf-8");
        }
        echo json_encode([
            'status'    => $status,
            'mensagem'  => $mensagem,
            'data'      => $data
        ]);
        exit;
    }

    function exigir_login(){
        if(usuario_atual() === null){
            responder('nok', 'Você precisa estar logado para fazer isso.');
        }
    }

    // Unico cargo autorizado a criar/alterar/excluir produtos, eventos e
    // usuarios. Usuário, Membro e Jogador ficam de fora: eles só compram
    // produto e se inscrevem em evento.
    function exigir_administrador($acao = 'esta operação'){
        exigir_login();
        if(!eh_administrador()){
            responder('nok', 'Apenas administradores podem ' . $acao . '.');
        }
    }

    // Le a senha do POST de forma tolerante: quando o campo vem vazio (edicao
    // sem trocar a senha), devolve null para o chamador manter a senha atual.
    function senha_do_post(){
        if(!isset($_POST['senha'])){
            return null;
        }
        $senha = trim($_POST['senha']);
        return $senha === '' ? null : $senha;
    }