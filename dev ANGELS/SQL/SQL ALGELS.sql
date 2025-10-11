CREATE DATABASE angels;
USE angels;

CREATE TABLE administrador (
	id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(12) NOT NULL,
    carteirinha INT UNIQUE NOT NULL,
    cargo VARCHAR(50) NOT NULL
);

CREATE TABLE aluno(
	id INT AUTO_INCREMENT PRIMARY KEY,
    data_nasc DATE NOT NULL,
    telefone VARCHAR(12) NOT NULL,
    nome VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    carteirinha INT UNIQUE NOT NULL,
    status BOOLEAN NOT NULL DEFAULT TRUE,
    curso VARCHAR(50) NOT NULL,
    horas_jogadas TIME,
    id_administrador INT,
    FOREIGN KEY (id_administrador) REFERENCES administrador(id)
);

CREATE TABLE treino(
	id INT AUTO_INCREMENT PRIMARY KEY,
    duracao TIME NOT NULL,
    data_hora DATETIME NOT NULL,
    local VARCHAR(50) NOT NULL,
    tipo_treino VARCHAR(255) NOT NULL,
    id_administrador INT,
    FOREIGN KEY (id_administrador) REFERENCES administrador(id)
);

CREATE TABLE treino_usuario(
	id_aluno INT,
    id_administrador INT,
    FOREIGN KEY (id_aluno) REFERENCES aluno(id),
    FOREIGN KEY (id_administrador) REFERENCES administrador(id)
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
    observacoes VARCHAR(255),
    id_administrador INT,
    FOREIGN KEY (id_administrador) REFERENCES administrador(id)
);

CREATE TABLE jogo_usuario (
	id_aluno INT,
    id_administrador INT,
    FOREIGN KEY (id_aluno) REFERENCES aluno(id),
    FOREIGN KEY (id_administrador) REFERENCES administrador(id)
);

CREATE TABLE presenca_jogo (
	id_aluno INT,
    id_jogo INT,
    PRIMARY KEY (id_aluno, id_jogo),
    presenca BOOLEAN NOT NULL DEFAULT TRUE,
    justif_falta VARCHAR(255),
    data_registro DATETIME NOT NULL,
    FOREIGN KEY (id_aluno) REFERENCES aluno(id),
    FOREIGN KEY (id_jogo) REFERENCES jogo(id)
);

CREATE TABLE evento (
	id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    local VARCHAR(50) NOT NULL,
    data_hora DATETIME NOT NULL,
    duracao TIME NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    id_aluno INT,
    id_administrador INT,
    FOREIGN KEY (id_aluno) REFERENCES aluno(id),
    FOREIGN KEY (id_administrador) REFERENCES administrador(id)
);

CREATE TABLE pedido (
	id INT AUTO_INCREMENT PRIMARY KEY,
    data_compra DATETIME NOT NULL,
    valor_total DECIMAL(10, 2) UNSIGNED NOT NULL,
    status VARCHAR(50) NOT NULL,
    id_aluno INT,
    FOREIGN KEY (id_aluno) REFERENCES aluno(id)
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

CREATE TABLE item_pedido (
	id_pedido INT,
    id_produto INT,
    PRIMARY KEY (id_pedido, id_produto),
    quantidade INT UNSIGNED NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedido(id),
    FOREIGN KEY (id_produto) REFERENCES produto(id)
);
