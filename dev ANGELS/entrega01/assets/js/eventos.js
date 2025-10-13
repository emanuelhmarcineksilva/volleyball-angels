const containerEventos = document.getElementById("lista_de_eventos");
const formBusca = document.getElementById('form_busca');
const inputBusca = document.getElementById('input_busca');

document.getElementById("novo_evento").addEventListener("click", function() {
    window.location.href = "registro_eventos.html";
});

function renderizarEventos(listaParaRenderizar) {
    containerEventos.innerHTML = "";

    if (!listaParaRenderizar || listaParaRenderizar.length === 0) {
        containerEventos.innerHTML = `<p class="col-12 text-center">Nenhum evento para exibir.</p>`;
        return;
    }

    let html = "";
    for (var i = 0; i < listaParaRenderizar.length; i++) {
        const evento = listaParaRenderizar[i];
        const idOriginal = buscarIdOriginal(evento);
        
        html += `
            <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="card h-100 d-flex flex-column">
                    <div class="card-body">

                        <div class="d-flex align-items-center mb-2">
                            <p class="m-0 me-2"><strong>Nome:</strong></p>
                            <a id="nome_${idOriginal}" onclick="mostrarEdicao(${idOriginal}, 'nome')" class="m-0 flex-grow-1 text-body text-end editable-field">${evento.nome}</a>
                            <input type="text" id="input_nome_${idOriginal}" class="form-control flex-grow-1" value="${evento.nome}" hidden>
                            <a class="btn btn-sm btn-success ms-2" id="ok_nome_${idOriginal}" onclick="editarEvento(${idOriginal}, 'nome')" hidden>Ok</a>
                        </div>

                        <div class="d-flex align-items-center mb-2">
                            <p class="m-0 me-2"><strong>Data:</strong></p>
                            <a id="data_${idOriginal}" onclick="mostrarEdicao(${idOriginal}, 'data')" class="m-0 flex-grow-1 text-body text-end editable-field">${evento.data}</a>
                            <input type="date" id="input_data_${idOriginal}" class="form-control flex-grow-1" value="${evento.data}" hidden>
                            <a class="btn btn-sm btn-success ms-2" id="ok_data_${idOriginal}" onclick="editarEvento(${idOriginal}, 'data')" hidden>Ok</a>
                        </div>

                        <div class="d-flex align-items-center mb-2">
                            <p class="m-0 me-2"><strong>Horário:</strong></p>
                            <a id="horario_${idOriginal}" onclick="mostrarEdicao(${idOriginal}, 'horario')" class="m-0 flex-grow-1 text-body text-end editable-field">${evento.horario}</a>
                            <input type="time" id="input_horario_${idOriginal}" class="form-control flex-grow-1" value="${evento.horario}" hidden>
                            <a class="btn btn-sm btn-success ms-2" id="ok_horario_${idOriginal}" onclick="editarEvento(${idOriginal}, 'horario')" hidden>Ok</a>
                        </div>

                        <div class="d-flex align-items-center">
                            <p class="m-0 me-2"><strong>Local:</strong></p>
                            <a id="local_${idOriginal}" onclick="mostrarEdicao(${idOriginal}, 'local')" class="m-0 flex-grow-1 text-body text-end editable-field">${evento.local}</a>
                            <input type="text" id="input_local_${idOriginal}" class="form-control flex-grow-1" value="${evento.local}" hidden>
                            <a class="btn btn-sm btn-success ms-2" id="ok_local_${idOriginal}" onclick="editarEvento(${idOriginal}, 'local')" hidden>Ok</a>
                        </div>

                    </div>
                    <div class="card-footer bg-transparent border-top-0 text-center">
                        <a onclick="excluirEvento(${idOriginal})" class="btn btn-danger m-1">Excluir</a>
                    </div>
                </div>
            </div>
        `;
    }
    containerEventos.innerHTML = html;
}

function excluirEvento(id) {
    if (confirm("Tem certeza que deseja excluir este evento?")) {
        let listaEventos = JSON.parse(localStorage.getItem("listaEventos")) || [];
        listaEventos.splice(id, 1);
        localStorage.setItem("listaEventos", JSON.stringify(listaEventos));
        renderizarEventos(listaEventos);
    }
}

function mostrarEdicao(id, campo) {
    document.getElementById(`input_${campo}_${id}`).hidden = false;
    document.getElementById(`ok_${campo}_${id}`).hidden = false;
}

function editarEvento(id, campo) {
    let listaEventos = JSON.parse(localStorage.getItem("listaEventos")) || [];
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
    listaEventos[id][campo] = novaInfo;
    localStorage.setItem("listaEventos", JSON.stringify(listaEventos));
    mensagem.innerHTML = `
        <div class="alert alert-success alert-caixa" role="alert">
            <p>Campo ${campo} editado com sucesso!</p>
            <button type="button" class="btn btn-success btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
    renderizarEventos(listaEventos);
}

function buscarIdOriginal(eventoFiltrado) {
    let listaCompleta = JSON.parse(localStorage.getItem("listaEventos")) || [];
    return listaCompleta.findIndex(evento => JSON.stringify(evento) === JSON.stringify(eventoFiltrado));
}

formBusca.addEventListener('input', function() {
    const listaCompleta = JSON.parse(localStorage.getItem("listaEventos")) || [];
    const termoBusca = inputBusca.value.trim().toLowerCase();

    if (termoBusca === "") {
        renderizarEventos(listaCompleta);
        return;
    }

    const eventosFiltrados = listaCompleta.filter(function(evento) {
        return evento.nome.toLowerCase().includes(termoBusca);
    });

    renderizarEventos(eventosFiltrados);
});

function carregarTudo() {
    const listaInicial = JSON.parse(localStorage.getItem("listaEventos")) || [];
    renderizarEventos(listaInicial);
}

carregarTudo();