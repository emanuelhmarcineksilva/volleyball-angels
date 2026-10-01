CREATE DATABASE angels DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE angels;

SET NAMES utf8mb4;

CREATE TABLE usuario ( --
	id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    senha VARCHAR(50) NOT NULL,
    sexo ENUM("Masculino", "Feminino") NOT NULL,
	cargo ENUM("Usuário","Membro","Jogador","Administrador") NOT NULL
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE treino( --
	id INT AUTO_INCREMENT PRIMARY KEY,
    duracao TIME NOT NULL,
    data_hora DATETIME NOT NULL,
    local VARCHAR(50) NOT NULL,
    tipo VARCHAR(255) NOT NULL
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE jogo (
	id INT AUTO_INCREMENT PRIMARY KEY,
    data_hora_inicio DATETIME NOT NULL,
    data_hora_fim DATETIME NOT NULL,
    adversario VARCHAR(50),
    tipo_jogo VARCHAR(255) NOT NULL,
    ponto_clube INT UNSIGNED,
    ponto_adversario INT UNSIGNED,
    observacoes VARCHAR(255)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE evento (
	id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    local VARCHAR(50) NOT NULL,
    data_hora DATETIME NOT NULL,
    duracao TIME NOT NULL,
    descricao VARCHAR(255) NOT NULL
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE produto (
	id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    preco DECIMAL(10, 2) UNSIGNED NOT NULL,
    estoque INT UNSIGNED NOT NULL,
    categoria VARCHAR(255) NOT NULL
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Compra: pedido guarda o cabecalho (Quem comprou, quando, total, como paga) e
-- pedido_item guarda cada produto do pedido com o preco congelado no momento
-- da compra. Guardar o preco aqui (e nao ler de produto) evita que o admin
-- reprecale um produto apague o historico financeiro de quem ja comprou.
CREATE TABLE pedido (
	id INT AUTO_INCREMENT PRIMARY KEY,
	id_usuario INT NOT NULL,
	data_pedido DATETIME NOT NULL,
	valor_total DECIMAL(10, 2) UNSIGNED NOT NULL,
	forma_pagamento ENUM("PIX","Cartao de credito","Cartao de debito","Dinheiro") NOT NULL,
	situacao ENUM("Aguardando pagamento","Pago","Cancelado") NOT NULL DEFAULT "Aguardando pagamento",
	CONSTRAINT fk_pedido_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id) ON DELETE CASCADE,
	INDEX idx_pedido_usuario (id_usuario)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE pedido_item (
	id INT AUTO_INCREMENT PRIMARY KEY,
	id_pedido INT NOT NULL,
	id_produto INT NOT NULL,
	nome_produto VARCHAR(50) NOT NULL,
	quantidade INT UNSIGNED NOT NULL,
	preco_unitario DECIMAL(10, 2) UNSIGNED NOT NULL,
	CONSTRAINT fk_item_pedido FOREIGN KEY (id_pedido) REFERENCES pedido(id) ON DELETE CASCADE,
	CONSTRAINT fk_item_produto FOREIGN KEY (id_produto) REFERENCES produto(id),
	INDEX idx_item_pedido (id_pedido)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inscricao em evento: qualquer usuario logado pode se inscrever, mas cada
-- par (evento, usuario) e unico, para a mesma pessoa nao lotar o evento duas
-- vezes nem aparecer duplicada na lista de prescriptive.
CREATE TABLE inscricao_evento (
	id INT AUTO_INCREMENT PRIMARY KEY,
	id_evento INT NOT NULL,
	id_usuario INT NOT NULL,
	data_inscricao DATETIME NOT NULL,
	CONSTRAINT fk_inscricao_evento FOREIGN KEY (id_evento) REFERENCES evento(id) ON DELETE CASCADE,
	CONSTRAINT fk_inscricao_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id) ON DELETE CASCADE,
	CONSTRAINT uk_inscricao_unica UNIQUE (id_evento, id_usuario)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*insert into usuario (nome, email, senha, telefone, sexo, cargo) values ('oi', 'oi@oi', 'oi', '1111-1111', 'feminino', 'usuario');
insert into usuario (nome, email, senha, telefone, sexo, cargo) values ('tchau', 'tchau@tchau', 'tchau', '1111-1111', 'feminino', 'usuario');
select * from usuario;
select * from evento;
select * from treino;
select * from jogo;

ALTER TABLE [nome da tabela]
ADD COLUMN texto VARCHAR(255);
*/

