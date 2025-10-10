const containerLogins = document.getElementById('container-cadastros');

function renderizarCadastros(listaParaRenderizar) {
    containerLogins.innerHTML = "";

    if (!listaParaRenderizar || listaParaRenderizar.length === 0) {
        containerLogins.innerHTML = "<p>Não há cadastros aqui.</p>"
        return; // este return esta aqui para evitar que o resto do código rode
    }

    let html = "";
    for (var i = 0; i < listaParaRenderizar.length; i++) {

        const cadastro = listaParaRenderizar[i];
        const idOriginalCadastro = buscarIdOriginalCadastro(cadastro);

        console.log(listaParaRenderizar[i])


        html += `
                <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="card h-100 d-flex flex-column">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-2">
                            <h3 id="nome_${idOriginalCadastro}" class="m-0 flex-grow-1">${cadastro.nome}</h3>
                            <a class="btn btn-sm btn-primary ms-2" onclick="mostrarEdicao(${idOriginalCadastro}, 'nome')">Editar</a>
                            <input type="text" id="input_nome_${idOriginalCadastro}" class="form-control ms-2 w-auto" value="${cadastro.nome}" hidden>
                            <a class="btn btn-sm btn-success ms-2" id="ok_nome_${idOriginalCadastro}" onclick="editarCadastro(${idOriginalCadastro}, 'nome')" hidden>Ok</a>
                        </div>
                        <div class="d-flex align-items-center mb-1">
                            <p id="email_${idOriginalCadastro}" class="m-0 flex-grow-1"><strong>Email:</strong> ${cadastro.email}</p>
                            <a class="btn btn-sm btn-primary ms-2" onclick="mostrarEdicao(${idOriginalCadastro}, 'email')">Editar</a>
                            <input type="email" id="input_email_${idOriginalCadastro}" class="form-control ms-2 w-auto" value="${cadastro.email}" hidden>
                            <a class="btn btn-sm btn-success ms-2" id="ok_email_${idOriginalCadastro}" onclick="editarCadastro(${idOriginalCadastro}, 'email')" hidden>Ok</a>
                        </div>
                        <div class="d-flex align-items-center mb-1">
                            <p id="senha_${idOriginalCadastro}" class="m-0 flex-grow-1"><strong>Senha:</strong> ${cadastro.senha}</p>
                            <a class="btn btn-sm btn-primary ms-2" onclick="mostrarEdicao(${idOriginalCadastro}, 'senha')">Editar</a>
                            <input type="text" id="input_senha_${idOriginalCadastro}" class="form-control ms-2 w-auto" value="${cadastro.senha}" hidden>
                            <a class="btn btn-sm btn-success ms-2" id="ok_senha_${idOriginalCadastro}" onclick="editarCadastro(${idOriginalCadastro}, 'senha')" hidden>Ok</a>
                        </div>
                        <div class="d-flex align-items-center">
                            <p id="sexo_${idOriginalCadastro}" class="m-0 flex-grow-1"><strong>Sexo:</strong> ${cadastro.sexo}</p>
                            <a class="btn btn-sm btn-primary ms-2" onclick="mostrarEdicao(${idOriginalCadastro}, 'sexo')">Editar</a>
                            <div class="form-radio form-control ms-2 w-auto" id="input_sexo_${idOriginalCadastro}" hidden>
                                    <input class="form-radio-input" type="radio" name="sexo" id="input_sexo_${idOriginalCadastro}" value="Masculino">
                                    <label for="radio-masculino">Masculino</label>
                                    <input class="form-radio-input" type="radio" name="sexo" id="input_sexo_${idOriginalCadastro}" value="Feminino">
                                    <label for="radio-feminino">Feminino</label>
                                </div>
                            <a class="btn btn-sm btn-success ms-2" id="ok_sexo_${idOriginalCadastro}" onclick="editarCadastro(${idOriginalCadastro}, 'sexo')" hidden>Ok</a>
                        </div>
                        <div class="d-flex align-items-center">
                            <p id="cargo_${idOriginalCadastro}" class="m-0 flex-grow-1"><strong>Cargo:</strong> ${cadastro.cargo}</p>
                            <a class="btn btn-sm btn-primary ms-2" onclick="mostrarEdicao(${idOriginalCadastro}, 'cargo')">Editar</a>
                                <select id="input_cargo_${idOriginalCadastro}" class="form-control ms-2 w-auto form-select" hidden>
                                    <option selected>Usuário</option>
                                    <option>Membro</option>
                                    <option>Jogador</option>
                                    <option>Administrador</option>
                                </select>
                            <a class="btn btn-sm btn-success ms-2" id="ok_cargo_${idOriginalCadastro}" onclick="editarCadastro(${idOriginalCadastro}, 'cargo')" hidden>Ok</a>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent border-top-0 text-center">
                        <a href="#" onclick="excluirCadastro(${idOriginalCadastro})" class="btn btn-danger m-1">Excluir</a>
                    </div>
                </div>
            </div>`;
    }
    containerLogins.innerHTML = html;
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
    document.getElementById(`input_${campo}_${id}`).hidden = false;
    document.getElementById(`ok_${campo}_${id}`).hidden = false;
}

function editarCadastro(id, campo) {
    var listaCadastro = JSON.parse(localStorage.getItem("listaCadastro"));

    if (campo === 'sexo') {
        var editSexo = document.querySelector(`input[name="sexo"]:checked`).value;
        listaCadastro[id].sexo = editSexo;
        localStorage.setItem("listaCadastro", JSON.stringify(listaCadastro));
        renderizarCadastros(listaCadastro);
    } else {
        var novaInfo = document.getElementById(`input_${campo}_${id}`).value;
        listaCadastro[id][campo] = novaInfo;
        localStorage.setItem("listaCadastro", JSON.stringify(listaCadastro));
        renderizarCadastros(listaCadastro);
    }

}

function buscarIdOriginalCadastro(cadastroFiltrado) {
    let listaCompleta = JSON.parse(localStorage.getItem('listaCadastro')) || [];
    return listaCompleta.findIndex(cadastro => JSON.stringify(cadastro) === JSON.stringify(cadastroFiltrado)); // findIndex é uma função que retorna o índice do primeiro elemento que satisfaz a condição fornecida na função de callback
}


function carregarTudo() {
    const listaInicialDeCasdastros = JSON.parse(localStorage.getItem("listaCadastro")) || [];
    renderizarCadastros(listaInicialDeCasdastros);
}


carregarTudo();


