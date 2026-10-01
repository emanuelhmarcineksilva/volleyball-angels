// escuta o submit do form, e nao o click do botao: sem preventDefault no
// click, o form fazia o GET nativo e recarregava a pagina antes do fetch
document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    login();
});

async function login() {
    var email = document.getElementById("email-login").value;
    var senha = document.getElementById("senha-login").value;

    const fd = new FormData();
    fd.append("email", email);
    fd.append("senha", senha);
//C:\xampp\htdocs\angels\dev ANGELS\entrega02\app\Model\Usuario
    const retorno = await fetch("../Model/Usuario/usuario_login.php", 
        {
            method: "POST",
            body: fd
        }
    );

    const resposta = await retorno.json();

    if(resposta.status == 'ok'){
        alert("Bem-vindo!");
        window.location.href = "../View/index.html";
    }else{
        alert("Credenciais inválidas.");
    }
}
