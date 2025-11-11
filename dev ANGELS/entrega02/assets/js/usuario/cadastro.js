document.getElementById("enviar").addEventListener("click", (e) => {
    e.preventDefault();
    novo();
});

document.addEventListener("DOMContentLoaded", () => {
    const referrer = document.referrer;
    const btnVoltar = document.getElementById("btn-voltar");
    const body = document.body;

    if (referrer.includes("usuario.html")) {
        body.classList.add("full-layout");
        btnVoltar.href = "usuario.html";
        valida_sessao();
        configurarHeader();
    } else {
        btnVoltar.href = "login.html";
    }
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

async function novo(){
    const nome = document.getElementById('nome-cadastro').value;
    const email = document.getElementById('email-cadastro').value;
    const senha = document.getElementById('senha-cadastro').value;
    const telefone = document.getElementById('telefone-cadastro').value;
    const sexoRadio = document.querySelector('input[name="sexo"]:checked').value;
    const cargo = document.getElementById('seletor-cargo').value;

    const fd = new FormData();
    fd.append("nome", nome);
    fd.append("email", email);
    fd.append("senha", senha);
    fd.append("telefone", telefone);
    fd.append("sexo", sexoRadio);
    fd.append("cargo", cargo);

    const retorno = await fetch("../../app/Model/Usuario/usuario_novo.php",
        {
            method: 'POST',
            body: fd
        }
    );
    const resposta = await retorno.json();
    if(resposta.status == 'ok'){
        alert("SUCESSO: " + resposta.mensagem);
    }else{
        alert("ERRO: " + resposta.mensagem);
    }
}
