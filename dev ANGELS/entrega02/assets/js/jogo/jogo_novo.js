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

document.getElementById("enviar").addEventListener("click", (e) => {
    e.preventDefault();
    novo();
});

async function novo(){
    var inicio      = document.getElementById("inicio").value;
    var fim         = document.getElementById("fim").value;
    var adversario  = document.getElementById("adversario").value;
    var tipo        = document.getElementById("tipo").value;
    var pontclube   = document.getElementById("pontclube").value;
    var pontadvers  = document.getElementById("pontadvers").value;
    var observ      = document.getElementById("observ").value;

    const fd = new FormData();
    fd.append("inicio", inicio);
    fd.append("fim", fim);
    fd.append("adversario", adversario);
    fd.append("tipo", tipo);
    fd.append("pontclube", pontclube);
    fd.append("pontadvers", pontadvers);
    fd.append("observ", observ);

    const retorno = await fetch("../../app/Model/Jogo/jogo_novo.php",
        {
        method: 'POST',
        body: fd  
        });
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        alert("SUCESSO: " + resposta.mensagem);
        window.location.href = "../../app/View/jogos.html";
    }else{
        alert("ERRO: " + resposta.mensagem);
    }
}