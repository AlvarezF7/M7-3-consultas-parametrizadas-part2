------------------------------------------------------
--Tarea 2 Modulo 7
------------------------------------------------------
CREATE TABLE IF NOT EXISTS clientes_t2 (
  rut VARCHAR(10) PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  edad INT NOT NULL
);

---------------------------------------------------------
--Incorpora data de prueba
---------------------------------------------------------
INSERT INTO clientes_t2 VALUES
('11000111-1','Pablo',30),
('12000222-2','Rodrigo',20),
('13000333-3','Sonia',25);
