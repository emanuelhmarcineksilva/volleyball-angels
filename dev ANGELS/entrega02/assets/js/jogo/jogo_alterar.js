document.addEventListener("DOMContentLoaded", () => {
    valida_sessao();
    configurarHeader();
    const url = new URLSearchParams(window.location.search);
    const id = url.get("id");
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
    const retorno = await fetch("../../app/Model/Jogo/jogo_get.php?id="+id);
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        alert("SUCESSO:" + resposta.mensagem);
        var jogo = resposta.data[0];
        document.getElementById("inicio").value = jogo.data_hora_inicio;      
        document.getElementById("fim").value = jogo.data_hora_fim;            
        document.getElementById("adversario").value = jogo.adversario;
        document.getElementById("tipo").value = jogo.tipo_jogo;               
        document.getElementById("pontclube").value = jogo.ponto_clube;        
        document.getElementById("pontadvers").value = jogo.ponto_adversario; 
        document.getElementById("observ").value = jogo.observacoes;           
        document.getElementById("id").value = id;
    }else{
        alert("ERRO:" + resposta.mensagem);
        window.location.href = "../../app/View/jogos.html"; 
    }
}

// Fase 2
document.getElementById("enviar").addEventListener("click", () => {
    alterar();
});

async function alterar(){
    var inicio  = document.getElementById("inicio").value;
    var fim = document.getElementById("fim").value;
    var adversario   = document.getElementById("adversario").value;
    var tipo   = document.getElementById("tipo").value;
    var pontclube   = document.getElementById("pontclube").value;
    var pontadvers      = document.getElementById("pontadvers").value;
    var observ   = document.getElementById("observ").value;
    var id      = document.getElementById("id").value;

    const fd = new FormData();
    fd.append("inicio", inicio);
    fd.append("fim", fim);
    fd.append("adversario", adversario);
    fd.append("tipo", tipo);
    fd.append("pontclube", pontclube);
    fd.append("pontadvers", pontadvers);
    fd.append("observ", observ);

    const retorno = await fetch("../../app/Model/Jogo/jogo_alterar.php?id="+id,
        {
        method: 'POST',
        body: fd  
        });
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        alert("SUCESSO: " + resposta.mensagem);
        window.location.href = '../../app/View/jogos.html'
    }else{
        alert("ERRO: " + resposta.mensagem);
    }
}