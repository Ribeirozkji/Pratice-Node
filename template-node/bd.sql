CREATE DATABASE ATV;

USE ATV;


CREATE TABLE users (
    id_user INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    
);

CREATE TABLE registro_logs (
    id_logs TINYINT PRIMARY KEY AUTO_INCREMENT,
    dia_logs DATETIME NOT NULL,
    id_user INT NOT NULL,
    FOREIGN KEY (id_user) REFERENCES users(id_user)
);

	