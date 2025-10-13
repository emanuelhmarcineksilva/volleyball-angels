// autenticacao.js

// 1. DADOS DO USUÁRIO
const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));

// 2. LÓGICA DE PROTEÇÃO CONDICIONAL
const paginaAtual = window.location.pathname;

// Define quais páginas são acessíveis sem login.
// Isso evita que o script bloqueie o acesso às páginas de login e cadastro.
const ehPaginaPublica = paginaAtual.endsWith('/index.html') || 
                      paginaAtual.endsWith('/') ||
                      paginaAtual.endsWith('/login.html') ||
                      paginaAtual.endsWith('/cadastro.html');

// A verificação de segurança só redireciona se o usuário NÃO estiver logado
// E a página que ele tenta acessar NÃO for pública.
if (!usuarioLogado && !ehPaginaPublica) {
    alert("Você precisa estar logado para acessar esta página.");
    window.location.href = 'login.html'; // Redireciona para a página de login
}

// 3. FUNÇÃO DE LOGOUT
function fazerLogout() {
    sessionStorage.removeItem('usuarioLogado');
    alert("Você saiu da sua conta.");
    // Ao deslogar, redireciona para a página inicial.
    window.location.href = 'index.html';
}

// 4. PERSONALIZAÇÃO DO HEADER
// Este código é executado em todas as páginas que incluem o script.
document.addEventListener('DOMContentLoaded', () => {
    // Se o usuário estiver logado, o header é atualizado.
    if (usuarioLogado) {
        const loginLink = document.querySelector('.login-link');
        if (loginLink) {
            loginLink.innerHTML = `
                <span class="login-text">Olá, ${usuarioLogado.nome}</span>
                <a href="#" onclick="fazerLogout()" class="btn btn-danger btn-sm ms-2">Sair</a>
            `;
            // Remove o link original para evitar navegação indesejada.
            loginLink.removeAttribute('href');
        }
    }
});