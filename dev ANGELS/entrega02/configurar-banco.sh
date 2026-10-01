#!/bin/bash
# Cria o banco "angels" e importa o schema no MySQL que ja esta rodando.
# Sem sudo e sem mexer em servico: usa root sem senha em 127.0.0.1:3306.
# Rode com:  bash configurar-banco.sh

set -e
cd "$(dirname "$0")"

# o "mysql" do Arch e um alias depreciado do cliente mariadb; usa o binario
# moderno quando ele existe pra nao poluir a saida com aviso de deprecacao
if command -v mariadb >/dev/null; then
    MYSQL="mariadb -h 127.0.0.1 -P 3307 -u root --ssl=0"
else
    MYSQL="mysql -h 127.0.0.1 -P 3307 -u root --ssl=0"
fi

if ! $MYSQL -e "SELECT 1" >/dev/null 2>&1; then
    echo "Nao consegui conectar em 127.0.0.1:3307 como root sem senha."
    echo "Verifique se o MySQL esta rodando e se o root aceita login local."
    exit 1
fi

echo "==>(recriando) banco angels"
# so o DROP: quem cria o banco e o proprio angels.sql (que ja vem com USE
# angels). Criar aqui antes quebraria a importacao, porque o CREATE DATABASE
# dele nao tem IF NOT EXISTS
$MYSQL -e "DROP DATABASE IF EXISTS angels;"

echo "==> importando o schema"
$MYSQL < angels.sql

echo
echo "==> tabelas criadas:"
$MYSQL angels -e "SHOW TABLES;"
echo "==> usuarios na base:"
$MYSQL angels -e "SELECT id, nome, email, cargo FROM usuario;"
echo
echo "=== banco pronto ==="
echo "Rode ./iniciar.sh para subir o dev server."
