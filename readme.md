# M7-3-Proyecto Node + PostgreSQL parte 2

## Descripción

Este proyecto es la segunta parte del proyecto  Gestion de clientes con Node.js y PostgresSQL, en donde se expande su funcionalidad, incorporando nuevos enpoind  para manipular los datos a través de una interfaz web sencilla y filtros de búsqueda parametrizados.

El objetivo es practicar **consultas parametrizadas** con `pg` para prevenir inyección SQL y manejar datos de manera segura.


## Tecnologías utilizadas
- Node.js  
- Express  
- PostgreSQL  
- pg (cliente de PostgreSQL para Node)  
- HTML / CSS / JavaScript  
- npm para gestión de dependencias  


## Funcionalidades

- **Crear cliente**: Ingresar Rut, Nombre y Edad.
- **Modificar cliente**: Cambiar el nombre de un cliente existente.
- **Eliminar cliente**: Eliminar por Rut o por criterios de edad/rango.
- **Consultar clientes**: Filtrar por Rut, Nombre, Edad o rango de Edad.
- **Listar todos los clientes**: Mostrar todos los clientes registrados.
- **Resultados dinámicos**: La lista de clientes se actualiza en tiempo real en la página.


## Endpoints

| Método | Endpoint | Descripción | Parámetros / Body |
|--------|----------|-------------|-----------------|
| GET    | `/clientes` | Listar todos los clientes | - |
| GET    | `/clientes?rut=<rut>` | Consultar cliente por Rut | Query: `rut` |
| GET    | `/clientes?edad=<n>` | Consultar clientes por edad | Query: `edad` |
| GET    | `/clientes?edadMin=<n>&edadMax=<m>` | Consultar clientes por rango de edad | Query: `edadMin`, `edadMax` |
| GET    | `/clientes?nombre=<texto>` | Buscar clientes por nombre o prefijo | Query: `nombre` |
| POST   | `/clientes` | Crear cliente | Body JSON: `{ "rut": "...", "nombre": "...", "edad": ... }` |
| PUT    | `/clientes/:rut` | Modificar solo el nombre de un cliente | Params: `rut`; Body JSON: `{ "nombre": "..." }` |
| DELETE | `/clientes/:rut` | Eliminar cliente por Rut | Params: `rut` |
| DELETE | `/clientes?edad=<n>` | Eliminar clientes por edad | Query: `edad` |
| DELETE | `/clientes?edadMin=<n>&edadMax=<m>` | Eliminar clientes en rango de edad | Query: `edadMin`, `edadMax` |

## Uso
1. Configurar el archivo .env_ejemplo con las credenciales de tu base de datos. 
2. Instalar dependencias npm install
3. Ejecutar Servidor npm start
4. Abrir Navegador http://localhost:3000.


# Notas 
- Para probar la conección a postgress, la tabla de este ejercicio es clientes_t2, ya que este proyecto esta dentro de la base de datos finanzas_m7 y si lista clientes saldra la tabla del ejercicio anterior.
- Las consultas se realizan con parametrización usando $1, $2, etc., para evitar inyección SQL.
- Se manejan correctamente errores comunes: RUT duplicado, cliente no encontrado, datos incompletos y errores de conexión.

## Autor
Fernanda Álvarez para curso Fullstack Javascript Sence.