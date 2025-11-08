document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const fromPage = urlParams.get('from');
    const voltarBtn = document.getElementById('btn-voltar');

    if (voltarBtn) {
        if (fromPage === 'gerenciamento') {
            document.body.classList.add('full-layout');
            voltarBtn.href = 'gerenciamento-usuario.html';
        } else {
            voltarBtn.href = 'login.html';
        }
    }
});

const formCadastro = document.getElementById('form-cadastro');

if (formCadastro) {
    formCadastro.addEventListener('submit', function(e) {
        e.preventDefault();
        realizarCadastro();
    });
}

function realizarCadastro() {
    const nome = document.getElementById('nome-cadastro')?.value.trim();
    const email = document.getElementById('email-cadastro')?.value.trim();
    const senha = document.getElementById('senha-cadastro')?.value.trim();
    const telefone = document.getElementById('telefone-cadastro')?.value.trim();
    const sexoRadio = document.querySelector('input[name="sexo"]:checked');
    const cargo = document.getElementById('seletor-cargo')?.value;

    // Verifica se todos os campos estão preenchidos
    if (!nome || !email || !senha || !telefone || !sexoRadio || !cargo) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    const fd = new FormData();
    fd.append("nome", nome);
    fd.append("email", email);
    fd.append("senha", senha);
    fd.append("telefone", telefone);
    fd.append("sexo", sexoRadio.value);
    fd.append("seletor-cargo", cargo);

    fetch('../Model/Usuario/novo_usuario.php', {
        method: 'POST',
        body: fd
    })
    .then(res => res.json())
    .then(resposta => {
        if (resposta && resposta.status === "ok") {
            alert("Sucesso: " + resposta.mensagem);
            window.location.href = "login.html";
        } else {
            alert("ERRO: " + (resposta?.mensagem || "Erro desconhecido."));
        }
    })
    .catch(() => {
        alert("Falha ao se conectar com o servidor.");
    });
}

