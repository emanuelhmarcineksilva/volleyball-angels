async function botonLogin() {
    const email = document.getElementById('email-login').value;
    const senha = document.getElementById('senha-login').value;
    const cargo = document.getElementById('seletor-sou').value;
    const dados = new FormData();
    dados.append('email', email);
    dados.append('senha', senha);

    const usuarioLogado = loginsEfetuados(email, senha, cargo);

    if (usuarioLogado) {

        sessionStorage.setItem('usuarioLogado', JSON.stringify({
            nome: usuarioLogado.nome,
            email: usuarioLogado.email,
            cargo: usuarioLogado.cargo
        }));
        window.location.href = "index.html";
    } else {
        alert("E-mail, senha ou cargo incorretos. Tente novamente.");
    }
}

function loginsEfetuados(email, senha, cargo) {
    for (var i = 0; i < listaCadastro.length; i++) {
        var usuario = listaCadastro[i];
        if (email === usuario.email && senha === usuario.senha && cargo === usuario.cargo) {
            return usuario;
        }
    }
    return null;
}

document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    botonLogin();
});
