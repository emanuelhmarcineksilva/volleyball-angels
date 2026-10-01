#!/bin/bash
# Sobe o entrega02 com o dev server embutido do PHP.
# Uso:  ./iniciar.sh [porta]
#
# Porta 3306 por padrao: o MySQL do XAMPP foi pra 3307 (ver configurar-banco.sh),
# entao 3306 ta livre pra aplicação.

set -e
cd "$(dirname "$0")"

PORTA="${1:-3306}"

if ! command -v php >/dev/null; then
    echo "php nao encontrado. Arch: sudo pacman -S php"
    exit 1
fi

# O mysqli vem como extensao compartilhada no Arch, entao o dev server precisa
# carregar na mao. Sem isso, login e cadastro morrem com "Call to undefined
# function mysqli".
MYSQLI="/usr/lib/php/modules/mysqli.so"
if ! php -m | grep -qi mysqli; then
    if [ -f "$MYSQLI" ]; then
        echo "Carregando a extensao mysqli na mao."
    else
        echo "AVISO: extensao mysqli nao encontrada em $MYSQLI"
        echo "       Instale com: sudo pacman -S php"
        exit 1
    fi
fi

echo "Entrega 02 - Volleyball Angels"
echo "URL:      http://localhost:$PORTA/app/View/login.html"
echo "Cadastro: http://localhost:$PORTA/app/View/cadastro.html"
echo "Sessao:   http://localhost:$PORTA/core/valida_sessao.php"
echo "Ctrl+C para encerrar."
echo

exec php -d extension=mysqli -S "localhost:$PORTA" -t .
