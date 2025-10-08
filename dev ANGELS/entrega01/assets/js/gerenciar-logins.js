var listaLogins = JSON.parse(localStorage.getItem('listaCadastro')); // recuperando lista

const containerLogins = document.getElementById('container-cadastros');

const espacoEdicaoModal = document.getElementById('container-editor-modal');
const tituloEdicaoModal = document.getElementById('nome-mudanca-modal');
const inputEdicaoModal = document.getElementById('input-editor-modal');

let posicao = 0;

function mostrarTabelaLogin(){
    var html = "";
    for(var i=0; i<listaLogins.length; i++){

    html += `
            <div id="container-cadastros" class="login-pessoa">
                <h3>Nome:<a onclick="abrirInputEdicao('${listaLogins[i].nome}'), atualizaI(${i})" class="item-container-cadastro" data-bs-toggle="modal" data-bs-target="#exampleModal" id="nome-ges${i}"> ${listaLogins[i].nome}</a></h3>
                <p>E-mail:<a onclick="abrirInputEdicao('${listaLogins[i].email}')" class="item-container-cadastro" data-bs-toggle="modal" data-bs-target="#exampleModal" id="email-ges${i}"> ${listaLogins[i].email}</a></p>
                <p>Senha:<a onclick="abrirInputEdicao('${listaLogins[i].senha}')" class="item-container-cadastro" data-bs-toggle="modal" data-bs-target="#exampleModal" id="senha-ges${i}"> ${listaLogins[i].senha}</a></p>
                <p>Sexo:<a onclick="abrirInputEdicao('${listaLogins[i].sexo}')" class="item-container-cadastro" data-bs-toggle="modal" data-bs-target="#exampleModal" id="sexo-ges${i}"> ${listaLogins[i].sexo}</a></p>
                <p>É usuário:<a onclick="abrirInputEdicao('${listaLogins[i].usuario}')" class="item-container-cadastro" data-bs-toggle="modal" data-bs-target="#exampleModal" id="usua-ges${i}"> ${listaLogins[i].usuario}</a></p>
                <p>É membro:<a onclick="abrirInputEdicao('${listaLogins[i].membro}')" class="item-container-cadastro" data-bs-toggle="modal" data-bs-target="#exampleModal" id="membro-ges${i}"> ${listaLogins[i].membro}</a></p>
                <p>É jogador:<a onclick="abrirInputEdicao('${listaLogins[i].jogador}')" class="item-container-cadastro" data-bs-toggle="modal" data-bs-target="#exampleModal" id="jogador-ges${i}"> ${listaLogins[i].jogador}</a></p>
                <p>É treinador:<a onclick="abrirInputEdicao('${listaLogins[i].treinador}')" class="item-container-cadastro" data-bs-toggle="modal" data-bs-target="#exampleModal" id="treinador-ges${i}"> ${listaLogins[i].treinador}</a></p>
                <p>É adm:<a onclick="abrirInputEdicao('${listaLogins[i].adm}')" class="item-container-cadastro" data-bs-toggle="modal" data-bs-target="#exampleModal" id="adm-ges${i}"> ${listaLogins[i].adm}</a></p>
                <button class="botao-deletar-usuario" onclick="deletarConta('${i}')">Deletar</button>
            </div>
        `;

        containerLogins.innerHTML = html;
}
}

function abrirInputEdicao(posicao) {
    var htmlEdicao = `<input type="text" id="input-editor-modal" style="padding: 0.5em; width: 100%; margin: 1em auto;">`;

    var htmlTitulo = `"${posicao}"`;

    tituloEdicaoModal.innerHTML = htmlTitulo;
    espacoEdicaoModal.innerHTML = htmlEdicao;

}

function alterarValorItemModal() {
    var novoValor = inputEdicaoModal;

    listaLogins[posicao].nome = novoValor;

    console.log(posicao)
}

function atualizaI(numero) {
    posicao = numero;
}
