const containerTreinos = document.getElementById("lista_de_treinos");
const formBusca = document.getElementById('form_busca');
const inputBusca = document.getElementById('input_busca');

document.getElementById("nv_treino").addEventListener("click", function() {
    window.location.href = "registro_treino.html";
});

function renderizarTreinos(listaParaRenderizar) {
    containerTreinos.innerHTML = "";

    if (!listaParaRenderizar || listaParaRenderizar.length === 0) {
        containerTreinos.innerHTML = `<p class="col-12 text-center">Nenhum treino para exibir.</p>`;
        return;
    }

    let html = "";
    for (var i = 0; i < listaParaRenderizar.length; i++) {
        const treino = listaParaRenderizar[i];
        const idOriginal = buscarIdOriginal(treino);

        html += `
            <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="card h-100 d-flex flex-column">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-2">
                            <p class="m-0 me-2"><strong>Duração:</strong></p>
                            <a id="duracao_${idOriginal}" onclick="mostrarEdicao(${idOriginal}, 'duracao')" class="m-0 flex-grow-1 text-body text-end editable-field">${treino.duracao}</a>
                            <input type="text" id="input_duracao_${idOriginal}" class="form-control flex-grow-1" value="${treino.duracao}" hidden>
                            <a class="btn btn-sm btn-success ms-2" id="ok_duracao_${idOriginal}" onclick="editarTreino(${idOriginal}, 'duracao')" hidden>Ok</a>
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <p class="m-0 me-2"><strong>Data:</strong></p>
                            <a id="data_${idOriginal}" onclick="mostrarEdicao(${idOriginal}, 'data')" class="m-0 flex-grow-1 text-body text-end editable-field">${treino.data}</a>
                            <input type="date" id="input_data_${idOriginal}" class="form-control flex-grow-1" value="${treino.data}" hidden>
                            <a class="btn btn-sm btn-success ms-2" id="ok_data_${idOriginal}" onclick="editarTreino(${idOriginal}, 'data')" hidden>Ok</a>
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <p class="m-0 me-2"><strong>Hora:</strong></p>
                            <a id="hora_${idOriginal}" onclick="mostrarEdicao(${idOriginal}, 'hora')" class="m-0 flex-grow-1 text-body text-end editable-field">${treino.hora}</a>
                            <input type="time" id="input_hora_${idOriginal}" class="form-control flex-grow-1" value="${treino.hora}" hidden>
                            <a class="btn btn-sm btn-success ms-2" id="ok_hora_${idOriginal}" onclick="editarTreino(${idOriginal}, 'hora')" hidden>Ok</a>
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <p class="m-0 me-2"><strong>Local:</strong></p>
                            <a id="local_${idOriginal}" onclick="mostrarEdicao(${idOriginal}, 'local')" class="m-0 flex-grow-1 text-body text-end editable-field">${treino.local}</a>
                            <input type="text" id="input_local_${idOriginal}" class="form-control flex-grow-1" value="${treino.local}" hidden>
                            <a class="btn btn-sm btn-success ms-2" id="ok_local_${idOriginal}" onclick="editarTreino(${idOriginal}, 'local')" hidden>Ok</a>
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <p class="m-0 me-2"><strong>Tipo:</strong></p>
                            <a id="tipo_${idOriginal}" onclick="mostrarEdicao(${idOriginal}, 'tipo')" class="m-0 flex-grow-1 text-body text-end editable-field">${treino.tipo}</a>
                            <select id="input_tipo_${idOriginal}" class="form-select flex-grow-1" hidden>
                                <option value="Aerobico" ${treino.tipo === 'Aerobico' ? 'selected' : ''}>Aeróbico</option>
                                <option value="Forca" ${treino.tipo === 'Forca' ? 'selected' : ''}>Força</option>
                                <option value="Funcional" ${treino.tipo === 'Funcional' ? 'selected' : ''}>Funcional</option>
                                <option value="HIIT" ${treino.tipo === 'HIIT' ? 'selected' : ''}>HIIT</option>
                                <option value="Resistencia" ${treino.tipo === 'Resistencia' ? 'selected' : ''}>Resistência</option>
                                <option value="Jogo" ${treino.tipo === 'Jogo' ? 'selected' : ''}>Jogo</option>
                            </select>
                            <a class="btn btn-sm btn-success ms-2" id="ok_tipo_${idOriginal}" onclick="editarTreino(${idOriginal}, 'tipo')" hidden>Ok</a>
                        </div>
                        <div class="d-flex align-items-center">
                            <p class="m-0 me-2"><strong>ADM:</strong></p>
                            <a id="nome_${idOriginal}" onclick="mostrarEdicao(${idOriginal}, 'nome')" class="m-0 flex-grow-1 text-body text-end editable-field">${treino.nome}</a>
                            <input type="text" id="input_nome_${idOriginal}" class="form-control flex-grow-1" value="${treino.nome}" hidden>
                            <a class="btn btn-sm btn-success ms-2" id="ok_nome_${idOriginal}" onclick="editarTreino(${idOriginal}, 'nome')" hidden>Ok</a>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent border-top-0 text-center">
                        <a onclick="excluirTreino(${idOriginal})" class="btn btn-danger m-1">Excluir</a>
                    </div>
                </div>
            </div>
        `;
    }
    containerTreinos.innerHTML = html;
}

function excluirTreino(id) {
    if (confirm("Tem certeza que deseja excluir este treino?")) {
        let listaTreinos = JSON.parse(localStorage.getItem("listaTreinos")) || [];
        listaTreinos.splice(id, 1);
        localStorage.setItem("listaTreinos", JSON.stringify(listaTreinos));
        renderizarTreinos(listaTreinos);
    }
}

function mostrarEdicao(id, campo) {
    document.getElementById(`${campo}_${id}`).hidden = true;
    document.getElementById(`input_${campo}_${id}`).hidden = false;
    document.getElementById(`ok_${campo}_${id}`).hidden = false;
}

function editarTreino(id, campo) {
    let listaTreinos = JSON.parse(localStorage.getItem("listaTreinos")) || [];
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
    listaTreinos[id][campo] = novaInfo;
    localStorage.setItem("listaTreinos", JSON.stringify(listaTreinos));
    mensagem.innerHTML = `
        <div class="alert alert-success alert-caixa" role="alert">
            <p>Campo ${campo} editado com sucesso!</p>
            <button type="button" class="btn btn-success btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
    renderizarTreinos(listaTreinos);
}

function buscarIdOriginal(treinoFiltrado) {
    let listaCompleta = JSON.parse(localStorage.getItem("listaTreinos")) || [];
    return listaCompleta.findIndex(treino => JSON.stringify(treino) === JSON.stringify(treinoFiltrado));
}

formBusca.addEventListener('input', function() {
    const listaCompleta = JSON.parse(localStorage.getItem("listaTreinos")) || [];
    const termoBusca = inputBusca.value.trim().toLowerCase();

    if (termoBusca === "") {
        renderizarTreinos(listaCompleta);
        return;
    }

    const treinosFiltrados = listaCompleta.filter(function(treino) {
        // Buscando pelo nome do ADM
        return treino.nome.toLowerCase().includes(termoBusca);
    });

    renderizarTreinos(treinosFiltrados);
});

function carregarTudo() {
    const listaInicial = JSON.parse(localStorage.getItem("listaTreinos")) || [];
    renderizarTreinos(listaInicial);
}

carregarTudo();