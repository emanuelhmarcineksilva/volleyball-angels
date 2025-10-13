document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const fromPage = urlParams.get('from');
    const voltarBtn = document.getElementById('btn-voltar');

    if (fromPage === 'gerenciamento') {
        document.body.classList.add('full-layout');
        voltarBtn.href = 'gerenciamento-usuario.html';
    } else {
        voltarBtn.href = 'login.html';
    }
});

const formCadastro = document.getElementById('form-cadastro');
formCadastro.addEventListener('submit', function(e) {
    e.preventDefault(); 
    realizarCadastro();
});

function realizarCadastro() {
    const listaCadastro = JSON.parse(localStorage.getItem("listaCadastro")) || [];
    const nome = document.getElementById('nome-cadastro').value;
    const email = document.getElementById('email-cadastro').value;
    const senha = document.getElementById('senha-cadastro').value;
    const sexoRadio = document.querySelector('input[name="sexo"]:checked');
    const cargo = document.getElementById('seletor-cargo').value;

    if (!nome || !email || !senha || !sexoRadio) {
        alert("Por favor, preencha todos os campos!");
        return;
    }
    const sexo = sexoRadio.value;

    if (listaCadastro.some(user => user.email === email)) {
        alert("Já existe um cadastro com este e-mail!");
    } else {
        listaCadastro.push({ nome, email, senha, sexo, cargo });
        localStorage.setItem('listaCadastro', JSON.stringify(listaCadastro));
        alert("Cadastrado com sucesso!");
        
        const urlParams = new URLSearchParams(window.location.search);
        const fromPage = urlParams.get('from');
        const redirectTo = (fromPage === 'gerenciamento') ? 'gerenciamento-usuario.html' : 'login.html';
        
        setTimeout(() => {
            window.location.href = redirectTo;
        }, 500);
    }
}