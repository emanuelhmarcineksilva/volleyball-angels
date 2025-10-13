// cadastro.js

// Pega o formulário pelo ID que vamos adicionar no HTML
const formCadastro = document.getElementById('form-cadastro');

formCadastro.addEventListener('submit', function(e) {
    // Impede que o formulário recarregue a página
    e.preventDefault(); 
    
    realizarCadastro();
});

function realizarCadastro() {
    // Carrega a lista de forma segura, criando uma lista vazia se não existir
    const listaCadastro = JSON.parse(localStorage.getItem("listaCadastro")) || [];

    // Captura dos valores dos campos
    const nome = document.getElementById('nome-cadastro').value;
    const email = document.getElementById('email-cadastro').value;
    const senha = document.getElementById('senha-cadastro').value;
    const sexoRadio = document.querySelector('input[name="sexo"]:checked');
    const cargo = document.getElementById('seletor-cargo').value;

    // Validação para garantir que todos os campos foram preenchidos
    if (!nome || !email || !senha || !sexoRadio) {
        alert("Por favor, preencha todos os campos!");
        return; // Interrompe a função se algum campo estiver vazio
    }
    const sexo = sexoRadio.value;

    // A função de inserir dados agora faz parte do fluxo principal
    let emailJaExiste = false;
    for(let i=0; i < listaCadastro.length; i++) {
        if(listaCadastro[i].email === email) {
            emailJaExiste = true;
            break;
        } 
    }

    if (emailJaExiste) {
        alert("Já existe um cadastro com este e-mail!");
    } else {
        listaCadastro.push({
            nome: nome,
            email: email,
            senha: senha,
            sexo: sexo,
            cargo: cargo
        });
        
        localStorage.setItem('listaCadastro', JSON.stringify(listaCadastro));
        
        alert("Cadastrado com sucesso! Você será redirecionado para o login.");
        
        // **A CORREÇÃO PRINCIPAL:** Redireciona para a página de login após 1 segundo
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }
}