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
                            <h3 id="nome_${idOriginal}" class="m-0 flex-grow-1">${evento.nome}</h3>
                            <a class="btn btn-sm btn-primary ms-2" onclick="mostrarEdicao(${idOriginal}, 'nome')">Editar</a>
                            <input type="text" id="input_nome_${idOriginal}" class="form-control ms-2 w-auto" value="${evento.nome}" hidden>
                            <a class="btn btn-sm btn-success ms-2" id="ok_nome_${idOriginal}" onclick="EditarEvento(${idOriginal}, 'nome')" hidden>Ok</a>
                        </div>
                        <div class="d-flex align-items-center mb-1">
                            <p id="data_${idOriginal}" class="m-0 flex-grow-1"><strong>Data:</strong> ${evento.data}</p>
                            <a class="btn btn-sm btn-primary ms-2" onclick="mostrarEdicao(${idOriginal}, 'data')">Editar</a>
                            <input type="date" id="input_data_${idOriginal}" class="form-control ms-2 w-auto" value="${evento.data}" hidden>
                            <a class="btn btn-sm btn-success ms-2" id="ok_data_${idOriginal}" onclick="EditarEvento(${idOriginal}, 'data')" hidden>Ok</a>
                        </div>
                        <div class="d-flex align-items-center mb-1">
                            <p id="horario_${idOriginal}" class="m-0 flex-grow-1"><strong>Horário:</strong> ${evento.horario}</p>
                            <a class="btn btn-sm btn-primary ms-2" onclick="mostrarEdicao(${idOriginal}, 'horario')">Editar</a>
                            <input type="time" id="input_horario_${idOriginal}" class="form-control ms-2 w-auto" value="${evento.horario}" hidden>
                            <a class="btn btn-sm btn-success ms-2" id="ok_horario_${idOriginal}" onclick="EditarEvento(${idOriginal}, 'horario')" hidden>Ok</a>
                        </div>
                        <div class="d-flex align-items-center">
                            <p id="local_${idOriginal}" class="m-0 flex-grow-1"><strong>Local:</strong> ${evento.local}</p>
                            <a class="btn btn-sm btn-primary ms-2" onclick="mostrarEdicao(${idOriginal}, 'local')">Editar</a>
                            <input type="text" id="input_local_${idOriginal}" class="form-control ms-2 w-auto" value="${evento.local}" hidden>
                            <a class="btn btn-sm btn-success ms-2" id="ok_local_${idOriginal}" onclick="EditarEvento(${idOriginal}, 'local')" hidden>Ok</a>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent border-top-0 text-center">
                        <a href="#" onclick="excluirEvento(${idOriginal})" class="btn btn-danger m-1">Excluir</a>
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

function EditarEvento(id, campo) {
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
}  ///isso tb

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