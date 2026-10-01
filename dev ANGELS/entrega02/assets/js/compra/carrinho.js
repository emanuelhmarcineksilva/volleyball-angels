document.addEventListener("DOMContentLoaded", () => {
    // Comprimir o carrinho em objeto {id: quantidade} só na hora de enviar.
    // O sessionStorage guarda a lista completa (id, nome, preco, quantidade)
    // porque a tela precisa mostrar nome e preco; so o envio pede id/quantidade.
    iniciar_pagina(preencher_carrinho);
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

function salvar_carrinho(carrinho){
    sessionStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function formatar_preco(valor){
    return "R$ " + Number(valor).toFixed(2).replace('.', ',');
}

function alterar_quantidade(indice, delta){
    const carrinho = carrinho_atual();
    carrinho[indice].quantidade += delta;

    if(carrinho[indice].quantidade <= 0){
        carrinho.splice(indice, 1);
    }

    salvar_carrinho(carrinho);
    preencher_carrinho();
}

function remover(indice){
    const carrinho = carrinho_atual();
    carrinho.splice(indice, 1);
    salvar_carrinho(carrinho);
    preencher_carrinho();
}

async function finalizar(){
    const carrinho = carrinho_atual();
    if(carrinho.length === 0){
        alert("Seu carrinho está vazio.");
        return;
    }

    const forma_pagamento = document.getElementById("forma-pagamento").value;

    const fd = new FormData();
    fd.append("itens", JSON.stringify(
        carrinho.map(item => ({id: item.id, quantidade: item.quantidade}))
    ));
    fd.append("forma_pagamento", forma_pagamento);

    const retorno = await fetch("../../app/Model/Compra/pedido_novo.php",
        {
            method: "POST",
            body: fd
        }
    );
    const resposta = await retorno.json();

    if(resposta.status == 'ok'){
        // só limpa o carrinho depois do ok: se o servidor recusou por falta
        // de estoque, o usuario precisa achar os itens ainda na tela
        salvar_carrinho([]);
        alert("Compra registrada! Pedido nº " + resposta.data.id_pedido + " — total " + resposta.data.valor_total);
        window.location.href = "meus_pedidos.html";
    }else{
        alert("ERRO: " + resposta.mensagem);
    }
}

function preencher_carrinho(){
    const carrinho = carrinho_atual();
    const corpo = document.getElementById("lista_do_carrinho");

    if(carrinho.length === 0){
        corpo.innerHTML = `<p class="text-center">Seu carrinho está vazio. <a href="produtos.html">Ver produtos</a></p>`;
        document.getElementById("total-carrinho").textContent = "R$ 0,00";
        return;
    }

    var html = `
        <table class="table table-dark table-striped table-hover">
            <tr>
                <th>Produto</th>
                <th>Preço unitário</th>
                <th>Quantidade</th>
                <th>Subtotal</th>
                <th>#</th>
            </tr>`;

    let total = 0;

    for(var i = 0; i < carrinho.length; i++){
        const item = carrinho[i];
        const subtotal = item.preco * item.quantidade;
        total += subtotal;

        html += `
            <tr>
                <td>${item.nome}</td>
                <td>${formatar_preco(item.preco)}</td>
                <td>
                    <button type="button" class="btn btn-sm btn-outline-light" onclick="alterar_quantidade(${i}, -1)">-</button>
                    <span class="mx-2">${item.quantidade}</span>
                    <button type="button" class="btn btn-sm btn-outline-light" onclick="alterar_quantidade(${i}, 1)">+</button>
                </td>
                <td>${formatar_preco(subtotal)}</td>
                <td>
                    <button type="button" class="btn btn-sm btn-danger" onclick="remover(${i})">Remover</button>
                </td>
            </tr>
        `;
    }

    html += '</table>';
    corpo.innerHTML = html;
    document.getElementById("total-carrinho").textContent = formatar_preco(total);
}