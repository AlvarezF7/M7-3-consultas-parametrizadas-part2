const baseUrl = "http://localhost:3000/clientes";

// FUNCIONES GENERALES 
function mostrarError(idError, mensaje) {
  const errorElemento = document.getElementById(idError);
  errorElemento.textContent = mensaje;
  setTimeout(() => errorElemento.textContent = "", 3000);
}

// CREAR
document.getElementById("btnCrear").addEventListener("click", async () => {
  const rut = document.getElementById("crearRut").value.trim();
  const nombre = document.getElementById("crearNombre").value.trim();
  const edad = document.getElementById("crearEdad").value.trim();

  if (!rut || !nombre || !edad) return mostrarError("errorCrear","Todos los campos son obligatorios");
  if (isNaN(edad)) return mostrarError("errorCrear","Edad debe ser un número");

  try {
    const res = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rut, nombre, edad: parseInt(edad) }),
    });
    const data = await res.json();
    if (!res.ok) mostrarError("errorCrear", data.error || "Error al crear cliente");
    else {
      alert("Cliente creado correctamente");
      document.getElementById("crearRut").value = "";
      document.getElementById("crearNombre").value = "";
      document.getElementById("crearEdad").value = "";
    }
  } catch {
    mostrarError("errorCrear","Error de conexión con el servidor");
  }
});

// MODIFICAR 
document.getElementById("btnModificar").addEventListener("click", async () => {
  const rut = document.getElementById("modRut").value.trim();
  const nombre = document.getElementById("modNombre").value.trim();
  if (!rut || !nombre) return mostrarError("errorModificar","Rut y nuevo nombre son obligatorios");

  try {
    const res = await fetch(`${baseUrl}/${rut}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre }),
    });
    const data = await res.json();
    if (!res.ok) mostrarError("errorModificar", data.error || "Error al modificar cliente");
    else {
      alert("Cliente modificado correctamente");
      document.getElementById("modRut").value = "";
      document.getElementById("modNombre").value = "";
    }
  } catch {
    mostrarError("errorModificar","Error de conexión con el servidor");
  }
});

// ELIMINAR 
document.getElementById("btnEliminar").addEventListener("click", async () => {
  const rut = document.getElementById("delRut").value.trim();
  if (!rut) return mostrarError("errorEliminar","Rut es obligatorio");
  if (!confirm(`¿Seguro que quieres eliminar al cliente ${rut}?`)) return;

  try {
    const res = await fetch(`${baseUrl}/${rut}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) mostrarError("errorEliminar", data.error || "Error al eliminar cliente");
    else document.getElementById("delRut").value = "";
  } catch {
    mostrarError("errorEliminar","Error de conexión con el servidor");
  }
});

// LISTAR / FILTRAR 
const tipoBusqueda = document.getElementById("tipoBusqueda");
const inputsBusqueda = {
  rut: document.getElementById("buscarRut"),
  nombre: document.getElementById("buscarNombre"),
  edad: document.getElementById("buscarEdad"),
  rango: [document.getElementById("buscarEdadMin"), document.getElementById("buscarEdadMax")]
};
const btnBuscar = document.getElementById("btnBuscar");
const btnCerrarLista = document.getElementById("btnCerrarLista");
const lista = document.getElementById("listaClientes");

// Mostrar inputs según filtro
tipoBusqueda.addEventListener("change", () => {
  Object.values(inputsBusqueda).flat().forEach(i => i.style.display = "none");
  const campo = inputsBusqueda[tipoBusqueda.value];
  if (!campo) return;
  (Array.isArray(campo) ? campo : [campo]).forEach(i => i.style.display = "block");
});

// Botón Buscar
btnBuscar.addEventListener("click", async () => {
  const filtro = tipoBusqueda.value;
  if (!filtro) return mostrarError("errorBusqueda","Seleccione un filtro");

  let url = baseUrl;
  if(filtro === "todos") {
    // URL sin query params
  } else if(filtro === "rango") {
    const [min,max] = inputsBusqueda.rango;
    url += `?edadMin=${min.value}&edadMax=${max.value}`;
  } else {
    const val = inputsBusqueda[filtro].value.trim();
    if (!val) return mostrarError("errorBusqueda","Ingrese un valor para el filtro");
    url += `?${filtro}=${val}`;
  }

  await listarClientes(url);
  btnCerrarLista.style.display = "inline-block";
});

// Cerrar lista
btnCerrarLista.addEventListener("click", () => {
  lista.innerHTML = "";
  btnCerrarLista.style.display = "none";
});

// Función genérica listar clientes
async function listarClientes(url = baseUrl) {
  try {
    lista.innerHTML = "<li>Cargando...</li>";
    const res = await fetch(url);
    const data = await res.json();
    lista.innerHTML = "";

    if (!data || data.length === 0) {
      lista.innerHTML = "<li>No hay clientes que cumplan el criterio</li>";
      return;
    }

    data.forEach(c => {
      const li = document.createElement("li");
      li.textContent = `${c.rut} - ${c.nombre} - ${c.edad}`;
      lista.appendChild(li);
    });
  } catch {
    mostrarError("errorBusqueda","Error al obtener la lista de clientes");
  }
}