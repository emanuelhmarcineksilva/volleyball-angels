const nome_produto = document.getElementById('nome_produto');
const descricao_produto = document.getElementById('descricao_produto');
const preco_produto = document.getElementById('preco_produto');
const btn_enviar = document.getElementById('enviar_produto');
const form = document.getElementById('form_produto');
const mensagem = document.getElementById('mensagem');
const regex = /^(?!\s*$).+/;

function armazenarProduto() {
    var listaProdutos = JSON.parse(localStorage.getItem("listaProdutos"));
    if (!listaProdutos) {
        var listaProdutos = [];
    }
    var produto = { nome: "", descricao: "", preco: "" };
    produto.nome = document.getElementById("nome_produto").value;
    produto.descricao = document.getElementById("descricao_produto").value;
    produto.preco = document.getElementById("preco_produto").value;
    
    listaProdutos.push(produto);
    localStorage.setItem("listaProdutos", JSON.stringify(listaProdutos));
}

btn_enviar.addEventListener("click", function(e) {
    e.preventDefault();
    const nome = regex.test(nome_produto.value);
    const descricao = regex.test(descricao_produto.value);
    const preco = regex.test(preco_produto.value); 

    mensagem.innerHTML = "";
    if (!nome || !descricao || !preco) {
        mensagem.innerHTML =
            `<div class="alert alert-danger alert-caixa" role="alert">
                <p>Você não preencheu todos os campos devidamente!</p>
                <button type="button" class="btn btn-danger btn-close" data-bs-dismiss="alert" aria-label="Close"></button> 
            </div>`;
        [nome_produto, descricao_produto, preco_produto].forEach(input => {
        
            if (input.value.trim() === "" || !regex.test(input.value)) {
                input.classList.add("invalido");
                input.classList.remove("valido");
            } else {
                input.classList.add("valido");
                input.classList.remove("invalido");
            }
        });
        return;
    }
    armazenarProduto();
    setTimeout(() => { window.location.href = "produtos.html"; }); 
});

/* INPUTS

=== radio ===
linha 14 acrescentar --> radio: ""
após jogo.observacoes

    const radioSelecionado = document.querySelector('input[name="radio"]:checked');
    if(radioSelecionado){
        jogo.radio = radioSelecionado.value;
    } else {
        jogo.radio = "Nenhuma alternativa selecionada";
    }


=== checkbox ===
var jogo acrescentar --> checkboxes: ""
após jogo.observacoes acrescentar:
    const campos_selecionados = [];
    const todos_os_campos = document.querySelectorAll('input[name="opcoes"]');
    todos_os_campos.forEach(function(checkbox){
        if(checkbox.checked){
            campos_selecionados.push(checkbox.value);
        }
    });
    jogo.checkboxes = campos_selecionados;


=== text, date, datetime-local, date, time ===
var jogo acrescentar --> nomeDoInput: ""

após jogo.observacoes acrescentar:
jogo.nomeDoInput = document.getElementById('Id_do_input').value;

*/