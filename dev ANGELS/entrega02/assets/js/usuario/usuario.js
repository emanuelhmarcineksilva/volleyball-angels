document.addEventListener("DOMContentLoaded", () => {
    valida_sessao();
    configurarHeader();
    buscar();
});

document.getElementById("novo_cadastro").addEventListener("click", () => {
    window.location.href = 'cadastro.html';
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

async function buscar(){
    const retorno = await fetch("../../app/Model/Usuario/usuario_get.php");
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        preencherTabela(resposta.data);
    }else{
        alert(resposta.mensagem);
    }
}

async function excluir(id){
    const retorno = await fetch("../../app/Model/Usuario/usuario_excluir.php?id="+id);
    const resposta = await retorno.json();
    if(resposta.status == 'ok'){
        alert(resposta.mensagem);
        window.location.reload();
    }else{
        alert(resposta.mensagem);
    }
}

function preencherTabela(tabela){
    var html = `
        <table class="table table-dark table-striped table-hover">
            <tr>
                <th> Nome </th>
                <th> Email </th>
                <th> Senha </th>
                <th> Telefone </th>
                <th> Sexo </th>
                <th> Cargo </th>
                <th> # </th>
            </tr>`;
    for(var i=0;i<tabela.length;i++){
        html += `
            <tr>
                <td>${tabela[i].nome}</td>
                <td>${tabela[i].email}</td>
                <td>${tabela[i].senha}</td>
                <td>${tabela[i].telefone}</td>
                <td>${tabela[i].sexo}</td>
                <td>${tabela[i].cargo}</td>
                <td>
                    <a href='usuario_alterar.html?id=${tabela[i].id}' class="btn btn-sm btn-info me-2">Alterar</a> 
                    <a href='#' onclick='excluir(${tabela[i].id})' class="btn btn-sm btn-danger">Excluir</a>
                </td>
            </tr>
        `;
    }
    html += '</table>';
    document.getElementById("container-cadastros").innerHTML = html;
}
