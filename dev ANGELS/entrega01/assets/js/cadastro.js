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

    const campos_selecionados = [];
    const todos_os_campos = document.querySelectorAll('input[name="checkboxes"]');
    todos_os_campos.forEach(function(checkbox){
        if(checkbox.checked){
            campos_selecionados.push(checkbox.value);
        }
    });


    if (!nome || !email || !senha || !sexoRadio) {
        alert("Por favor, preencha todos os campos!");
        return;
    }
    const sexo = sexoRadio.value;

    if (listaCadastro.some(user => user.email === email)) {
        alert("Já existe um cadastro com este e-mail!");
    } else {
        listaCadastro.push({ nome, email, senha, sexo, cargo, checkboxes: campos_selecionados });
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

/* INPUTS

=== radio ===
abaixo da const cargo, acrescentar --> const radio = document.querySelector('input[name="radio"]:checked');

Alterar linha 37: listaCadastro.push({ nome, email, senha, sexo, cargo, radio });

=== checkbox ===

colar na linha 27:
    const campos_selecionados = [];
    const todos_os_campos = document.querySelectorAll('input[name="opcoes"]');
    todos_os_campos.forEach(function(checkbox){
        if(checkbox.checked){
            campos_selecionados.push(checkbox.value);
        }
    });

Alterar linha:
listaCadastro.push({ nome, email, senha, sexo, cargo, checkboxes: campos_selecionados });


=== text, date, datetime-local, date, time ===
var jogo acrescentar --> nomeDoInput: ""

após jogo.observacoes acrescentar:
jogo.nomeDoInput = document.getElementById('Id_do_input').value;

*/