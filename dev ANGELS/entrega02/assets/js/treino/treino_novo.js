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

document.getElementById("enviar").addEventListener("click", (e) =>{
    e.preventDefault();
    novo();
});

async function novo() {
    var duracao  = document.getElementById('duracao').value;
    var data = document.getElementById('data').value; 
    var local = document.getElementById('local').value; 
    var tipo = document.querySelector('input[name="tipo"]:checked').value;     
    
    const fd = new FormData();
    fd.append("duracao", duracao);
    fd.append("data", data);
    fd.append("local", local);
    fd.append("tipo", tipo); 

    const retorno = await fetch("../../app/Model/Treino/treino_novo.php",         
        {
        method: 'POST',
        body: fd
        });
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        alert("SUCESSO: " + resposta.mensagem);
        window.location.href = '../../app/View/treino.html'
    }else{
        alert("ERRO: " +   resposta.mensagem);
    }
}