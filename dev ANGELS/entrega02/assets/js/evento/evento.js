// Lista de eventos. Administrador gerencia o evento (Novo/Alterar/Excluir);
// qualquer usuario logado se inscreve ou cancela a inscricao. Usuario, Membro
// e Jogador nunca veem os botoes de edicao — e o endpoint tambem recusaria,
// se chamassem direto.

document.addEventListener("DOMContentLoaded", () => {
    iniciar_pagina(buscar);
});

document.getElementById("logout-btn").addEventListener("click", (e) => {
    e.preventDefault();
    logout();
});

async function logout(){
    const retorno = await fetch("../../app/Model/Usuario/usuario_logout.php");
    const resposta = await retorno.json();
    if(resposta.status == 'ok'){
        window.location.href = '../View/login.html';
    }
}

async function configurarHeader(usuario){
    document.getElementById("welcome-prefix").textContent = `Bem-vindo,`;
    document.getElementById("welcome-username").textContent = usuario.nome;
}

async function buscar() {
    // O botao de criar evento e destravado aqui, e nao dentro de preencherTabela:
    // com a tabela vazia evento_get.php devolve 'nok' e preencherTabela nunca
    // roda — o admin ficava sem botao justamente quando mais precisava dele.
    if(eh_administrador()){
        document.getElementById("botao_novo_evento").classList.remove("d-none");
    }

    // inscricao_ids diz quais eventos a pessoa ja assinou, para o botao virar
    // "Inscrito" em vez de oferecer a inscricao de novo.
    const inscritos = await carregar_inscricoes();

    const retorno = await fetch("../../app/Model/Evento/evento_get.php");
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        preencherTabela(resposta.data, inscritos);
    }else{
        document.getElementById("mensagem").innerHTML =
            `<div class="alert alert-secondary">${resposta.mensagem}</div>`;
    }
}

async function carregar_inscricoes(){
    try{
        const retorno = await fetch("../../app/Model/Compra/inscricao_get.php");
        const resposta = await retorno.json();
        if(resposta.status !== "ok"){
            return [];
        }
        return resposta.data.map(inscricao => inscricao.id_evento);
    }catch(erro){
        return [];
    }
}

async function inscrever(id_evento){
    const fd = new FormData();
    fd.append("id_evento", id_evento);

    const retorno = await fetch("../../app/Model/Compra/inscricao_novo.php",
        {
            method: "POST",
            body: fd
        }
    );
    const resposta = await retorno.json();

    if(resposta.status == 'ok'){
        document.getElementById("mensagem").innerHTML =
            `<div class="alert alert-success">${resposta.mensagem}</div>`;
        buscar();
    }else{
        document.getElementById("mensagem").innerHTML =
            `<div class="alert alert-danger">${resposta.mensagem}</div>`;
    }
}

async function cancelar_inscricao(id_evento){
    if(!confirm("Deseja mesmo cancelar sua inscrição neste evento?")){
        return;
    }
    const retorno = await fetch("../../app/Model/Compra/inscricao_excluir.php?id_evento="+id_evento);
    const resposta = await retorno.json();

    if(resposta.status == 'ok'){
        document.getElementById("mensagem").innerHTML =
            `<div class="alert alert-info">${resposta.mensagem}</div>`;
        buscar();
    }else{
        document.getElementById("mensagem").innerHTML =
            `<div class="alert alert-danger">${resposta.mensagem}</div>`;
    }
}

async function excluir(id) {
    const retorno = await fetch("../../app/Model/Evento/evento_excluir.php?id="+id);
    const resposta = await retorno.json();
    if(resposta.status == 'ok'){
        alert(resposta.mensagem);
        window.location.reload();
    } else {
        alert(resposta.mensagem);
    }
}

function preencherTabela(tabela, inscritos) {
    const eh_admin = eh_administrador();

    var html = `
            <table class="table table-dark table-striped table-hover">
                <tr>
                    <th>Nome</th>
                    <th>Data</th>
                    <th>Duração</th>
                    <th>Local</th>
                    <th>Descrição</th>
                    <th>#</th>
                </tr>`;

    for(var i = 0; i<tabela.length; i++){
        const evento = tabela[i];
        let acoes = '';

        if(eh_admin){
            acoes = `
                <a href="evento_alterar.html?id=${evento.id}" class="btn btn-sm btn-info me-2">Alterar</a>
                <a href='#' onclick="excluir(${evento.id})" class="btn btn-sm btn-danger">Excluir</a>`;
        }else if(inscritos.includes(evento.id)){
            acoes = `
                <button type="button" class="btn btn-sm btn-outline-light me-2" disabled>Inscrito</button>
                <a href="#" onclick="cancelar_inscricao(${evento.id})" class="btn btn-sm btn-outline-danger">Cancelar</a>`;
        }else{
            acoes = `<button type="button" class="btn btn-sm btn-success"
                        onclick="inscrever(${evento.id})">Inscrever-se</button>`;
        }

        html += `
                <tr>
                <td>${evento.nome}</td>
                <td>${evento.data_hora}</td>
                <td>${evento.duracao}</td>
                <td>${evento.local}</td>
                <td>${evento.descricao}</td>
                <td>${acoes}</td>
                </tr>
                `;
    }
    html += `</table>`;
    document.getElementById("lista_de_eventos").innerHTML = html;
}