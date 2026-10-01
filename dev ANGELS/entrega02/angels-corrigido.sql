-- Schema do banco "angels" - versao corrigida para subir localmente.
-- Diferenca em relacao ao angels.sql original: a tabela "produto" tem
-- FOREIGN KEY (id_administrador) REFERENCES administrador(id), mas nao existe
-- nenhuma tabela "administrador" no schema. Isso faz o import inteiro falhar
-- com erro 1217 (Cannot add foreign key constraint). Aqui a referencia aponta
-- para usuario(id), que e a tabela que realmente existe.

CREATE DATABASE IF NOT EXISTS angels;
USE angels;

CREATE TABLE usuario ( --
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    senha VARCHAR(50) NOT NULL,
    sexo ENUM("masculino", "feminino") NOT NULL, -- o ENUM possibilita escolher opções já definidas
    cargo ENUM("usuario","membro","jogador","adm","coordenador-time","presidente","vice-presidente") NOT NULL,
    newsletter BOOLEAN DEFAULT FALSE -- true -> sim / false -> não para receber emails, e de não for marcado é false
);

CREATE TABLE treino( --
    id INT AUTO_INCREMENT PRIMARY KEY,
    duracao TIME NOT NULL,
    data_hora DATETIME NOT NULL,
    local VARCHAR(50) NOT NULL,
    tipo_treino VARCHAR(255) NOT NULL
);

CREATE TABLE jogo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data_hora_inicio DATETIME NOT NULL,
    data_hora_fim DATETIME NOT NULL,
    duracao TIME NOT NULL,
    local VARCHAR(50) NOT NULL,
    adversario VARCHAR(50),
    tipo_jogo VARCHAR(255) NOT NULL,
    ponto_clube INT UNSIGNED,
    ponto_adversario INT UNSIGNED,
    observacoes VARCHAR(255)
);

CREATE TABLE evento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    local VARCHAR(50) NOT NULL,
    data_hora DATETIME NOT NULL,
    duracao TIME NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    id_usuario INT,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id)
);

CREATE TABLE produto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    preco DECIMAL(10, 2) UNSIGNED NOT NULL,
    estoque INT UNSIGNED NOT NULL,
    categoria VARCHAR(255) NOT NULL,
    id_administrador INT,
    FOREIGN KEY (id_administrador) REFERENCES usuario(id)
);

-- Usuario de teste, util para nao ter que cadastrar na mao na primeira apresentacao
INSERT INTO usuario (nome, email, telefone, senha, sexo, cargo) VALUES
    ('Administrador Teste', 'admin@angels.com', '41999999999', '1234', 'masculino', 'adm'),
    ('Jogador Teste',       'jogador@angels.com', '41988888888', '1234', 'feminino',  'jogador');
