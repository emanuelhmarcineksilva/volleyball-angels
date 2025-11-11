document.addEventListener("DOMContentLoaded", () => {
    valida_sessao();
    configurarHeader();
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

document.getElementById("enviar").addEventListener("click", () => {
    novo();
});

async function novo(){
    var nome      = document.getElementById("nome").value;
    var descricao = document.getElementById("descricao").value;
    var preco     = document.getElementById("preco").value;
    var estoque   = document.getElementById("estoque").value;
    var categoria = document.getElementById("categoria").value;

    const fd = new FormData();
    fd.append("nome", nome);
    fd.append("descricao", descricao);
    fd.append("preco", preco);
    fd.append("estoque", estoque);
    fd.append("categoria", categoria);

    const retorno = await fetch("../../app/Model/Produto/produto_novo.php",
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