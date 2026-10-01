// Historico de compras e inscricoes do usuario logado.

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
    await carregar_pedidos();
    await carregar_inscricoes();
}

async function carregar_pedidos(){
    const retorno = await fetch("../../app/Model/Compra/pedido_get.php");
    const resposta = await retorno.json();
    const alvo = document.getElementById("lista_de_pedidos");

    if(resposta.status != "ok"){
        alvo.innerHTML = `<p class="text-center">${resposta.mensagem}</p>`;
        return;
    }

    let html = `
        <table class="table table-dark table-striped table-hover">
            <tr>
                <th>Pedido</th>
                <th>Data</th>
                <th>Itens</th>
                <th>Total</th>
                <th>Pagamento</th>
                <th>Situação</th>
            </tr>`;

    for(const pedido of resposta.data){
        const itens = pedido.itens
            .map(item => `${item.quantidade}x ${item.nome_produto}`)
            .join("<br>");

        html += `
            <tr>
                <td>${pedido.id}</td>
                <td>${pedido.data_pedido}</td>
                <td>${itens}</td>
                <td>R$ ${pedido.valor_total}</td>
                <td>${pedido.forma_pagamento}</td>
                <td>${pedido.situacao}</td>
            </tr>
        `;
    }

    html += '</table>';
    alvo.innerHTML = html;
}

async function carregar_inscricoes(){
    const retorno = await fetch("../../app/Model/Compra/inscricao_get.php");
    const resposta = await retorno.json();
    const alvo = document.getElementById("lista_de_inscricoes");

    if(resposta.status != "ok"){
        alvo.innerHTML = `<p class="text-center">${resposta.mensagem}</p>`;
        return;
    }

    let html = `
        <table class="table table-dark table-striped table-hover">
            <tr>
                <th>Evento</th>
                <th>Data do evento</th>
                <th>Inscrito em</th>
            </tr>`;

    for(const inscricao of resposta.data){
        html += `
            <tr>
                <td>${inscricao.evento}</td>
                <td>${inscricao.data_hora}</td>
                <td>${inscricao.data_inscricao}</td>
            </tr>
        `;
    }

    html += '</table>';
    alvo.innerHTML = html;
}