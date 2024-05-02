CREATE DATABASE postnet;
\c postnet

CREATE TABLE cuenta (
  alias VARCHAR(50),
  fechacreacion DATE NOT NULL DEFAULT now(),
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  PRIMARY KEY(alias)
);

CREATE TABLE administrador(nombre VARCHAR (50) NOT NULL,apellidos VARCHAR(150) NOT NULL,fechaNacimiento DATE NOT NULL,sexo boolean, PRIMARY KEY(alias)) INHERITS(cuenta);

CREATE TABLE empresas(
 nombre VARCHAR (50) NOT NULL,
 fundacionEmpresa DATE,
 PRIMARY KEY(alias)
) INHERITS(cuenta);

CREATE TABLE usuarios (
    nombre VARCHAR(50) NOT NULL,
    avatar text,
    portada text,
    apellidos VARCHAR(150) NOT NULL,
    fechanacimiento date NOT NULL,
    lugarnacimiento VARCHAR(100),
    sexo boolean,
    movil VARCHAR(10),
    trabajo VARCHAR(80),
    estudios text,
    idioma VARCHAR(50),
    estadocivil VARCHAR(10),
    fijo VARCHAR(10),
    descripcion VARCHAR(255),
    poblacion varchar(50),
    calle varchar(100),
    intereses varchar(7),
    gustos varchar(20)[],
    objetivos varchar(39),
    PRIMARY KEY(alias)
  ) INHERITS (cuenta);

CREATE TABLE contactos(
    alias VARCHAR(50) REFERENCES usuarios(alias) ON UPDATE cascade ON DELETE cascade,
    contactoNick VARCHAR(50) REFERENCES usuarios(alias) ON UPDATE cascade ON DELETE cascade,
    aceptado boolean default false,
    PRIMARY KEY(alias, contactoNick),
    CHECK (alias != contactoNick)
);

CREATE TABLE publicacion(
    id serial,
    contenido text not null,
    linkExterno text,
    usuario VARCHAR(50) NOT NULL REFERENCES usuarios(alias) ON UPDATE cascade ON DELETE cascade,
    multimedia text,
    ubicacion VARCHAR(100),
    likes integer default 0,
    hora VARCHAR default now(),
    reportado boolean default false,
    PRIMARY KEY (id)
  );
CREATE TABLE comentario(
    id serial,
    idPublicacion integer NOT NULL REFERENCES publicacion(id) ON UPDATE cascade ON DELETE cascade,
    cuenta VARCHAR(50) NOT NULL REFERENCES usuarios(alias) ON UPDATE cascade ON DELETE cascade,
    content text NOT NULL,
    fecha date default now(),
    PRIMARY KEY (id)
);


CREATE TABLE mensaje(
  id serial primary key,
  emisor varchar(50) NOT NULL REFERENCES usuarios(alias) ON UPDATE cascade ON DELETE cascade,
  receptor varchar(50) NOT NULL REFERENCES usuarios(alias) ON UPDATE cascade ON DELETE cascade,
  mensaje text not null,
  leido boolean default false,
  fecha varchar default now()
);
/*QUERIES*/
INSERT INTO contactos (alias, contactoNick) VALUES ('sergio', 'paco');
INSERT INTO publicacion (contenido, linkexterno, usuario, empresa, multimedia) VALUES('Hola','pa ti mi cola','sergio','penessa', null);
INSERT INTO usuarios (alias, email, nombre, apellidos, password, fechanacimiento) VALUES('paco','paco@paco.com','Paco','Mendez', '$2b$10$zXbd8cHX1vIx/XB2nkKeGOWdRFkvbNXWrbCaRqoMde9AFy8Nfg86G', '1995/08/25');
/*Contactos*/
SELECT usuarios.alias, nombre FROM usuarios, contactos WHERE (contactos.alias = 'cristiano' AND usuarios.alias = contactos.contactoNick) OR (contactos.contactoNick = 'cristiano' AND usuarios.alias = contactos.alias);
/*usuarios*/
SELECT alias, nombre FROM usuarios WHERE alias != 'manu' and alias NOT IN (select contactoNick from contactos where alias = 'manu') AND alias NOT IN (select alias from contactos where contactoNick = 'manu');

/*borrador*/

/*
    empresa VARCHAR(50) REFERENCES empresas(alias) ON UPDATE cascade ON DELETE cascade,
    admin VARCHAR(50) REFERENCES administrador(alias) ON UPDATE cascade ON DELETE cascade,
    CHECK ((usuario is not null AND empresa is null AND admin is null)OR
        (usuario is null AND empresa is not null AND admin is null)OR
        (usuario is null AND empresa is null AND admin is not null)) */
