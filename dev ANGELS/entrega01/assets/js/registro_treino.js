const duracao_treino = document.getElementById('duracao_treino');
const data_treino = document.getElementById('data_treino');
const hora_treino = document.getElementById('hora_treino');
const local_treino = document.getElementById('local_treino');
const nome_adm = document.getElementById('nome_adm');
const btn_enviar = document.getElementById('enviar_treino');
const form = document.getElementById('form_treino');
const mensagem = document.getElementById('mensagem');
const regex = /^(?!\s*$).+/;

document.getElementById("enviar_treino").addEventListener("click", function(){
    armazenarTreino();
    window.location.href = "Treino.html";
});

function armazenarTreino(){
    var listaTreinos = JSON.parse(localStorage.getItem("listaTreinos"));
    if(!listaTreinos){
        var listaTreinos = [];
    }
    var form = {duracao: "", data: "", hora: "", local: "", tipo: "", nome: ""};

    //gerais

    treino.duracao = document.getElementById("duracao_treino").value;
    treino.data = document.getElementById("data_treino").value;
    treino.hora = document.getElementById("hora_treino").value;
    treino.local = document.getElementById("local_treino").value;
    treino.nome = document.getElementById("nome_adm").value;
    

    //campo especial
    const radioSelecionado = document.querySelector('input[name="flexRadioDefault"]:checked');
    if(radioSelecionado){
        treino.tipo = radioSelecionado.value;
    } else {
        treino.tipo = "Nenhuma alternativa selecionada";
    }

    listaTreinos.push(treino);
    localStorage.setItem("listaTreinos",JSON.stringify(listaTreinos));

}


btn_enviar.addEventListener("click", function(e){ 
    e.preventDefault();
    const duracao = regex.test(duracao_treino.value); 
    const data = data_treino.value.trim() !== ""; 
    const horario = hora_treino.value.trim() !== "";
    const local = regex.test(local_treino.value); 
    const nome = regex.test(nome_adm.value); 
    const tipo = regex.test(radioSelecionado.value); 


    mensagem.innerHTML = "";
    if(!duracao || !data || !horario || !local || !nome ||!tipo ){
        mensagem.innerHTML = 
            `<div class="alert alert-danger alert-caixa" role="alert">
                <p>Você não preencheu todos os campos devidamente!</p>
                <button type="button" class="btn btn-danger btn-close" data-bs-dismiss="alert" aria-label="Close"></button> 
            </div>`;
        [duracao_treino, data_treino, hora_treino, local_treino,nome_adm, tipo].forEach(input => { 
            if(input.value.trim() === "" || !regex.test(input.value)){ 
                input.classList.add("invalido"); 
                input.classList.remove("valido"); 
            } else {
                input.classList.add("valido"); 
                input.classList.remove("invalido"); 
            } 
        }); 
        return;
    } 
    armazenarTreino();
    setTimeout(() => {window.location.href = "../js/treino.html";});
}); 