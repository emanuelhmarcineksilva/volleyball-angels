
// Login Usuário Existente

async function botonLogin() {
    var email;
    var senha;
    email = document.getElementById('email-login').value;
    senha = document.getElementById('senha-login').value;
    cargo = document.getElementById('seletor-sou').value;

    var retorno = loginsEfetuados(email, senha, cargo);
    var resposta = [
        'login efetuado com sucesso 1',
        'erro da senha',
        'não encontrado'
    ];

    alert(resposta[retorno]);

}
function loginsEfetuados(email, senha, cargo) {

    for (var i = 0; i < listaCadastro.length; i++) {
        var verificar = listaCadastro[i];
        if (email == verificar.email) {
            if (senha == verificar.senha) {
                if (cargo == verificar.cargo) {
                    window.location.href = "./gerenciamento-usuario.html";
                    return 0;
                } else {
                    return 1;
                }
            }
        }

    }
    console.log(listaCadastro)
    return 2;

}
