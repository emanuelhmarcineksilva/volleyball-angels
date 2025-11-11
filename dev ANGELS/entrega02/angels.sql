CREATE DATABASE angels;
USE angels;

CREATE TABLE usuario ( --
	id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    senha VARCHAR(50) NOT NULL,
    sexo ENUM("Masculino", "Feminino") NOT NULL,
	cargo ENUM("Usuário","Membro","Jogador","Administrador") NOT NULL
);

CREATE TABLE treino( --
	id INT AUTO_INCREMENT PRIMARY KEY,
    duracao TIME NOT NULL,
    data_hora DATETIME NOT NULL,
    local VARCHAR(50) NOT NULL,
    tipo VARCHAR(255) NOT NULL
);

CREATE TABLE jogo (
	id INT AUTO_INCREMENT PRIMARY KEY,
    data_hora_inicio DATETIME NOT NULL,
    data_hora_fim DATETIME NOT NULL,
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
    descricao VARCHAR(255) NOT NULL
);

CREATE TABLE produto (
	id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    preco DECIMAL(10, 2) UNSIGNED NOT NULL,
    estoque INT UNSIGNED NOT NULL,
    categoria VARCHAR(255) NOT NULL
);

/*insert into usuario (nome, email, senha, telefone, sexo, cargo) values ('oi', 'oi@oi', 'oi', '1111-1111', 'feminino', 'usuario');
insert into usuario (nome, email, senha, telefone, sexo, cargo) values ('tchau', 'tchau@tchau', 'tchau', '1111-1111', 'feminino', 'usuario');
select * from usuario;
select * from evento;
select * from treino;
select * from jogo;

ALTER TABLE [nome da tabela]
ADD COLUMN texto VARCHAR(255);
*/

