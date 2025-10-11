// Cadastro Novo Usuário

var listaCadastro = JSON.parse(localStorage.getItem("listaCadastro"));

if(listaCadastro.length == 0) {
    listaCadastro = [
        {
            nome: "Adim",
            email: "adim@gmail.com",
            senha: "adim",
            adm: 1,
            treinador: 0,
            membro: 0,
            jogador: 0,
            usuario: 0           
        }
    ];
}
console.log(listaCadastro)

async function realizarCadastro() {
    var nome;
    var email;
    var senha;
    var sexo;

    nome = document.getElementById('nome-cadastro').value;
    email = document.getElementById('email-cadastro').value;
    senha = document.getElementById('senha-cadastro').value;
    sexo = document.getElementById('seletor-sexo').value;

    var cadastrando = inserindoDados(nome, email, senha, sexo); /// Aqui são o novoNome, novoEmail e novaSenha
    var erros = [
        "Já existe cadastro com esse E-mail!",
        "Cadastrado com sucesso!"
    ];


    console.log(listaCadastro);
    alert(erros[cadastrando]);

}

function inserindoDados(novoNome, novoEmail, novaSenha, novoSexo) {
    for(var i=0; i<listaCadastro.length; i++) {
        var emailUsados = listaCadastro[i].email; 
        if(emailUsados == novoEmail) {
            return 0;
        } 
    }

    listaCadastro.push({
        nome: novoNome,
        email: novoEmail,
        senha: novaSenha,
        sexo: novoSexo,
        adm: 0,
        treinador: 0,
        membro: 0,
        jogador: 0,
        usuario: 1
    });
    
    localStorage.setItem('listaCadastro', JSON.stringify(listaCadastro));
    return 1;
}


