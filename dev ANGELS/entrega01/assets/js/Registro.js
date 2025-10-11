document.getElementById("confirm_form").addEventListener("click", function(){
    armazenarForm();
    window.location.href = "../treinoo/Treino.html";
});

function armazenarForm(){
    var listaForm = JSON.parse(localStorage.getItem("listaForm"));
    if(!listaForm){
        var listaForm = [];
    }
    var form = {duracao: "", data: "", hora: "", local: "", tipo: "", nome: ""};

    //gerais

    form.duracao = document.getElementById("campoDuracao").value;
    form.data = document.getElementById("campoData").value;
    form.hora = document.getElementById("campoHora").value;
    form.local = document.getElementById("campoLocal").value;
    form.nome = document.getElementById("campoNome").value;


    //campo especial
    const radioSelecionado = document.querySelector('input[name="flexRadioDefault"]:checked');
    if(radioSelecionado){
        form.tipo = radioSelecionado.value;
    } else {
        form.tipo = "Nenhuma alternativa selecionada";
    }


    listaForm.push(form);
    
    localStorage.setItem("listaForm",JSON.stringify(listaForm));

}