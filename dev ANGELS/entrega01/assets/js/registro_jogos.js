document.getElementById('enviar_jogo').addEventListener('click', function(){
    armazenarJogo();
    window.location.href = 'registro_jogos.html';
});

function armazenarJogo(){
    var listaJogos = JSON.parse(localStorage.getItem('listaJogos'));
    if (!listaJogos) {
        var listaJogos = [];
    }
    var jogo = {inicio: "", fim: "", adversario: "", tipo: "", pontClube: "", pontAdvers: "", observacoes: ""};
    jogo.inicio = document.getElementById('inicio_jogo').value;
    jogo.fim = document.getElementById('fim_jogo').value;
    jogo.adversario = document.getElementById('adversario_jogo').value;
    jogo.tipo = document.getElementById('tipo_jogo').value;
    jogo.pontClube = document.getElementById('pontclube_jogo').value;
    jogo.pontAdvers = document.getElementById('pontadvers_jogo').value;
    jogo.observacoes = document.getElementById('observ_jogo').value;
    listaJogos.push(jogo);
    localStorage.setItem("listaJogos",JSON.stringify(listaJogos));
}