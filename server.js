const path = require("path");
const express = require("express");
const cors = require("cors");
const clientesRoutes = require("./routes/clientes");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname,"public")));

app.use("/clientes",clientesRoutes);

app.listen(PORT,()=>{

console.log(`Servidor en http://localhost:${PORT}`);

});