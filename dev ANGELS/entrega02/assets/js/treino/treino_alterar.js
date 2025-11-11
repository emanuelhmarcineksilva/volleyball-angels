userId = null;

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

async function buscar(id) {
    const retorno = await fetch("../../app/Model/Treino/treino_get.php?id="+id); 
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        alert("SUCESSO:" + resposta.mensagem);
        var treino = resposta.data[0];
        document.getElementById("duracao").value = treino.duracao;
        document.getElementById("data").value = treino.data_hora;
        document.getElementById("local").value = treino.local;
        document.querySelector(`input[name="tipo"][value="${treino.tipo}"]`).checked = true;
    }else{
        alert("ERRO:" + resposta.mensagem);
        window.location.href ="../View/treino.html";  
    }
}

document.getElementById("enviar").addEventListener("click", () => {
    alterar(userId);
})

async function alterar(id) {
    var duracao  = document.getElementById('duracao').value;
    var data = document.getElementById('data').value; 
    var local = document.getElementById('local').value; 
    var tipo = document.querySelector('input[name="tipo"]:checked').value;   

    const fd = new FormData();
    fd.append("duracao", duracao);
    fd.append("data", data);
    fd.append("local", local);
    fd.append("tipo", tipo);   

    const retorno = await fetch("../../app/Model/Treino/treino_alterar.php?id="+id, {   
        method: 'POST',
        body: fd
    });

    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        alert("SUCESSO:" + resposta.mensagem)
        window.location.href = "../../app/View/treino.html"           
    }else{
        alert("ERRO:" + resposta.mensagem)
    }
}