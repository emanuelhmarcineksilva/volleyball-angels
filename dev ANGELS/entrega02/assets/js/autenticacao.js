const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
const paginaAtual = window.location.pathname;
const ehPaginaPublica = paginaAtual.endsWith('/index.html') || 
                      paginaAtual.endsWith('/') ||
                      paginaAtual.endsWith('/login.html') ||
                      paginaAtual.endsWith('/cadastro.html');

if (!usuarioLogado && !ehPaginaPublica) {
    alert("Você precisa estar logado para acessar esta página.");
    window.location.href = 'login.html';
}


function fazerLogout() {
    sessionStorage.removeItem('usuarioLogado');
    alert("Você saiu da sua conta.");
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    if (usuarioLogado) {
        const loginLink = document.querySelector('.login-link');
        if (loginLink) {
            loginLink.innerHTML = `
                <span class="login-text">Olá, ${usuarioLogado.nome}</span>
                <a href="#" onclick="fazerLogout()" class="btn btn-danger btn-sm ms-2">Sair</a>
            `;
            loginLink.removeAttribute('href');
        }
    }
});