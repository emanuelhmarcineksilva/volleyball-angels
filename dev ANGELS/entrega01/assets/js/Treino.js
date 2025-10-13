const containerTreinos = document.getElementById("list_Forms");
const formBusca = document.getElementById('form_busca');
const inputBusca = document.getElementById('input_busca');


document.getElementById("nv_treino").addEventListener("click", function(){
    window.location.href = "registro_treino.html";
});

function renderizarTreinos (listaParaRenderizar){
    containerTreinos.innerHTML = "";
    
    
    //.length = Qntd de itens dentro de um array
    if(!listaParaRenderizar || listaParaRenderizar.length === 0) { 
        containerTreinos.innerHTML = `<p class="col-12 text-center">Nenhum evento para exibir.</p>`;
        return;
    }

    let html = "";
    for (var i = 0; i < listaParaRenderizar.length ; i++){
        const treino = listaParaRenderizar[i];
        const idOriginal = buscarIdOriginal(treino);

        html +=`
            <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="card h-100 d-flex flex-column">
                    <div class="card-body">
                        <div class="Form-Field">
                            <p id="display_duracao_${idOriginal}" class="m-0 flex-grow-1"><strong>Duração do treino:</strong>${form.duracao}</p>
                            <a class="btn btn-sm btn-primary ms-2" onclick="mostrarEdicao(${idOriginal}, 'duracao')">Editar</a>
                            <input type="text" id="input_nome_${idOriginal}" class="form-control ms-2 w-auto" value="${form.duracao}" hidden>
                            <a class="btn btn-sm btn-success ms-2" id="ok_nome_${idOriginal}" onclick="EditarTreino(${idOriginal}, 'duracao')" hidden>Ok</a>
                        </div>

                        <div class="Form-Field">
                            <p id="display_data_${idOriginal}" class="m-0 flex-grow-1"><strong>Data do treino:</strong>${form.data}</p>
                            <a class="btn btn-sm btn-primary ms-2" onclick="mostrarEdicao(${idOriginal}, 'data')">Editar</a>
                            <input type="text" id="input_nome_${idOriginal}" class="form-control ms-2 w-auto" value="${form.data}" hidden>
                            <a class="btn btn-sm btn-success ms-2" id="ok_nome_${idOriginal}" onclick="EditarTreino(${idOriginal}, 'data')" hidden>Ok</a>

                        </div>

                        <div class="Form-Field">
                            <p id="display_hora_${idOriginal}" class="m-0 flex-grow-1"><strong>Hora de inicio:</strong>${form.hora}</p>
                            <a class="btn btn-sm btn-primary ms-2" onclick="mostrarEdicao(${idOriginal}, 'hora')">Editar</a>
                            <input type="text" id="input_nome_${idOriginal}" class="form-control ms-2 w-auto" value="${form.hora}" hidden>
                            <a class="btn btn-sm btn-success ms-2" id="ok_nome_${idOriginal}" onclick="EditarTreino(${idOriginal}, 'hora')" hidden>Ok</a>
                        </div>

                        <div class="form-field">

                            <p id="display_local_${idOriginal}" class="m-0 flex-grow-1"><strong>Local do treino:</strong>${form.local}</p>
                            <a class="btn btn-sm btn-primary ms-2" onclick="mostrarEdicao(${idOriginal}, 'local')">Editar</a>
                            <input type="text" id="input_nome_${idOriginal}" class="form-control ms-2 w-auto" value="${form.local}" hidden>
                            <a class="btn btn-sm btn-success ms-2" id="ok_nome_${idOriginal}" onclick="EditarTreino(${idOriginal}, 'local')" hidden>Ok</a>
                        </div>

                        <div class="form-field">
                            <p id="display_tipo_${idOriginal}"><strong>tipo::</strong> ${form.tipo}</p>
                            <button onclick="mostrarEdicaoForms(${idOriginal}, 'tipo')">Editar</button>
                            <div id="input_tipo_${idOriginal}" hidden>
                                <input type="radio" name="edit-radio-${idOriginal}" value="Aerobico" ${form.tipo === 'aerobico' ? 'checked' : ''}> Aeróbico
                                <input type="radio" name="edit-radio-${idOriginal}" value="Forca" ${form.tipo === 'Forca' ? 'checked' : ''}> Força
                                <input type="radio" name="edit-radio-${idOriginal}" value="Funcional" ${form.tipo === 'Funcional' ? 'checked' : ''}> Funcional
                                <input type="radio" name="edit-radio-${idOriginal}" value="HIIT" ${form.tipo === 'HIIT' ? 'checked' : ''}> HIIT
                                <input type="radio" name="edit-radio-${idOriginal}" value="Resistencia" ${form.tipo === 'Resistencia' ? 'checked' : ''}> Resistência
                                <input type="radio" name="edit-radio-${idOriginal}" value="Jogo" ${form.tipo === 'Jogo' ? 'checked' : ''}> Jogo
                            </div>
                            <button id="ok_tipo_${idOriginal}" onclick="EditarForm(${idOriginal}, 'tipo')" hidden>Ok</button>
                        </div>

                        <div class="form-field">
                            <p id="display_nome_${idOriginal}"><strong>Nome do ADM:</strong> ${form.nome}</p>
                            <button onclick="mostrarEdicaoForms(${idOriginal}, 'nome')">Editar</button>
                            <input type="text" id="input_nome_${idOriginal}" value="${form.nome}" hidden>
                            <button id="ok_nome_${idOriginal}" onclick="EditarForm(${idOriginal}, 'nome')" hidden>Ok</button>
                        </div>

                        <div class="card-footer bg-transparent border-top-0 text-center">
                            <a href="#" onclick="excluirTreino(${idOriginal})" class="btn btn-danger m-1">Excluir</a>
                        </div>
                        
                    </div>
                </div>
            </div>
        `;       
    };
    containerTreinos.innerHTML = html;
}

function excluirTreino(id) {
    if (confirm("Tem certeza que deseja excluir este evento?")) {
        let listaTreinos = JSON.parse(localStorage.getItem("listaTreinos")) || [];
        listaTreinos.splice(id, 1);
        localStorage.setItem("listaTreinos", JSON.stringify(listaTreinos));
        renderizarTreinos(listaTreinos);
    }
}

function mostrarEdicaoForms(id, campo) {
    document.getElementById(`display_${campo}_${id}`).hidden = true;
    document.getElementById(`input_${campo}_${id}`).hidden = false;
    document.getElementById(`ok_${campo}_${id}`).hidden = false;
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

    const treinoFiltrado = listaCompleta.filter(function(treino) {
        return treino.nome.toLowerCase().includes(termoBusca);
    });

    renderizarTreinos(treinoFiltrado);
});

function carregarTudo() {
    const listaInicial = JSON.parse(localStorage.getItem("listaTreinos")) || [];
    renderizarTreinos(listaInicial);
}

carregarTudo();