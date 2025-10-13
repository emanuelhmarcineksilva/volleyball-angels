const containerCadastros = document.getElementById('container-cadastros');
const formBusca = document.getElementById('form_busca');
const inputBusca = document.getElementById('input_busca');

document.getElementById("novo_cadastro").addEventListener("click", function() {
    window.location.href = "cadastro.html";
});

function renderizarCadastros(listaParaRenderizar) {
    containerCadastros.innerHTML = "";

    if (!listaParaRenderizar || listaParaRenderizar.length === 0) {
        containerCadastros.innerHTML = `<p class="col-12 text-center">Nenhum usuário para exibir.</p>`;
        return;
    }

    let html = "";
    for (var i = 0; i < listaParaRenderizar.length; i++) {
        const cadastro = listaParaRenderizar[i];
        const idOriginal = buscarIdOriginalCadastro(cadastro);

        html += `
            <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="card h-100 d-flex flex-column">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-2">
                            <p class="m-0 me-2"><strong>Nome:</strong></p>
                            <a id="nome_${idOriginal}" onclick="mostrarEdicao(${idOriginal}, 'nome')" class="m-0 flex-grow-1 text-body text-end editable-field">${cadastro.nome}</a>
                            <input type="text" id="input_nome_${idOriginal}" class="form-control flex-grow-1" value="${cadastro.nome}" hidden>
                            <a class="btn btn-sm btn-success ms-2" id="ok_nome_${idOriginal}" onclick="editarCadastro(${idOriginal}, 'nome')" hidden>Ok</a>
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <p class="m-0 me-2"><strong>Email:</strong></p>
                            <a id="email_${idOriginal}" onclick="mostrarEdicao(${idOriginal}, 'email')" class="m-0 flex-grow-1 text-body text-end editable-field">${cadastro.email}</a>
                            <input type="email" id="input_email_${idOriginal}" class="form-control flex-grow-1" value="${cadastro.email}" hidden>
                            <a class="btn btn-sm btn-success ms-2" id="ok_email_${idOriginal}" onclick="editarCadastro(${idOriginal}, 'email')" hidden>Ok</a>
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <p class="m-0 me-2"><strong>Senha:</strong></p>
                            <a id="senha_${idOriginal}" onclick="mostrarEdicao(${idOriginal}, 'senha')" class="m-0 flex-grow-1 text-body text-end editable-field">${cadastro.senha}</a>
                            <input type="text" id="input_senha_${idOriginal}" class="form-control flex-grow-1" value="${cadastro.senha}" hidden>
                            <a class="btn btn-sm btn-success ms-2" id="ok_senha_${idOriginal}" onclick="editarCadastro(${idOriginal}, 'senha')" hidden>Ok</a>
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <p class="m-0 me-2"><strong>Sexo:</strong></p>
                            <a id="sexo_${idOriginal}" onclick="mostrarEdicao(${idOriginal}, 'sexo')" class="m-0 flex-grow-1 text-body text-end editable-field">${cadastro.sexo}</a>
                            <select id="input_sexo_${idOriginal}" class="form-select flex-grow-1" hidden>
                                <option value="Masculino" ${cadastro.sexo === 'Masculino' ? 'selected' : ''}>Masculino</option>
                                <option value="Feminino" ${cadastro.sexo === 'Feminino' ? 'selected' : ''}>Feminino</option>
                            </select>
                            <a class="btn btn-sm btn-success ms-2" id="ok_sexo_${idOriginal}" onclick="editarCadastro(${idOriginal}, 'sexo')" hidden>Ok</a>
                        </div>
                        <div class="d-flex align-items-center">
                            <p class="m-0 me-2"><strong>Cargo:</strong></p>
                            <a id="cargo_${idOriginal}" onclick="mostrarEdicao(${idOriginal}, 'cargo')" class="m-0 flex-grow-1 text-body text-end editable-field">${cadastro.cargo}</a>
                            <select id="input_cargo_${idOriginal}" class="form-select flex-grow-1" hidden>
                                <option value="Usuário" ${cadastro.cargo === 'Usuário' ? 'selected' : ''}>Usuário</option>
                                <option value="Membro" ${cadastro.cargo === 'Membro' ? 'selected' : ''}>Membro</option>
                                <option value="Jogador" ${cadastro.cargo === 'Jogador' ? 'selected' : ''}>Jogador</option>
                                <option value="Administrador" ${cadastro.cargo === 'Administrador' ? 'selected' : ''}>Administrador</option>
                            </select>
                            <a class="btn btn-sm btn-success ms-2" id="ok_cargo_${idOriginal}" onclick="editarCadastro(${idOriginal}, 'cargo')" hidden>Ok</a>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent border-top-0 text-center">
                        <a onclick="excluirCadastro(${idOriginal})" class="btn btn-danger m-1">Excluir</a>
                    </div>
                </div>
            </div>
        `;
    }
    containerCadastros.innerHTML = html;
}

function excluirCadastro(id) {
    if (confirm("Tem certeza que deseja excluir este cadastro?")) {
        let listaCadastro = JSON.parse(localStorage.getItem("listaCadastro")) || [];
        listaCadastro.splice(id, 1);
        localStorage.setItem("listaCadastro", JSON.stringify(listaCadastro));
        renderizarCadastros(listaCadastro);
    }
}

function mostrarEdicao(id, campo) {
    document.getElementById(`${campo}_${id}`).hidden = true;
    document.getElementById(`input_${campo}_${id}`).hidden = false;
    document.getElementById(`ok_${campo}_${id}`).hidden = false;
}

function editarCadastro(id, campo) {
    let listaCadastro = JSON.parse(localStorage.getItem("listaCadastro")) || [];
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
                <p>O campo ${campo} não pode ficar vazio!</p>
                <button type="button" class="btn btn-danger btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;
        return;
    }

    input.classList.remove("invalido");
    input.classList.add("valido");
    listaCadastro[id][campo] = novaInfo;
    localStorage.setItem("listaCadastro", JSON.stringify(listaCadastro));
    mensagem.innerHTML = `
        <div class="alert alert-success alert-caixa" role="alert">
            <p>Campo ${campo} editado com sucesso!</p>
            <button type="button" class="btn btn-success btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
    renderizarCadastros(listaCadastro);
}

function buscarIdOriginalCadastro(cadastroFiltrado) {
    let listaCompleta = JSON.parse(localStorage.getItem('listaCadastro')) || [];
    return listaCompleta.findIndex(cadastro => JSON.stringify(cadastro) === JSON.stringify(cadastroFiltrado));
}

formBusca.addEventListener('input', function() {
    const listaCompleta = JSON.parse(localStorage.getItem("listaCadastro")) || [];
    const termoBusca = inputBusca.value.trim().toLowerCase();

    if (termoBusca === "") {
        renderizarCadastros(listaCompleta);
        return;
    }

    const cadastrosFiltrados = listaCompleta.filter(function(cadastro) {
        return cadastro.nome.toLowerCase().includes(termoBusca);
    });

    renderizarCadastros(cadastrosFiltrados);
});

function carregarTudo() {
    const listaInicial = JSON.parse(localStorage.getItem("listaCadastro")) || [];
    renderizarCadastros(listaInicial);
}

carregarTudo();

