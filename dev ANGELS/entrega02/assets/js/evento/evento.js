document.addEventListener("DOMContentLoaded", () => {
    valida_sessao();
    configurarHeader();
    buscar();
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

async function configurarHeader(){
    const retorno = await fetch("../../core/valida_sessao.php"); 
    const resposta = await retorno.json();

    if(resposta.status == "ok" && resposta.data.nome){
        document.getElementById("welcome-prefix").textContent = `Bem-vindo,`;
        document.getElementById("welcome-username").textContent = resposta.data.nome;
    } else {
        document.getElementById("welcome-prefix").textContent = ``;
        document.getElementById("welcome-username").textContent = ``;
    }
}

document.getElementById("novo_evento").addEventListener("click", function() {
    window.location.href = "evento_novo.html";
});

async function buscar() {
    const retorno = await fetch("../../app/Model/Evento/evento_get.php");
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        preencherTabela(resposta.data);
    }else{
        alert(resposta.mensagem);
    }
}

async function excluir(id) {
    const retorno = await fetch("../../app/Model/Evento/evento_excluir.php?id="+id);
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        alert(resposta.mensagem);
        window.location.reload();
    }else {
        alert(resposta.mensagem);
    }
}

function preencherTabela(tabela) {
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
        html += `
                <tr>
                <td>${tabela[i].nome}</td>
                <td>${tabela[i].data_hora}</td>
                <td>${tabela[i].duracao}</td>
                <td>${tabela[i].local}</td>
                <td>${tabela[i].descricao}</td>
                <td>
                    <a href='evento_alterar.html?id=${tabela[i].id}' class="btn btn-sm btn-info me-2">Alterar</a>
                    <a href='#' onclick='excluir(${tabela[i].id})' class="btn btn-sm btn-danger">Excluir</a>
                </td>
                </tr>
                `;
    }
    html += `</table>`;
    document.getElementById("lista_de_eventos").innerHTML = html;
}