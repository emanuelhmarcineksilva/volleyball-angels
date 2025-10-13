const inicio_jogo = document.getElementById('inicio_jogo');
const fim_jogo = document.getElementById('fim_jogo');
const adversario_jogo = document.getElementById('adversario_jogo');
const tipo_jogo = document.getElementById('tipo_jogo');
const pontclube_jogo = document.getElementById('pontclube_jogo');
const pontadvers_jogo = document.getElementById('pontadvers_jogo');
const observ_jogo = document.getElementById('observ_jogo');
const btn_enviar = document.getElementById('enviar_jogo');
const form = document.getElementById('form_jogos');
const mensagem = document.getElementById('mensagem');
const regex = /^(?!\s*$).+/;


document.getElementById('enviar_jogo').addEventListener('click', function(){
    armazenarJogo();
    window.location.href = 'jogos.html';
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


btn_enviar.addEventListener("click", function(e){ 
    e.preventDefault();
    const inicio = inicio_jogo.value.trim() !== "";
    const fim = fim_jogo.value.trim() !== "";
    const adversario = regex.test(adversario_jogo.value); 
    const tipo = regex.test(tipo_jogo.value); 
    const pontClube = regex.test(pontclube_jogo.value); 
    const pontAdvers = regex.test(pontadvers_jogo.value); 
    const obs = regex.test(observ_jogo.value); 
    
    
    mensagem.innerHTML = "";
    if(!inicio || !fim || !adversario || !tipo|| !pontClube || !pontAdvers || !obs){
        mensagem.innerHTML = 
            `<div class="alert alert-danger alert-caixa" role="alert">
                <p>Você não preencheu todos os campos devidamente!</p>
                <button type="button" class="btn btn-danger btn-close" data-bs-dismiss="alert" aria-label="Close"></button> 
            </div>`;
        [inicio_jogo,fim_jogo,adversario_jogo,tipo_jogo,pontClube,pontAdvers,obs].forEach(input => { 
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
    armazenarJogo();
    setTimeout(() => {window.location.href = "jogos.html";});
}); 