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

        html += `
            <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="card h-100 d-flex flex-column">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-2">
                        
                            <p id="inicio_${idOriginal}" class="m-0 flex-grow-1"><strong>Data/hora de início:</strong> ${jogo.inicio}</p>
                            <a class="btn btn-sm btn-primary ms-2" onclick="mostrarEdicao(${idOriginal}, 'inicio')">Editar</a>
                            <input type="datetime-local" id="input_inicio_${idOriginal}" class="form-control ms-2 w-auto" value="${jogo.inicio}" hidden>
                            <a class="btn btn-sm btn-success ms-2" id="ok_inicio_${idOriginal}" onclick="editarJogo(${idOriginal}, 'inicio')" hidden>Ok</a>
                        </div>
                        <div class="d-flex align-items-center mb-1">
                            <p id="fim_${idOriginal}" class="m-0 flex-grow-1"><strong>Data/hora final:</strong> ${jogo.fim}</p>
                            <a class="btn btn-sm btn-primary ms-2" onclick="mostrarEdicao(${idOriginal}, 'fim')">Editar</a>
                            <input type="datetime-local" id="input_fim_${idOriginal}" class="form-control ms-2 w-auto" value="${jogo.fim}" hidden>
                            <a class="btn btn-sm btn-success ms-2" id="ok_fim_${idOriginal}" onclick="editarJogo(${idOriginal}, 'fim')" hidden>Ok</a>
                        </div>
                        <div class="d-flex align-items-center mb-1">
                            <p id="adversario_${idOriginal}" class="m-0 flex-grow-1"><strong>Time adversário:</strong> ${jogo.adversario}</p>
                            <a class="btn btn-sm btn-primary ms-2" onclick="mostrarEdicao(${idOriginal}, 'adversario')">Editar</a>
                            <input type="text" id="input_adversario_${idOriginal}" class="form-control ms-2 w-auto" value="${jogo.adversario}" hidden>
                            <a class="btn btn-sm btn-success ms-2" id="ok_adersario_${idOriginal}" onclick="editarJogo(${idOriginal}, 'adversario')" hidden>Ok</a>
                        </div>
                        <div class="d-flex align-items-center">
                            <p id="tipo_${idOriginal}" class="m-0 flex-grow-1"><strong>Tipo de jogo:</strong> ${jogo.tipo}</p>
                            <a class="btn btn-sm btn-primary ms-2" onclick="mostrarEdicao(${idOriginal}, 'tipo')">Editar</a>
                            <input type="form-select" id="input_tipo_${idOriginal}" class="form-control ms-2 w-auto" value="${jogo.tipo}" hidden>
                            <a class="btn btn-sm btn-success ms-2" id="ok_tipo_${idOriginal}" onclick="editarJogo(${idOriginal}, 'tipo')" hidden>Ok</a>
                        </div>
                        <div class="d-flex align-items-center mb-1">
                            <p id="pontClube_${idOriginal}" class="m-0 flex-grow-1"><strong>Pontuação do clube:</strong> ${jogo.pontClube}</p>
                            <a class="btn btn-sm btn-primary ms-2" onclick="mostrarEdicao(${idOriginal}, 'pontClube')">Editar</a>
                            <input type="number" id="input_pontClube_${idOriginal}" class="form-control ms-2 w-auto" value="${jogo.pontClube}" hidden>
                            <a class="btn btn-sm btn-success ms-2" id="ok_ponClube_${idOriginal}" onclick="editarJogo(${idOriginal}, 'pontClube')" hidden>Ok</a>
                        </div>
                        <div class="d-flex align-items-center mb-1">
                            <p id="pontAdvers_${idOriginal}" class="m-0 flex-grow-1"><strong>Pontuação do time adversário:</strong> ${jogo.pontAdvers}</p>
                            <a class="btn btn-sm btn-primary ms-2" onclick="mostrarEdicao(${idOriginal}, 'pontAdvers')">Editar</a>
                            <input type="number" id="input_pontAdvers_${idOriginal}" class="form-control ms-2 w-auto" value="${jogo.pontAdvers}" hidden>
                            <a class="btn btn-sm btn-success ms-2" id="ok_ponAdvers_${idOriginal}" onclick="editarJogo(${idOriginal}, 'pontAdvers')" hidden>Ok</a>
                        </div>
                        <div class="d-flex align-items-center mb-1">
                            <p id="observacoes_${idOriginal}" class="m-0 flex-grow-1"><strong>Observações:</strong> ${jogo.observacoes}</p>
                            <a class="btn btn-sm btn-primary ms-2" onclick="mostrarEdicao(${idOriginal}, 'observacoes')">Editar</a>
                            <input type="text" id="input_observacoes_${idOriginal}" class="form-control ms-2 w-auto" value="${jogo.observacoes}" hidden>
                            <a class="btn btn-sm btn-success ms-2" id="ok_observacoes_${idOriginal}" onclick="editarJogo(${idOriginal}, 'observacoes')" hidden>Ok</a>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent border-top-0 text-center">
                        <a href="#" onclick="excluirJogo(${idOriginal})" class="btn btn-danger m-1">Excluir</a>
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
    document.getElementById(`input_${campo}_${i}`).hidden = false;
    document.getElementById(`ok_${campo}_${i}`).hidden = false;
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
        return jogo.nome.toLowerCase().includes(termoBusca);
    });

    renderizarJogos(jogosFiltrados);
});


function carregarTudo() {
    const listaInicial = JSON.parse(localStorage.getItem("listaJogos")) || [];
    renderizarJogos(listaInicial);
}

carregarTudo();