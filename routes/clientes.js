const express = require("express");
const router = express.Router();
const pool = require("../dataBase");

// GET /clientes
router.get("/", async (req, res) => {
  const { rut, edad, edadMin, edadMax, nombre } = req.query;
  try {
    if (rut) {
      const { rows } = await pool.query(
        "SELECT rut,nombre,edad FROM clientes_t2 WHERE rut=$1",
        [rut]
      );
      if (rows.length === 0)
        return res.status(404).json({ mensaje: "cliente no existe" });
      return res.json([rows[0]]); // siempre retornar array
    }

    if (edad) {
      const { rows } = await pool.query(
        "SELECT rut,nombre,edad FROM clientes_t2 WHERE edad=$1",
        [edad]
      );
      if (rows.length === 0)
        return res.json({ mensaje: "no hay clientes_t2 que cumplan con el criterio" });
      return res.json(rows);
    }

    if (edadMin && edadMax) {
      const { rows } = await pool.query(
        "SELECT rut,nombre,edad FROM clientes_t2 WHERE edad BETWEEN $1 AND $2",
        [edadMin, edadMax]
      );
      if (rows.length === 0) return res.json({ mensaje: "no hay coincidencias" });
      return res.json(rows);
    }

    if (nombre) {
      const { rows } = await pool.query(
        "SELECT rut,nombre,edad FROM clientes_t2 WHERE nombre ILIKE $1",
        [nombre + "%"]
      );
      if (rows.length === 0) return res.json({ mensaje: "no hay coincidencias" });
      return res.json(rows);
    }

    const { rows } = await pool.query(
      "SELECT rut,nombre,edad FROM clientes_t2 ORDER BY rut"
    );
    res.json(rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "error del servidor" });
  }
});

// POST /clientes
router.post("/", async (req, res) => {
  const { rut, nombre, edad } = req.body;
  if (!rut || !nombre || !edad) return res.status(400).json({ error: "Datos incompletos" });
  if (isNaN(edad)) return res.status(400).json({ error: "Edad debe ser numérica" });

  try {
    await pool.query(
      "INSERT INTO clientes_t2 (rut, nombre, edad) VALUES ($1,$2,$3)",
      [rut, nombre, edad]
    );
    res.status(201).json({ message: "Cliente creado" });
  } catch (error) {
    if (error.code === "23505") return res.status(409).json({ error: "RUT duplicado" });
    res.status(500).json({ error: "Error del servidor" });
  }
});

// DELETE /clientes/:rut
router.delete("/:rut", async (req, res) => {
  const { rut } = req.params;
  try {
    const result = await pool.query("DELETE FROM clientes_t2 WHERE rut=$1", [rut]);
    if (result.rowCount === 0) return res.status(404).json({ error: "Cliente no encontrado" });
    res.json({ message: "Cliente eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error del servidor" });
  }
});

// DELETE por edad / rango
router.delete("/", async (req,res) => {
  const { edad, edadMin, edadMax } = req.query;
  try {
    if (edad) {
      const { rows } = await pool.query(
        "DELETE FROM clientes WHERE edad=$1 RETURNING nombre",
        [edad]
      );
      if(rows.length===0) return res.json({mensaje:"no hay coincidencias"});
      return res.json({eliminados: rows});
    }
    if (edadMin && edadMax) {
      const { rows } = await pool.query(
        "DELETE FROM clientes_t2 WHERE edad BETWEEN $1 AND $2 RETURNING nombre",
        [edadMin,edadMax]
      );
      if(rows.length===0) return res.json({mensaje:"no hay coincidencias"});
      return res.json({eliminados: rows});
    }
    res.status(400).json({mensaje:"debe enviar criterio de eliminación"});
  } catch(error) {
    res.status(500).json({error:"error del servidor"});
  }
});

// PUT /clientes/:rut
router.put("/:rut", async (req, res) => {
  const { rut } = req.params;
  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ error: "Debe enviar nombre" });

  try {
    const result = await pool.query(
      "UPDATE clientes_t2 SET nombre=$1 WHERE rut=$2",
      [nombre, rut]
    );
    if(result.rowCount===0) return res.status(404).json({ error: "Cliente no existe" });
    res.json({ message: "Cliente actualizado" });
  } catch(error) {
    res.status(500).json({ error: "Error del servidor" });
  }
});

module.exports = router;
