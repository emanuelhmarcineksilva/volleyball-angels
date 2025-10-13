const containerJogos = document.getElementById("lista_de_jogos");
const formBusca = document.getElementById('form_busca');
const inputBusca = document.getElementById('input_busca');

document.getElementById("novo_jogo").addEventListener("click", function() {
    window.location.href = "registro_jogos.html";
});

function renderizarJogos(listaParaRenderizar) {
    containerJogos.innerHTML = "";

    if (!listaParaRenderizar || listaParaRenderizar.length === 0) {
        containerJogos.innerHTML = `<p class="col-12 text-center">Nenhum jogo para exibir.</p>`;
        return;
    }

    let html = "";
    for (var i = 0; i < listaParaRenderizar.length; i++) {
        const jogo = listaParaRenderizar[i];
        const idOriginal = buscarIdOriginal(jogo);

        // Formata as datas para o formato yyyy-MM-ddTHH:mm, que é o esperado pelo input datetime-local
        const inicioFormatado = jogo.inicio ? jogo.inicio.slice(0, 16) : '';
        const fimFormatado = jogo.fim ? jogo.fim.slice(0, 16) : '';

        html += `
            <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="card h-100 d-flex flex-column">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-2">
                            <p class="m-0 me-2"><strong>Início:</strong></p>
                            <a id="inicio_${idOriginal}" onclick="mostrarEdicao(${idOriginal}, 'inicio')" class="m-0 flex-grow-1 text-body text-end editable-field">${jogo.inicio.replace('T', ' ')}</a>
                            <input type="datetime-local" id="input_inicio_${idOriginal}" class="form-control flex-grow-1" value="${inicioFormatado}" hidden>
                            <a class="btn btn-sm btn-success ms-2" id="ok_inicio_${idOriginal}" onclick="editarJogo(${idOriginal}, 'inicio')" hidden>Ok</a>
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <p class="m-0 me-2"><strong>Fim:</strong></p>
                            <a id="fim_${idOriginal}" onclick="mostrarEdicao(${idOriginal}, 'fim')" class="m-0 flex-grow-1 text-body text-end editable-field">${jogo.fim.replace('T', ' ')}</a>
                            <input type="datetime-local" id="input_fim_${idOriginal}" class="form-control flex-grow-1" value="${fimFormatado}" hidden>
                            <a class="btn btn-sm btn-success ms-2" id="ok_fim_${idOriginal}" onclick="editarJogo(${idOriginal}, 'fim')" hidden>Ok</a>
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <p class="m-0 me-2"><strong>Adversário:</strong></p>
                            <a id="adversario_${idOriginal}" onclick="mostrarEdicao(${idOriginal}, 'adversario')" class="m-0 flex-grow-1 text-body text-end editable-field">${jogo.adversario}</a>
                            <input type="text" id="input_adversario_${idOriginal}" class="form-control flex-grow-1" value="${jogo.adversario}" hidden>
                            <a class="btn btn-sm btn-success ms-2" id="ok_adversario_${idOriginal}" onclick="editarJogo(${idOriginal}, 'adversario')" hidden>Ok</a>
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <p class="m-0 me-2"><strong>Tipo:</strong></p>
                            <a id="tipo_${idOriginal}" onclick="mostrarEdicao(${idOriginal}, 'tipo')" class="m-0 flex-grow-1 text-body text-end editable-field">${jogo.tipo}</a>
                             <select id="input_tipo_${idOriginal}" class="form-select flex-grow-1" hidden>
                                <option value="competitivo" ${jogo.tipo === 'competitivo' ? 'selected' : ''}>Competitivo</option>
                                <option value="amistoso" ${jogo.tipo === 'amistoso' ? 'selected' : ''}>Amistoso</option>
                            </select>
                            <a class="btn btn-sm btn-success ms-2" id="ok_tipo_${idOriginal}" onclick="editarJogo(${idOriginal}, 'tipo')" hidden>Ok</a>
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <p class="m-0 me-2"><strong>Pontos (Clube):</strong></p>
                            <a id="pontClube_${idOriginal}" onclick="mostrarEdicao(${idOriginal}, 'pontClube')" class="m-0 flex-grow-1 text-body text-end editable-field">${jogo.pontClube}</a>
                            <input type="number" id="input_pontClube_${idOriginal}" class="form-control flex-grow-1" value="${jogo.pontClube}" hidden>
                            <a class="btn btn-sm btn-success ms-2" id="ok_pontClube_${idOriginal}" onclick="editarJogo(${idOriginal}, 'pontClube')" hidden>Ok</a>
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <p class="m-0 me-2"><strong>Pontos (Advers.):</strong></p>
                            <a id="pontAdvers_${idOriginal}" onclick="mostrarEdicao(${idOriginal}, 'pontAdvers')" class="m-0 flex-grow-1 text-body text-end editable-field">${jogo.pontAdvers}</a>
                            <input type="number" id="input_pontAdvers_${idOriginal}" class="form-control flex-grow-1" value="${jogo.pontAdvers}" hidden>
                            <a class="btn btn-sm btn-success ms-2" id="ok_pontAdvers_${idOriginal}" onclick="editarJogo(${idOriginal}, 'pontAdvers')" hidden>Ok</a>
                        </div>
                        <div class="d-flex align-items-center">
                            <p class="m-0 me-2"><strong>Observações:</strong></p>
                            <a id="observacoes_${idOriginal}" onclick="mostrarEdicao(${idOriginal}, 'observacoes')" class="m-0 flex-grow-1 text-body text-end editable-field">${jogo.observacoes}</a>
                            <input type="text" id="input_observacoes_${idOriginal}" class="form-control flex-grow-1" value="${jogo.observacoes}" hidden>
                            <a class="btn btn-sm btn-success ms-2" id="ok_observacoes_${idOriginal}" onclick="editarJogo(${idOriginal}, 'observacoes')" hidden>Ok</a>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent border-top-0 text-center">
                        <a onclick="excluirJogo(${idOriginal})" class="btn btn-danger m-1">Excluir</a>
                    </div>
                </div>
            </div>
        `;
    }
    containerJogos.innerHTML = html;
}

