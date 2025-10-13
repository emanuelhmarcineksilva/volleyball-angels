// login.js

// Carrega a lista de cadastros do localStorage
const listaCadastro = JSON.parse(localStorage.getItem("listaCadastro")) || [];

async function botonLogin() {
    var email = document.getElementById('email-login').value;
    var senha = document.getElementById('senha-login').value;
    var cargo = document.getElementById('seletor-sou').value;

    // A função agora retorna o usuário encontrado ou null
    const usuarioLogado = loginsEfetuados(email, senha, cargo);

    if (usuarioLogado) {
        // Se o login for bem-sucedido:
        // 1. Salva os dados do usuário na sessão do navegador.
        //    Não salvamos a senha por segurança.
        sessionStorage.setItem('usuarioLogado', JSON.stringify({
            nome: usuarioLogado.nome,
            email: usuarioLogado.email,
            cargo: usuarioLogado.cargo
        }));

        // 2. Redireciona para a página principal (index.html)
        window.location.href = "index.html";
    } else {
        // Se o login falhar, exibe uma mensagem de erro.
        alert("E-mail, senha ou cargo incorretos. Tente novamente.");
    }
}

function loginsEfetuados(email, senha, cargo) {
    for (var i = 0; i < listaCadastro.length; i++) {
        var usuario = listaCadastro[i];
        if (email === usuario.email && senha === usuario.senha && cargo === usuario.cargo) {
            // Retorna o objeto do usuário se tudo corresponder
            return usuario;
        }
    }
    // Retorna null se nenhum usuário for encontrado
    return null;
}

// Adiciona um listener para o formulário para evitar o envio padrão
document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    botonLogin();
});
