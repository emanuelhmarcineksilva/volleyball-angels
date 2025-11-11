let userId = null;

document.addEventListener("DOMContentLoaded", () => {
    valida_sessao();
    configurarHeader();
    const url = new URLSearchParams(window.location.search);
    const id = url.get('id');
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
    const retorno = await fetch("../../app/Model/Usuario/usuario_get.php?id="+id);
    const resposta = await retorno.json();
    if(resposta.status == 'ok'){
        alert("SUCESSO: " + resposta.mensagem);
        var registro = resposta.data[0];
        document.getElementById("nome").value = registro.nome;
        document.getElementById("email").value = registro.email;
        document.getElementById("senha").value = registro.senha;
        document.getElementById("telefone").value = registro.telefone;
        document.querySelector(`input[name="sexo"][value="${registro.sexo}"]`).checked = true;
        document.getElementById("seletor-cargo").value = registro.cargo;
        document.getElementById("id").value = id;
    }else{
        window.location.href = "../../app/View/usuario.html";
    }
}

document.getElementById("enviar").addEventListener("click", (e) => {
    e.preventDefault;
    alterar(userId);
});

async function alterar(id){
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const telefone = document.getElementById('telefone').value;
    const sexoRadio = document.querySelector('input[name="sexo"]:checked').value;
    const cargo = document.getElementById('seletor-cargo').value;

    const fd = new FormData();
    fd.append("nome", nome);
    fd.append("email", email);
    fd.append("senha", senha);
    fd.append("telefone", telefone);
    fd.append("sexo", sexoRadio);
    fd.append("cargo", cargo);

    const retorno = await fetch("../../app/Model/Usuario/usuario_alterar.php?id="+id,
        {
            method: 'POST',
            body: fd
        }
    );
    const resposta = await retorno.json();
    if(resposta.status == 'ok'){
        alert("SUCESSO: " + resposta.mensagem);
        window.location.href = "../../app/View/usuario.html";
    }else{
        alert("ERRO: " + resposta.mensagem);
    }
}