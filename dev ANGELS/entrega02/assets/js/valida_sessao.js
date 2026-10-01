// Guarda da sessao e utilitarios compartilhados por todas as paginas internas.
//
// usuarioLogado() guarda o cargo em memoria para o front esconder botao de
// Alterar/Excluir/Novo. Isso e so convenience: quem barra de verdade e
// exigir_administrador() nos endpoints, no servidor.

let usuarioLogado = null;

async function valida_sessao(){
    const retorno = await fetch('../../core/valida_sessao.php', {cache: 'no-store'});
    const resposta = await retorno.json();
    if(resposta.status == "nok"){
        window.location.href = "../../app/View/login.html";
        return null;
    }
    usuarioLogado = resposta.data;
    return usuarioLogado;
}

function eh_administrador(){
    return usuarioLogado !== null && usuarioLogado.administrador === true;
}

// Redireciona quem nao tem permissao de gerenciar a pagina. Usado pelas telas de
// cadastro/edicao, que nao fazem sentido para um Membro ou Jogador.
function exige_administrador(){
    if(!eh_administrador()){
        window.location.href = "../../app/View/index.html";
        return false;
    }
    return true;
}

// Espera a sessao antes de ligar os botoes, para nao renderizar a tabela e
// depois esconder o que ja apareceu.
async function iniciar_pagina(rotina, precisa_admin = false){
    const usuario = await valida_sessao();
    if(usuario === null){
        return;
    }
    if(precisa_admin && !exige_administrador()){
        return;
    }
    await configurarHeader(usuario);
    if(typeof rotina === 'function'){
        await rotina();
    }
}