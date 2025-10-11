const containerLogins = document.getElementById('container-cadastros');

const espacoEdicaoModal = document.getElementById('container-editor-modal');
const tituloEdicaoModal = document.getElementById('nome-mudanca-modal');
const inputEdicaoModal = document.getElementById('input-editor-modal');


function mostrarTabelaLogin(){
    var listaLogins = JSON.parse(localStorage.getItem('listaCadastro')); // recuperando lista

    if (listaLogins.length == 0) {
        listaLogins.push({
            nome: "Adim",
            email: "adim@gmail.com",
            senha: "adim",
            adm: 1,
            treinador: 0,
            membro: 0,
            jogador: 0,
            usuario: 0           
    });
    }

    var html = "";
    for(var i=0; i<listaLogins.length; i++){

    html += `
            <div id="container-cadastros" class="login-pessoa">
                <h3>Nome:<a onclick="abrirInputEdicao('${listaLogins[i].nome}', ${i}, 'nome')" class="item-container-cadastro" data-bs-toggle="modal" data-bs-target="#exampleModal" id="nome-ges${i}"> ${listaLogins[i].nome}</a></h3>
                <p>E-mail:<a onclick="abrirInputEdicao('${listaLogins[i].email}',${i}, 'email')" class="item-container-cadastro" data-bs-toggle="modal" data-bs-target="#exampleModal" id="email-ges${i}"> ${listaLogins[i].email}</a></p>
                <p>Senha:<a onclick="abrirInputEdicao('${listaLogins[i].senha}', ${i}, 'senha')" class="item-container-cadastro" data-bs-toggle="modal" data-bs-target="#exampleModal" id="senha-ges${i}"> ${listaLogins[i].senha}</a></p>
                <p>Sexo:<a onclick="abrirInputEdicao('${listaLogins[i].sexo}', ${i}, 'sexo')" class="item-container-cadastro" data-bs-toggle="modal" data-bs-target="#exampleModal" id="sexo-ges${i}"> ${listaLogins[i].sexo}</a></p>
                <p>É usuário:<a onclick="abrirInputEdicao('${listaLogins[i].usuario}')" class="item-container-cadastro" data-bs-toggle="modal" data-bs-target="#exampleModal" id="usua-ges${i}"> ${listaLogins[i].usuario}</a></p>
                <p>É membro:<a onclick="abrirInputEdicao('${listaLogins[i].membro}')" class="item-container-cadastro" data-bs-toggle="modal" data-bs-target="#exampleModal" id="membro-ges${i}"> ${listaLogins[i].membro}</a></p>
                <p>É jogador:<a onclick="abrirInputEdicao('${listaLogins[i].jogador}')" class="item-container-cadastro" data-bs-toggle="modal" data-bs-target="#exampleModal" id="jogador-ges${i}"> ${listaLogins[i].jogador}</a></p>
                <p>É treinador:<a onclick="abrirInputEdicao('${listaLogins[i].treinador}')" class="item-container-cadastro" data-bs-toggle="modal" data-bs-target="#exampleModal" id="treinador-ges${i}"> ${listaLogins[i].treinador}</a></p>
                <p>É adm:<a onclick="abrirInputEdicao('${listaLogins[i].adm}')" class="item-container-cadastro" data-bs-toggle="modal" data-bs-target="#exampleModal" id="adm-ges${i}"> ${listaLogins[i].adm}</a></p>
                <button class="botao-deletar-usuario" onclick="deletarConta(${i})">Deletar</button>
            </div>
        `;

        containerLogins.innerHTML = html;
    }

    document.getElementById('container-cadastros').innerHTML = html;
}

function abrirInputEdicao(nomeDoItem, id, campo) {
    var htmlEdicao = `<input type="text" value="${nomeDoItem}" id="input-editor-modal" style="padding: 0.5em; width: 100%; margin: 1em auto;">`;

    var htmlTitulo = `"${nomeDoItem}"`;

    tituloEdicaoModal.innerHTML = htmlTitulo;
    espacoEdicaoModal.innerHTML = htmlEdicao;

    var novoValor = '';

    document.getElementById('botao-salvar-alteracao').addEventListener('click', function () {
        var listaLogins = JSON.parse(localStorage.getItem("listaCadastro")); // IMPORTANTE esse "listaCadastro" é o que o localStoragem ta armazenado, sempre que quiserr os dados da lista pega dele chamando dessa forma
        var valorInput = document.getElementById('input-editor-modal').value;
        novoValor = valorInput;

        listaLogins[id][campo] = novoValor;
        
        localStorage.setItem('listaCadastro', JSON.stringify(listaLogins)); // Atualisando localStorage

        mostrarTabelaLogin();

    });
    mostrarTabelaLogin();
}


function deletarConta(id) {
    var listaLogins = JSON.parse(localStorage.getItem('listaCadastro'));

    listaLogins.splice(id, 1);

    localStorage.setItem('listaCadastro', JSON.stringify(listaLogins));

    mostrarTabelaLogin();
}
