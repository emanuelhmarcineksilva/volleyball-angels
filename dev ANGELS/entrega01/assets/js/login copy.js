
// Login Usuário Existente

async function botonLogin() {
    var email;
    var senha;
    email = document.getElementById('email-login').value;
    senha = document.getElementById('senha-login').value;

    var retorno = loginsEfetuados(email, senha);
    var resposta = [
        'login efetuado com sucesso 1',
        'erro da senha',
        'não encontrado'
    ];

    alert(resposta[retorno]);

}
function loginsEfetuados(email, senha) {
    var existeADM = 0;
    for (var i = 0; i < listaCadastro.length; i++) {
        if (listaCadastro[i].email != "adim@gmail.com") {
            existeADM = existeADM;
        } else {
            existeADM += 1;
        };
    }
    if (existeADM == 0) {
        listaCadastro.push({
            email: "adim@gmail.com",
            senha: "adim"
        });
    }

    for (var i = 0; i < listaCadastro.length; i++) {
        var verificar = listaCadastro[i];
        if (email == "adim@gmail.com") {
            if (senha == "adim") {
                window.location.href = "./gerenciamento-usuario.html"
            }
        }else {
            if (email == verificar.email) {
                if (senha == verificar.senha) {
                    window.location.href = "./index.html";
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
