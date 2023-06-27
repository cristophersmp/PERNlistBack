CREATE DATABASE pernlistdb;

CREATE TABLE tareas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR (255) UNIQUE,
    descripcion VARCHAR (255)
);