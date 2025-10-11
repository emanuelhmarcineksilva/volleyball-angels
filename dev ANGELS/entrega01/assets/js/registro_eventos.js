document.getElementById("enviar_evento").addEventListener("click", function(){
    armazenarEvento();
    window.location.href = "eventos.html";
});

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