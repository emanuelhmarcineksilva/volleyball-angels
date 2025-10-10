document.getElementById('enviar_jogo').addEventListener('click', function(){
    armazenarJogo();
    window.location.href = 'registro_jogos.html';
});

function armazenarJogo(){
    var listaJogos = JSON.parse(localStorage.getItem('listaJogos'));
    if (!listaJogos) {
        var listaJogos = [];
    }
    var jogo = {inicio: "", fim: "", duracao: "", adversario: "", tipo: "", pontClube: "", pontAdvers: "", observacoes: ""};
    jogo.inicio = document.getElementById('inicio_jogo').value;
    jogo.fim = document.getElementById('fim_jogo').value;
    
    var inicio = new Date(jogo.inicio);
    var fim = new Date(jogo.fim);
    var duracao = (fim - inicio) / 1000; // Duracao em segundos

    
}