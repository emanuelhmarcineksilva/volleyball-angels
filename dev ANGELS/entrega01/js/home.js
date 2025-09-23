document.addEventListener("DOMContentLoaded", () => {
    if(localStorage.getItem("sessao")) { //se existir a sessao
        var sessao = JSON.parse(localStorage.getItem("sessao")); //pega a sessao e converte para objeto
        console.log(sessao);
        document.getElementById("retorno").innerHTML = sessao.email;
    }else{
        window.location.href = "../index.html"; //redireciona para a pagina index
    }

});