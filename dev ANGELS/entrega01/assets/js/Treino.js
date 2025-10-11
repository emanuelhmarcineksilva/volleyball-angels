document.getElementById("nv_treino").addEventListener("click", function(){
    window.location.href = "../registro_treino/Registro.html";
});

function carregarForms (){
    const listaForm = JSON.parse(localStorage.getItem("listaForm")) || []; //
    const container = document.getElementById("list_Forms"); 
    
    
    //.length = Qntd de itens dentro de um array
    if(listaForm.length === 0){ //Se "List_Forms" não tiver nenhum elemento:
        container.innerHTML = "<p>Aqui não tem nada, agende um novo treino</p>" //"printa" mensag
        return;
    }

    let html = "";
    for (let i = 0; i < listaForm.length ; i++){
        const form = listaForm[i];

        html +=`
            <div class="form-card">
                <h2>Formulário ${i+1}</h2>
                <hr>
                
                

                <div class="Form-Field">
                    <p id="display_duracao_${i}" ><strong>Duração do jogo:</strong>${form.duracao}</p>
                    <button onclick="mostrarEdicaoForms(${i},'duracao')">Editar</button>
                    <input type="time" id="input_duracao_${i}" value="${form.duracao}" hidden> 
                    <button id="ok_duracao_${i}" onclick="editarForm(${i}, 'duracao')" hidden >Ok</button>
                </div>

                <div class="Form-Field">
                    <p id="display_data_${i}"><strong>Data do Jogo: </strong>${form.data}</p>
                    <button onclick="mostrarEdicaoForms(${i}, 'data')">Editar</button>
                    <input type="date" id="input_data_${i}" value ="${form.data}" hidden>
                    <button id="ok_data_${i}" onclick="editarForm(${i}, 'data')"hidden>Ok</button>
                </div>

                <div class="Form-Field">
                    <p id="display_hora_${i}" ><strong>Hora de inicio:</strong>${form.hora}</p>
                    <button onclick="mostrarEdicaoForms(${i},'hora')">Editar</button>
                    <input type="time" id="input_hora_${i}" value="${form.hora}" hidden> 
                    <button id="ok_hora_${i}" onclick="editarForm(${i}, 'hora')" hidden >Ok</button>
                </div>

                <div class="form-field">
                    <p id="display_local_${i}"><strong>Local:</strong> ${form.local}</p>
                    <button onclick="mostrarEdicaoForms(${i}, 'local')">Editar</button>
                    <input type="text" id="input_local_${i}" value="${form.local}" hidden>
                    <button id="ok_local_${i}" onclick="editarForm(${i}, 'local')" hidden>Ok</button>
                </div>

                <div class="form-field">
                    <p id="display_tipo_${i}"><strong>tipo::</strong> ${form.tipo}</p>
                    <button onclick="mostrarEdicaoForms(${i}, 'tipo')">Editar</button>
                    <div id="input_tipo_${i}" hidden>
                        <input type="radio" name="edit-radio-${i}" value="Aerobico" ${form.tipo === 'aerobico' ? 'checked' : ''}> Aeróbico
                        <input type="radio" name="edit-radio-${i}" value="Forca" ${form.tipo === 'Forca' ? 'checked' : ''}> Força
                        <input type="radio" name="edit-radio-${i}" value="Funcional" ${form.tipo === 'Funcional' ? 'checked' : ''}> Funcional
                        <input type="radio" name="edit-radio-${i}" value="HIIT" ${form.tipo === 'HIIT' ? 'checked' : ''}> HIIT
                        <input type="radio" name="edit-radio-${i}" value="Resistencia" ${form.tipo === 'Resistencia' ? 'checked' : ''}> Resistência
                        <input type="radio" name="edit-radio-${i}" value="Jogo" ${form.tipo === 'Jogo' ? 'checked' : ''}> Jogo
                    </div>
                    <button id="ok_tipo_${i}" onclick="editarForm(${i}, 'tipo')" hidden>Ok</button>
                </div>

                <div class="form-field">
                    <p id="display_nome_${i}"><strong>Nome do ADM:</strong> ${form.nome}</p>
                    <button onclick="mostrarEdicaoForms(${i}, 'nome')">Editar</button>
                    <input type="text" id="input_nome_${i}" value="${form.nome}" hidden>
                    <button id="ok_nome_${i}" onclick="editarForm(${i}, 'nome')" hidden>Ok</button>
                </div>

                <hr>
                <div class="form-botoes">
                    <button onclick="excluirForm(${i})">Excluir Formulário Inteiro</button>
                </div>

        </div>`;       
    };
    document.getElementById("list_Forms").innerHTML = html;
}

function excluirForm(id) {
    const listaForm = JSON.parse(localStorage.getItem("listaForm")) || [];
    listaForm.splice(id, 1);
    localStorage.setItem("listaForm", JSON.stringify(listaForm));
    carregarForms();
}

function mostrarEdicaoForms(id, campo) {
    document.getElementById(`display_${campo}_${id}`).hidden = true;
    document.getElementById(`input_${campo}_${id}`).hidden = false;
    document.getElementById(`ok_${campo}_${id}`).hidden = false;
}


function editarForm(id, campo) {
    const listaForm = JSON.parse(localStorage.getItem("listaForm")) || [];
    let nvInfo;

    switch (campo) {
        case 'tipo': //rad
            const radioSelecionado = document.querySelector(`input[name="edit-radio-${id}"]:checked`);
            nvInfo = radioSelecionado ? radioSelecionado.value : "Nenhuma";
            break;

        default: //gerais
            nvInfo = document.getElementById(`input_${campo}_${id}`).value;
            break;
    }

    listaForm[id][campo] = nvInfo;

    localStorage.setItem("listaForm", JSON.stringify(listaForm));

    carregarForms();
}

//está chamando a func.
carregarForms();