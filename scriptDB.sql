-- Ejecutar Script en consola de PostgreSQL
CREATE DATABASE CurrencyBird;

\c currencybird;

CREATE TABLE client (
    id SERIAL,
    fullname VARCHAR(100), 
    email VARCHAR(50),
    address VARCHAR(250), 
    sex SMALLINT -- (0 = Prefiero no decirlo, 1 = Masculino, 2 = Femenino)
);

INSERT INTO client (fullname, email, address, sex) 
VALUES ('Alicia Rubio Salinas', 'alicia@currencybird.com', 'Central Park 001', 2);
INSERT INTO client (fullname, email, address, sex) 
VALUES ('Pedro Jorquera Soto', 'pedro@currencybird.com', 'Central Park 002', 1);
INSERT INTO client (fullname, email, address, sex) 
VALUES ('Carmen Salazar Paez', 'carmen@currencybird.com', 'Central Park 003', 2);

CREATE TABLE invitation (
    id SERIAL, 
    code VARCHAR(6),
    registrations SMALLINT,
    client_id INT
);

ALTER TABLE client
	ADD CONSTRAINT client_pkey PRIMARY KEY (id);

ALTER TABLE invitation
	ADD CONSTRAINT invitation_pkey PRIMARY KEY (id);

ALTER TABLE invitation
	ADD CONSTRAINT invitation_fkey FOREIGN KEY (client_id) REFERENCES client(id);