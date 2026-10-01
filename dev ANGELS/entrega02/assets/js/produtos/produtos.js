// Lista de produtos. O que cada cargo ve muda na mesma tabela:
//   Administrador -> Novo / Alterar / Excluir
//   os demais      -> so o botao Comprar
// Comprar e liberado a todo mundo logado. Os botoes de edicao somem para
// Usuario, Membro e Jogador; o endpoint bloqueia a escrita de qualquer jeito,
// entao esconder o botao e so fachada — a trava de verdade esta no servidor.

document.addEventListener("DOMContentLoaded", () => {
    iniciar_pagina(buscar);
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

async function configurarHeader(usuario){
    document.getElementById("welcome-prefix").textContent = `Bem-vindo,`;
    document.getElementById("welcome-username").textContent = usuario.nome;
}

async function buscar(){
    const retorno = await fetch("../../app/Model/Produto/produto_get.php");
    const resposta = await retorno.json();
    if(resposta.status == "ok"){
        preencherTabela(resposta.data);
    }else{
        document.getElementById("mensagem").innerHTML =
            `<div class="alert alert-secondary">${resposta.mensagem}</div>`;
    }
}

async function excluir(id){
    const retorno = await fetch("../../app/Model/Produto/produto_excluir.php?id="+id);
    const resposta = await retorno.json();
    if(resposta.status == 'ok'){
        alert(resposta.mensagem);
        window.location.reload();
    }else{
        alert(resposta.mensagem);
    }
}

// Carrinho no sessionStorage: some quando a aba fecha, o que evita deixar
// preco travado na tela de quem ja fez logout.
function carrinho_atual(){
    const bruto = sessionStorage.getItem('carrinho');
    if(!bruto){
        return [];
    }
    try{
        return JSON.parse(bruto);
    }catch(erro){
        return [];
    }
}

function adicionar_ao_carrinho(id, nome, preco){
    const carrinho = carrinho_atual();
    const existente = carrinho.find(item => item.id === id);

    if(existente){
        existente.quantidade += 1;
    }else{
        carrinho.push({id: id, nome: nome, preco: preco, quantidade: 1});
    }

    sessionStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizar_contador();
    alert(nome + " foi adicionado ao carrinho.");
}

function atualizar_contador(){
    const badge = document.getElementById("carrinho-contador");
    if(!badge){
        return;
    }
    const total = carrinho_atual().reduce((soma, item) => soma + item.quantidade, 0);
    badge.textContent = total;
}

function formatar_preco(valor){
    return "R$ " + Number(valor).toFixed(2).replace('.', ',');
}

function preencherTabela(tabela){
    const eh_admin = eh_administrador();

    if(eh_admin){
        document.getElementById("botao_novo_produto").classList.remove("d-none");
    }

    var html = `
        <table class="table table-dark table-striped table-hover">
            <tr>
                <th> Nome </th>
                <th> Descrição </th>
                <th> Preço </th>
                <th> Estoque </th>
                <th> Categoria </th>
                <th> # </th>
            </tr>`;

    for(var i=0;i<tabela.length;i++){
        const produto = tabela[i];
        let acoes = '';

        // Comprar e liberado para todo mundo logado; os botoes de edicao sao
        // acrescentados so para o admin, que tem o que gerenciar.
        const sem_estoque = produto.estoque == 0 ? ' disabled' : '';
        let comprar = `<button type="button" class="btn btn-sm btn-success"${sem_estoque}
                    onclick="adicionar_ao_carrinho(${produto.id}, '${produto.nome.replace(/'/g, "\\'")}', ${produto.preco})">
                    Comprar
                </button>`;

        if(eh_admin){
            comprar += `
                <a href="produtos_alterar.html?id=${produto.id}" class="btn btn-sm btn-info ms-2">Alterar</a>
                <a href="#" onclick="excluir(${produto.id})" class="btn btn-sm btn-danger ms-2">Excluir</a>`;
        }

        acoes = comprar;

        html += `
            <tr>
                <td>${produto.nome}</td>
                <td>${produto.descricao}</td>
                <td>${formatar_preco(produto.preco)}</td>
                <td>${produto.estoque}</td>
                <td>${produto.categoria}</td>
                <td>${acoes}</td>
            </tr>
        `;
    }
    html += '</table>';
    document.getElementById("lista_de_produtos").innerHTML = html;
    atualizar_contador();
}