CREATE DATABASE biblioteca;
use biblioteca;

CREATE TABLE livro(
  id int PRIMARY KEY AUTO_INCREMENT,
  titulo varchar(100) not null,
  subtitulo varchar(100),
  editora varchar(50) not null,
  ano year not null, 
  titulo_original varchar(100),
  cdd varchar(15)
);


CREATE TABLE autor(
	livro_id int NOT NULL,
	nome varchar(100) not null,
	FOREIGN KEY(livro_id) REFERENCES livro(id)
);

CREATE TABLE exemplar(
    id int PRIMARY KEY AUTO_INCREMENT,
    livro_id int NOT NULL,
    num_exemplar int,
    FOREIGN KEY(livro_id) REFERENCES livro(id)    
);

CREATE TABLE estante(
	id int PRIMARY KEY AUTO_INCREMENT,
	local VARCHAR(50) NOT NULL,
	numero int 
);

CREATE TABLE usuario(
	id int PRIMARY KEY AUTO_INCREMENT,
	nome VARCHAR(50) NOT NULL,
	cpf CHAR(11) NOT NULL,
	endereco VARCHAR(100) NOT NULL,
	status CHAR(1) NOT NULL,
	email VARCHAR(50) NOT NULL,
	codigo_aluno INT,
	codigo_funcionario INT
);

CREATE TABLE funcionario(
	id int PRIMARY KEY AUTO_INCREMENT,
	nome VARCHAR(50) NOT NULL,
	codigo_funcionario INT 
);

CREATE TABLE livro_funcionario(
	livro_id INT  ,
	funcionario_id INT ,
	data_cadastro DATETIME not null,
	PRIMARY KEY(livro_id, funcionario_id),
	FOREIGN KEY (livro_id) REFERENCES livro(id),
	FOREIGN KEY (funcionario_id) REFERENCES funcionario(id)
);

CREATE TABLE exemplar_funcionario(
	exemplar_id INT,
	funcionario_id INT,
	data_cadastro DATETIME not null,
	PRIMARY KEY (exemplar_id, funcionario_id),
	FOREIGN KEY (exemplar_id) REFERENCES exemplar(id),
	FOREIGN KEY (funcionario_id) REFERENCES funcionario(id)
);

CREATE TABLE exemplar_estante(
	exemplar_id INT,
	estante_id INT,
	
	PRIMARY KEY(exemplar_id, estante_id),
	FOREIGN KEY (exemplar_id) REFERENCES exemplar(id),
	FOREIGN KEY (estante_id) REFERENCES estante(id)	
);


CREATE TABLE emprestimo(
	id int  AUTO_INCREMENT,
	exemplar_id INT ,
	usuario_id INT,
	funcionario_id INT ,
	data_emprestimo DATETIME NOT NULL,
	data_prevista_devolucao DATETIME NOT NULL,
	data_devolucao DATETIME,
	num_dias_atraso INT,
	PRIMARY KEY(id, exemplar_id, usuario_id, funcionario_id),
	FOREIGN KEY (exemplar_id) REFERENCES exemplar(id),
	FOREIGN KEY (usuario_id) REFERENCES usuario(id),
	FOREIGN KEY (funcionario_id) REFERENCES funcionario(id)	
);

CREATE TABLE MULTA(
	id INT PRIMARY KEY AUTO_INCREMENT,
	emprestimo_id INT NOT NULL,
	data_multa DATETIME NOT NULL,
	valor DECIMAL(8,2) NOT NULL,
	status char(1),
	FOREIGN KEY (emprestimo_id) REFERENCES emprestimo(id)
);

