document.getElementById("enviar_produto").addEventListener("click", function(){
    armazenarProduto();
    window.location.href = "shop.html";
});


function armazenarProduto(){
    var listaProdutos = JSON.parse(localStorage.getItem("listaProdutos"));
    if(!listaProdutos){
        var listaProdutos = [];
    }
    var produto = {nome: "", descricao: "", preco: ""};
    produto.nome = document.getElementById("nome_produto").value;
    produto.descricao = document.getElementById("descricao_produto").value;
    produto.preco = document.getElementById("preco_produto").value;
    listaProdutos.push(produto);
    localStorage.setItem("listaProdutos",JSON.stringify(listaProdutos));
}