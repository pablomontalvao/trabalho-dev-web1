CREATE DATABASE IF NOT EXISTS tbweb_db
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_general_ci;

USE tbweb_db;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,               
    nome VARCHAR(255) NOT NULL,                     
    email VARCHAR(255) NOT NULL UNIQUE,           
    senha VARCHAR(255) NOT NULL,                      
    telefone VARCHAR(20),                            
    funcao ENUM('cliente', 'adm') NOT NULL DEFAULT 'cliente',  
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP  
);

CREATE TABLE reclamacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,             
    usuario_id INT NOT NULL,                        
    endereco VARCHAR(255) NOT NULL,                   
    numero VARCHAR(20),                            
    complemento VARCHAR(255),                     
    data_ocorrencia DATE NOT NULL,                  
    hora_ocorrencia TIME NOT NULL,                   
    tipo VARCHAR(100) NOT NULL,                  
    descricao TEXT,                                 
    status ENUM('recebido', 'andamento', 'resolvido') NOT NULL DEFAULT 'recebido', 
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    observacoes_adm TEXT,                             
    CONSTRAINT fk_reclamacoes_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) 
        ON DELETE CASCADE   
        ON UPDATE CASCADE   
);