function excluirJogo(id) {
    if (confirm("Tem certeza que deseja excluir este jogo?")) {
        let listaJogos = JSON.parse(localStorage.getItem("listaJogos")) || [];
        listaJogos.splice(id, 1);
        localStorage.setItem("listaJogos", JSON.stringify(listaJogos));
        renderizarJogos(listaJogos);
    }
}

function mostrarEdicao(id, campo) {
    // Esconde o texto e mostra o campo de input e o botão OK
    document.getElementById(`${campo}_${id}`).hidden = true;
    document.getElementById(`input_${campo}_${id}`).hidden = false;
    document.getElementById(`ok_${campo}_${id}`).hidden = false;
}

function editarJogo(id, campo) {
    let listaJogos = JSON.parse(localStorage.getItem("listaJogos")) || [];
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
    listaJogos[id][campo] = novaInfo;
    localStorage.setItem("listaJogos", JSON.stringify(listaJogos));
    mensagem.innerHTML = `
        <div class="alert alert-success alert-caixa" role="alert">
            <p>Campo ${campo} editado com sucesso!</p>
            <button type="button" class="btn btn-success btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
    renderizarJogos(listaJogos);
}

function buscarIdOriginal(jogoFiltrado) {
    let listaCompleta = JSON.parse(localStorage.getItem("listaJogos")) || [];
    return listaCompleta.findIndex(jogo => JSON.stringify(jogo) === JSON.stringify(jogoFiltrado));
}

formBusca.addEventListener('input', function() {
    const listaCompleta = JSON.parse(localStorage.getItem("listaJogos")) || [];
    const termoBusca = inputBusca.value.trim().toLowerCase();

    if (termoBusca === "") {
        renderizarJogos(listaCompleta);
        return;
    }

    const jogosFiltrados = listaCompleta.filter(function(jogo) {
        // Corrigido para buscar pelo time adversário
        return jogo.adversario.toLowerCase().includes(termoBusca);
    });

    renderizarJogos(jogosFiltrados);
});

function carregarTudo() {
    const listaInicial = JSON.parse(localStorage.getItem("listaJogos")) || [];
    renderizarJogos(listaInicial);
}

carregarTudo();