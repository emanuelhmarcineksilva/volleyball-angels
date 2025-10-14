const containerProdutos = document.getElementById("lista_de_produtos");
const formBusca = document.getElementById('form_busca');
const inputBusca = document.getElementById('input_busca');

document.getElementById("novo_produto").addEventListener("click", function() {
    window.location.href = "registro_produtos.html";
});

function renderizarProdutos(listaParaRenderizar) {
    containerProdutos.innerHTML = "";

    if (!listaParaRenderizar || listaParaRenderizar.length === 0) {
        containerProdutos.innerHTML = `<p class="col-12 text-center">Nenhum produto para exibir.</p>`;
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
                            <p class="m-0 me-2"><strong>Nome:</strong></p>
                            <a id="nome_${idOriginal}" onclick="mostrarEdicao(${idOriginal}, 'nome')" class="m-0 flex-grow-1 text-end editable-field">${produto.nome}</a>
                            <input type="text" id="input_nome_${idOriginal}" class="form-control flex-grow-1" value="${produto.nome}" hidden>
                            <a class="btn btn-sm btn-success ms-2" id="ok_nome_${idOriginal}" onclick="editarProduto(${idOriginal}, 'nome')" hidden>Ok</a>
                        </div>

                        <div class="d-flex align-items-center mb-2">
                            <p class="m-0 me-2"><strong>Descrição:</strong></p>
                            <a id="descricao_${idOriginal}" onclick="mostrarEdicao(${idOriginal}, 'descricao')" class="m-0 flex-grow-1 text-end editable-field">${produto.descricao}</a>
                            <input type="text" id="input_descricao_${idOriginal}" class="form-control flex-grow-1" value="${produto.descricao}" hidden>
                            <a class="btn btn-sm btn-success ms-2" id="ok_descricao_${idOriginal}" onclick="editarProduto(${idOriginal}, 'descricao')" hidden>Ok</a>
                        </div>

                        <div class="d-flex align-items-center">
                            <p class="m-0 me-2"><strong>Preço:</strong></p>
                            <a id="preco_${idOriginal}" onclick="mostrarEdicao(${idOriginal}, 'preco')" class="m-0 flex-grow-1 text-end editable-field">${produto.preco}</a>
                            <input type="number" id="input_preco_${idOriginal}" class="form-control flex-grow-1" value="${produto.preco}" hidden>
                            <a class="btn btn-sm btn-success ms-2" id="ok_preco_${idOriginal}" onclick="editarProduto(${idOriginal}, 'preco')" hidden>Ok</a>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent border-top-0 text-center">
                        <a onclick="excluirProduto(${idOriginal})" class="btn btn-danger m-1">Excluir</a>
                    </div>
                </div>
            </div>
        `;
    }
    containerProdutos.innerHTML = html;
}

function excluirProduto(id) {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
        let listaProdutos = JSON.parse(localStorage.getItem("listaProdutos")) || [];
        listaProdutos.splice(id, 1);
        localStorage.setItem("listaProdutos", JSON.stringify(listaProdutos));
        renderizarProdutos(listaProdutos);
    }
}

function mostrarEdicao(id, campo) {
    // Esconde o texto e mostra o campo de input
    document.getElementById(`${campo}_${id}`).hidden = true;
    document.getElementById(`input_${campo}_${id}`).hidden = false;
    document.getElementById(`ok_${campo}_${id}`).hidden = false;
}

function editarProduto(id, campo) {
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

/*INPUTS

=== Radio ===
<div class="d-flex align-items-center mb-2">
    <p class="m-0 me-2"><strong>Radios:</strong></p>
    <a id="radio_${idOriginal}" onclick="mostrarEdicao(${idOriginal}, 'radio')" class="m-0 flex-grow-1 text-end editable-field">${jogo.radio}</a>
    <div id="input_radio_${idOriginal}" hidden>
        <input type="radio" name="edit-radio-${idOriginal}" value="Radio1" ${jogo.radio === 'Radio1' ? 'checked' : ''}> Radio1
        <input type="radio" name="edit-radio-${idOriginal}" value="Radio2" ${jogo.radio === 'Radio2' ? 'checked' : ''}> Radio2
    </div>
    <a class="btn btn-sm btn-success ms-2" id="ok_radio_${idOriginal}" onclick="editarJogo(${idOriginal}, 'radio')" hidden>Ok</a>
</div>

=== checkbox ===
<div class="d-flex align-items-center mb-2">
    <p class="m-0 me-2"><strong>Checkboxes:</strong></p>
    <a id="checkboxes_${idOriginal}" onclick="mostrarEdicao(${idOriginal}, 'checkboxes')" class="m-0 flex-grow-1 text-end editable-field">
        ${jogo.checkboxes && jogo.checkboxes.length > 0 ? jogo.checkboxes.join(', ') : 'Nenhum'}
    </a>
    <div id="input_checkboxes_${idOriginal}" hidden>
        <input type="checkbox" class="edit-checkboxes-${idOriginal}" value="Termos de uso aceitados" ${(jogo.checkboxes && jogo.checkboxes.includes('Termos de uso aceitados')) ? 'checked' : ''}> Aceito os termos<br>
        <input type="checkbox" class="edit-checkboxes-${idOriginal}" value="Newsletter aceitada" ${(jogo.checkboxes && jogo.checkboxes.includes('Newsletter aceitada')) ? 'checked' : ''}> Desejo receber a newsletter
    </div>
    <a class="btn btn-sm btn-success ms-2" id="ok_checkboxes_${idOriginal}" onclick="editarJogo(${idOriginal}, 'checkboxes')" hidden>Ok</a>
</div>


=== text, date, datetime-local, date, time ===
<div class="d-flex align-items-center mb-2">
    <p class="m-0 me-2"><strong>Adversário:</strong></p>
    <a id="adversario_${idOriginal}" onclick="mostrarEdicao(${idOriginal}, 'adversario')" class="m-0 flex-grow-1 text-end editable-field">${jogo.adversario}</a>
    <input type="text" id="input_adversario_${idOriginal}" class="form-control flex-grow-1" value="${jogo.adversario}" hidden>
    <a class="btn btn-sm btn-success ms-2" id="ok_adversario_${idOriginal}" onclick="editarJogo(${idOriginal}, 'adversario')" hidden>Ok</a>
</div>
*/