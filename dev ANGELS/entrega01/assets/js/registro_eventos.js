const nome_evento = document.getElementById('nome_evento');
const data_evento = document.getElementById('data_evento');
const horario_evento = document.getElementById('horario_evento');
const local_evento = document.getElementById('local');
const btn_enviar = document.getElementById('enviar_evento'); 
const form = document.getElementById('form_evento');
const mensagem = document.getElementById('mensagem');
const regex = /^(?!\s*$).+/;

function armazenarEvento(){
    var listaEventos = JSON.parse(localStorage.getItem("listaEventos"));
    if(!listaEventos){
        var listaEventos = [];
    }
    var evento = {nome: "", data: "", horario: "", local: ""};
    evento.nome = document.getElementById("nome_evento").value;
    evento.data = document.getElementById("data_evento").value;
    evento.horario = document.getElementById("horario_evento").value;
    evento.local = document.getElementById("local").value;
    listaEventos.push(evento);
    localStorage.setItem("listaEventos",JSON.stringify(listaEventos));
}

btn_enviar.addEventListener("click", function(e){ 
    e.preventDefault();
    const nome = regex.test(nome_evento.value); 
    const local = regex.test(local_evento.value); 
    const data = data_evento.value.trim() !== ""; 
    const horario = horario_evento.value.trim() !== "";
    mensagem.innerHTML = "";
    if(!nome || !local || !data || !horario){
        mensagem.innerHTML = 
            `<div class="alert alert-danger alert-caixa" role="alert">
                <p>Você não preencheu todos os campos devidamente!</p>
                <button type="button" class="btn btn-danger btn-close" data-bs-dismiss="alert" aria-label="Close"></button> 
            </div>`;
        [nome_evento, local_evento, data_evento, horario_evento].forEach(input => { 
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
    armazenarEvento();
    setTimeout(() => {window.location.href = "eventos.html";});
}); 
/// registros produtos, jogos e treino   btn