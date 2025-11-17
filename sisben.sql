-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema sisben
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema sisben
-- -----------------------------------------------------

DROP SCHEMA IF EXISTS sisben; -- Eliminar si existe y crear el esquema
CREATE SCHEMA IF NOT EXISTS `sisben` DEFAULT CHARACTER SET utf8 ;
USE `sisben` ;

-- -----------------------------------------------------
-- Tabla HOME
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `home` (
  `id_homes` INT NOT NULL AUTO_INCREMENT,
  `address` VARCHAR(45) NULL,
  `social_stratum` INT NULL,
  `municipality` VARCHAR(45) NULL,
  PRIMARY KEY (`id_homes`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabla PERSON
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `person` (
  `id_card` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `edad` INT NULL,
  `sex` VARCHAR(10) NULL,
  `homes_id_homes` INT NOT NULL,
  PRIMARY KEY (`id_card`),
  INDEX `fk_people_homes_idx` (`homes_id_homes` ASC),
  CONSTRAINT `fk_people_homes`
    FOREIGN KEY (`homes_id_homes`)
    REFERENCES `home` (`id_homes`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabla PROGRAMS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `programs` (
  `id_programs` INT NOT NULL AUTO_INCREMENT,
  `program_date` DATE NULL,
  `description` VARCHAR(45) NULL,
  PRIMARY KEY (`id_programs`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabla BENEFICIARIES
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `beneficiaries` (
  `id_beneficiaries` INT NOT NULL AUTO_INCREMENT,
  `admission_date` DATE NULL,
  `person_id_person` INT NOT NULL,
  PRIMARY KEY (`id_beneficiaries`),
  INDEX `fk_program_beneficiaries_people1_idx` (`person_id_person` ASC),
  CONSTRAINT `fk_program_beneficiaries_people1`
    FOREIGN KEY (`person_id_person`)
    REFERENCES `person` (`id_card`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabla PROGRAMS_HAS_BENEFICIARIES (N:M)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `programs_has_beneficiaries` (
  `social_programs_idsocial_programs` INT NOT NULL,
  `program_beneficiaries_idprogram_beneficiaries` INT NOT NULL,
  PRIMARY KEY (`social_programs_idsocial_programs`, `program_beneficiaries_idprogram_beneficiaries`),
  INDEX `fk_program_beneficiaries_idx` (`program_beneficiaries_idprogram_beneficiaries` ASC),
  INDEX `fk_social_program_idx` (`social_programs_idsocial_programs` ASC),
  CONSTRAINT `fk_social_programs1`
    FOREIGN KEY (`social_programs_idsocial_programs`)
    REFERENCES `programs` (`id_programs`),
  CONSTRAINT `fk_beneficiaries1`
    FOREIGN KEY (`program_beneficiaries_idprogram_beneficiaries`)
    REFERENCES `beneficiaries` (`id_beneficiaries`)
) ENGINE = InnoDB;

-- ===============================
-- INSERTS DE EJEMPLO
-- ===============================

-- 1. Hogares (3 casas diferentes)
INSERT INTO home (address, municipality, social_stratum)
VALUES 
('Calle 10 #5-20', 'Bogotá', 2),    
('Carrera 15 #8-45', 'Medellín', 3),
('Avenida 30 #20-10', 'Cali', 1);

-- 2. Personas (cada una en un hogar distinto)
INSERT INTO person (name, edad, sex, homes_id_homes)
VALUES 
('Ana Pérez', 29, 'F', 1),
('Juan Gómez', 34, 'M', 2),
('Laura Torres', 22, 'F', 3);

-- 3. Programas sociales
INSERT INTO programs (program_date, description)
VALUES 
('2024-01-01', 'Subsidio Jóvenes en Acción'),
('2024-02-01', 'Subsidio Familias en Acción');

-- 4. Beneficiarios (Ana y Laura sí, Juan no)
INSERT INTO beneficiaries (admission_date, person_id_person)
VALUES 
('2024-01-15', 1),  -- Ana
('2024-03-20', 3);  -- Laura

-- 5. Relación programas ↔ beneficiarios
-- Ana recibe Jóvenes en Acción
INSERT INTO programs_has_beneficiaries (social_programs_idsocial_programs, program_beneficiaries_idprogram_beneficiaries)
VALUES (1, 1);

-- Laura recibe Familias en Acción
INSERT INTO programs_has_beneficiaries (social_programs_idsocial_programs, program_beneficiaries_idprogram_beneficiaries)
VALUES (2, 2);

-- ===============================
-- CONSULTAS DE VERIFICACIÓN
-- ===============================
SELECT * FROM home;
SELECT * FROM person;
SELECT * FROM programs;
SELECT * FROM beneficiaries;

-- ===============================
-- CONSULTA FINAL: JOIN
-- ===============================
SELECT 
    p.name AS Persona,
    p.edad AS Edad,
    p.sex AS Sexo,
    h.municipality AS Municipio,
    h.social_stratum AS Estrato,
    pr.description AS Programa,
    b.admission_date AS Fecha_Ingreso
FROM programs_has_beneficiaries phb
JOIN beneficiaries b 
    ON phb.program_beneficiaries_idprogram_beneficiaries = b.id_beneficiaries
JOIN person p 
    ON b.person_id_person = p.id_card
JOIN home h 
    ON p.homes_id_homes = h.id_homes
JOIN programs pr 
    ON phb.social_programs_idsocial_programs = pr.id_programs;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- ===============================
-- AGREGAR IMAGEN
-- ===============================
ALTER TABLE person
ADD COLUMN image_url VARCHAR(255) NULL AFTER sex;

-- ===============================
-- USUARIO - LOGIN
-- ===============================

CREATE TABLE IF NOT EXISTS users (
  id_user INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_encrypted VARCHAR(255) NOT NULL,
  PRIMARY KEY (id_user)
);

INSERT INTO users (username, password_encrypted)
VALUES ('admin', ''); 