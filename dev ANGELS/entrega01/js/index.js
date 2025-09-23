
document.getElementById('entrar').addEventListener('click', function() {
    login();
});

async function login() {
    var email = document.getElementById('email').value;  //pega o valor do campo email
    var senha = document.getElementById('senha').value;

    const fd = new FormData();
    fd.append("email", email);
    fd.append("senha", senha);

    const retorno = await fetch("php/login.php",{ // AWAIT dis para o JS esperar a resposta do fetch antes de continuar a execuçao do codigo
        method: "POST",
        body: fd
    });

    const resposta = await retorno.json(); //converte o retorno do fetch em json
    console.log(resposta);

    // Repositorio Local Storage que armazena dados no navegador
    localStorage.setItem("sessao", JSON.stringify(resposta)); // stringify converte o retorno em uma string

    // Deu certo!

    window.location.href = "home/index.html"; //redireciona para a pagina home
};

