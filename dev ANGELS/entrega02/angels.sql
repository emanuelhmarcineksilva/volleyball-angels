CREATE DATABASE angels;
USE angels;

CREATE TABLE usuario ( --
	id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    senha VARCHAR(50) NOT NULL,
    sexo ENUM("masculino", "feminino") NOT NULL, -- o ENUM posibilita escolher opções já definidas
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
    FOREIGN KEY (id_administrador) REFERENCES administrador(id)
);

