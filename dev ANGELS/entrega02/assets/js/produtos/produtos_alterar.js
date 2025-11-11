let userId = null;

document.addEventListener("DOMContentLoaded", () => {
    valida_sessao();
    configurarHeader();
    const url = new URLSearchParams(window.location.search);
    const id = url.get("id");
    userId = id;
    buscar(id);
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

async function buscar(id){
    const retorno = await fetch("../../app/Model/Produto/produto_get.php?id="+id);
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        alert("SUCESSO:" + resposta.mensagem);
        var registro = resposta.data[0];
        document.getElementById('nome').value = registro.nome;
        document.getElementById('descricao').value = registro.descricao;
        document.getElementById('preco').value = registro.preco;
        document.getElementById('estoque').value = registro.estoque;
        document.getElementById('categoria').value = registro.categoria;
        document.getElementById('id').value = id;
    }else{
        alert("ERRO:" + resposta.mensagem);
        window.location.href = "../../app/View/produtos.html";
    }
}

// Fase 2
document.getElementById("enviar").addEventListener("click", () => {
    alterar(userId);
});

async function alterar(id){
    var nome    = document.getElementById("nome").value;
    var descricao = document.getElementById("descricao").value;
    var preco   = document.getElementById("preco").value;
    var estoque   = document.getElementById("estoque").value;
    var categoria   = document.getElementById("categoria").value;
    var id      = document.getElementById("id").value;

    const fd = new FormData();
    fd.append("nome", nome);
    fd.append("descricao", descricao);
    fd.append("preco", preco);
    fd.append("estoque", estoque);
    fd.append("categoria", categoria);

    const retorno = await fetch("../../app/Model/Produto/produto_alterar.php?id="+id,
        {
        method: 'POST',
        body: fd  
        });
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        alert("SUCESSO: " + resposta.mensagem);
        window.location.href = "../../app/View/produtos.html";
    }else{
        alert("ERRO: " + resposta.mensagem);
    }
}