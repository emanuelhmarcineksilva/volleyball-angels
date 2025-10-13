const containerProdutos = document.getElementById("lista_de_produtos");
const formBusca = document.getElementById('form_busca');
const inputBusca = document.getElementById('input_busca');

document.getElementById("novo_produto").addEventListener("click", function() {
    window.location.href = "registro_produtos.html";
});

function renderizarProdutos(listaParaRenderizar) {
    containerProdutos.innerHTML = "";


    if (!listaParaRenderizar || listaParaRenderizar.length === 0) {
        containerProdutos.innerHTML = `<p class="col-12 text-center">Nenhum evento para exibir.</p>`;
        return;
    }

    let html = "";
    for (var i = 0; i < listaParaRenderizar.length; i++) {
        const produto = listaParaRenderizar[i];
        const idOriginal = buscarIdOriginal(produto);

        html += `
            <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="card h-100 d-flex flex-column">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-2">
                            <h3 id="nome_${idOriginal}" class="m-0 flex-grow-1">${produto.nome}</h3>
                            <a class="btn btn-sm btn-primary ms-2" onclick="mostrarEdicao(${idOriginal}, 'nome')">Editar</a>
                            <input type="text" id="input_nome_${idOriginal}" class="form-control ms-2 w-auto" value="${produto.nome}" hidden>
                            <a class="btn btn-sm btn-success ms-2" id="ok_nome_${idOriginal}" onclick="EditarProduto(${idOriginal}, 'nome')" hidden>Ok</a>
                        </div>
                        <div class="d-flex align-items-center mb-1">
                            <p id="descricao_${idOriginal}" class="m-0 flex-grow-1"><strong>Descricao:</strong> ${produto.descricao}</p>
                            <a class="btn btn-sm btn-primary ms-2" onclick="mostrarEdicao(${idOriginal}, 'descricao')">Editar</a>
                            <input type="text" id="input_descricao_${idOriginal}" class="form-control ms-2 w-auto" value="${produto.descricao}" hidden>
                            <a class="btn btn-sm btn-success ms-2" id="ok_descricao_${idOriginal}" onclick="EditarProduto(${idOriginal}, 'descricao')" hidden>Ok</a>
                        </div>
                        <div class="d-flex align-items-center mb-1">
                            <p id="preco_${idOriginal}" class="m-0 flex-grow-1"><strong>Preco:</strong> ${produto.preco}</p>
                            <a class="btn btn-sm btn-primary ms-2" onclick="mostrarEdicao(${idOriginal}, 'preco')">Editar</a>
                            <input type="number" id="input_preco_${idOriginal}" class="form-control ms-2 w-auto" value="${produto.preco}" hidden>
                            <a class="btn btn-sm btn-success ms-2" id="ok_preco_${idOriginal}" onclick="EditarProduto(${idOriginal}, 'preco')" hidden>Ok</a>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent border-top-0 text-center">
                        <a href="#" onclick="excluirProduto(${idOriginal})" class="btn btn-danger m-1">Excluir</a>
                    </div>
                </div>
            </div>
        `;
    }
    containerProdutos.innerHTML = html;
}

function excluirProduto(id) {
    if (confirm("Tem certeza que deseja excluir este evento?")) {
        let listaProdutos = JSON.parse(localStorage.getItem("listaProdutos")) || [];
        listaProdutos.splice(id, 1);
        localStorage.setItem("listaProdutos", JSON.stringify(listaProdutos));
        renderizarProdutos(listaProdutos);
    }
}

function mostrarEdicao(id, campo) {
    document.getElementById(`input_${campo}_${id}`).hidden = false;
    document.getElementById(`ok_${campo}_${id}`).hidden = false;
}

function EditarProduto(id, campo) {
    let listaProdutos = JSON.parse(localStorage.getItem("listaProdutos")) || [];
    const input = document.getElementById(`input_${campo}_${id}`);
    const novaInfo = input.value.trim();
    const mensagem = document.getElementById('mensagem');
    const regex = /^(?!\s*$).+/;
    mensagem.innerHTML = "";
    if (!regex.test(novaInfo)) {
        input.classList.add("invalido");  
        input.classList.remove("valido");
        mensagem.innerHTML = `
            <div class="alert alert-danger alert-caixa" role="alert"> 
                <p>Você preencheu o campo ${campo} indevidamente!</p>
                <button type="button" class="btn btn-danger btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;
        return;
    }
    input.classList.remove("invalido");
    input.classList.add("valido");
    listaProdutos[id][campo] = novaInfo;
    localStorage.setItem("listaProdutos", JSON.stringify(listaProdutos));
    mensagem.innerHTML = `
        <div class="alert alert-success alert-caixa" role="alert">
            <p>Campo ${campo} editado com sucesso!</p>
            <button type="button" class="btn btn-success btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
    renderizarProdutos(listaProdutos);
}

function EditarProduto(id, campo) {
    let listaProdutos = JSON.parse(localStorage.getItem("listaProdutos")) || [];
    var novaInfo = document.getElementById(`input_${campo}_${id}`).value;
    listaProdutos[id][campo] = novaInfo;
    localStorage.setItem("listaProdutos", JSON.stringify(listaProdutos));
    renderizarProdutos(listaProdutos);
}

function buscarIdOriginal(produtoFiltrado) {
    let listaCompleta = JSON.parse(localStorage.getItem("listaProdutos")) || [];
    return listaCompleta.findIndex(produto => JSON.stringify(produto) === JSON.stringify(produtoFiltrado));
}

formBusca.addEventListener('input', function() {
    const listaCompleta = JSON.parse(localStorage.getItem("listaProdutos")) || [];
    const termoBusca = inputBusca.value.trim().toLowerCase();

    if (termoBusca === "") {
        renderizarProdutos(listaCompleta);
        return;
    }

    const produtosFiltrados = listaCompleta.filter(function(produto) {
        return produto.nome.toLowerCase().includes(termoBusca);
    });

    renderizarProdutos(produtosFiltrados);
});

function carregarTudo() {
    const listaInicial = JSON.parse(localStorage.getItem("listaProdutos")) || [];
    renderizarProdutos(listaInicial);
}

carregarTudo();