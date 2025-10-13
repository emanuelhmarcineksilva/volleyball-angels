// autenticacao.js (Versão Modificada)

// 1. DADOS DO USUÁRIO
// Pega os dados do usuário do sessionStorage. Isso é feito em todas as páginas.
const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));

// 2. LÓGICA DE PROTEÇÃO CONDICIONAL
// Pega o caminho da página atual (ex: "/pages/eventos.html")
const paginaAtual = window.location.pathname;

// Define qual página será pública.
// ATENÇÃO: Verifique se o caminho no seu projeto é exatamente este.
const paginaPublica = '../../app/View/index.html'; 

// A verificação de segurança agora tem duas condições:
// SÓ redireciona se o usuário NÃO estiver logado E a página NÃO for a index.
if (!usuarioLogado && !paginaAtual.endsWith(paginaPublica)) {
    alert("Você precisa estar logado para acessar esta página.");
    window.location.href = 'login.html';
}

// 3. FUNÇÃO DE LOGOUT
// Esta função permanece a mesma.
function fazerLogout() {
    sessionStorage.removeItem('usuarioLogado');
    alert("Você saiu da sua conta.");
    window.location.href = 'login.html';
}

// 4. PERSONALIZAÇÃO DO HEADER
// Esta lógica também permanece a mesma e será executada em TODAS as páginas,
// incluindo a index.html.
document.addEventListener('DOMContentLoaded', () => {
    // Apenas altera o header SE o usuário estiver logado.
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