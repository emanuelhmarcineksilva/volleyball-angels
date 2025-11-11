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
    const retorno = await fetch("../../app/Model/Evento/evento_get.php?id="+id); 
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        alert("SUCESSO:" + resposta.mensagem);
        var registro = resposta.data[0]; 
        document.getElementById('nome').value = registro.nome; 
        document.getElementById('data').value = registro.data;
        document.getElementById('duracao').value = registro.duracao;
        document.getElementById('local').value = registro.local;
        document.getElementById('descricao').value = registro.descricao;
        document.getElementById('id').value = id;
    }else{
        alert("ERRO:" + resposta.mensagem);
        window.location.href = "../../app/View/eventos.html";
    }
}

document.getElementById("enviar").addEventListener("click", () => {
    alterar(userId);
});

async function alterar(id){
    var nome = document.getElementById('nome').value;
    var data_hora = document.getElementById('data').value;
    var duracao = document.getElementById('duracao').value;
    var local = document.getElementById('local').value;
    var descricao = document.getElementById('descricao').value;
    var id = document.getElementById('id').value;


    const fd = new FormData();
    fd.append("nome", nome);
    fd.append("data", data_hora);
    fd.append("duracao", duracao);
    fd.append("local", local);
    fd.append("descricao", descricao);

    const retorno = await fetch("../../app/Model/Evento/evento_alterar.php?id="+id,
        {
            method: 'POST',
            body: fd
        }
    ); 
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        alert("SUCESSO: " + resposta.mensagem);
        window.location.href = "../../app/View/eventos.html";
    }else{
        alert("ERRO: " + resposta.mensagem);
    }
}
