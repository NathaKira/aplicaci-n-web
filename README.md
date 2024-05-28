# aplicación-web
Claro, aquí tienes un archivo README detallado para instalar y configurar los contenedores Docker para la base de datos PostgreSQL y la aplicación Node.js.


# Proyecto de Base de Datos y Aplicación Node.js con Docker

Este proyecto configura y ejecuta dos contenedores Docker: uno para una base de datos PostgreSQL y otro para una aplicación Node.js que realiza consultas a la base de datos.

## Requisitos Previos

- Docker
- Node.js

## Estructura del Proyecto


project-root/
├── database/
│   ├── Dockerfile
│   └── init.sql
└── app/
    ├── Dockerfile
    ├── index.js
    └── package.json


## Configuración y Ejecución

### 1. Configurar y Ejecutar el Contenedor de PostgreSQL

#### Paso 1: Crear el Dockerfile para PostgreSQL

En el directorio `database`, crea un archivo llamado `Dockerfile` con el siguiente contenido:

##Dockerfile
# Usa la imagen oficial de PostgreSQL
FROM postgres:latest

# Establece las variables de entorno para la configuración de la base de datos
ENV POSTGRES_DB=mydatabase
ENV POSTGRES_USER=myuser
ENV POSTGRES_PASSWORD=mypassword

# Copia el script de inicialización al directorio de inicialización de Docker
COPY init.sql /docker-entrypoint-initdb.d/


#### Paso 2: Crear el Script de Inicialización

En el mismo directorio `database`, crea un archivo llamado `init.sql` con el siguiente contenido:

##sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
);

INSERT INTO users (name, email) VALUES ('John Doe', 'john@example.com');
INSERT INTO users (name, email) VALUES ('Jane Doe', 'jane@example.com');


#### Paso 3: Construir y Ejecutar el Contenedor PostgreSQL

1. Abre una terminal y navega al directorio `database`.

   
   cd path/to/project-root/database
  

2. Construye la imagen de Docker:


   docker build -t my_postgres_db .
  

3. Ejecuta el contenedor:


   docker run -d --name postgres_container -p 5432:5432 my_postgres_db
   

### 2. Configurar y Ejecutar el Contenedor de la Aplicación Node.js

#### Paso 1: Crear el Dockerfile para la Aplicación

En el directorio `app`, crea un archivo llamado `Dockerfile` con el siguiente contenido:

##Dockerfile
# Usa la imagen oficial de Node.js
FROM node:14

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el package.json y el package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el código de la aplicación
COPY . .

# Expone el puerto que usará la aplicación
EXPOSE 3000

# Define el comando para correr la aplicación
CMD ["node", "index.js"]


#### Paso 2: Crear el Archivo `index.js`

En el mismo directorio `app`, crea un archivo llamado `index.js` con el siguiente contenido:


const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const pool = new Pool({
  user: 'myuser',
  host: 'postgres_container', // Nombre del contenedor de PostgreSQL
  database: 'mydatabase',
  password: 'mypassword',
  port: 5432
});

app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al consultar la base de datos');
  }
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});


#### Paso 3: Crear el Archivo `package.json`

En el mismo directorio `app`, crea un archivo llamado `package.json` con el siguiente contenido:


{
  "name": "db-query-app",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "pg": "^8.5.1",
    "express": "^4.17.1"
  }
}


#### Paso 4: Construir y Ejecutar el Contenedor de la Aplicación

1. Abre una terminal y navega al directorio `app`.

  
   cd path/to/project-root/app
  

2. Construye la imagen de Docker:

  
   docker build -t my_node_app .


3. Ejecuta el contenedor:

   docker run -d --name node_app_container --link postgres_container:postgres_container -p 3000:3000 my_node_app
  

### 3. Verificar la Configuración

Abre un navegador web y visita `http://localhost:3000/users`. Deberías ver los datos de la tabla `users` en formato JSON.

## Notas

- Asegúrate de que Docker esté instalado y ejecutándose en tu máquina.
- Los contenedores deben estar vinculados correctamente para que la aplicación Node.js pueda conectarse a la base de datos PostgreSQL.

Si encuentras algún problema, revisa los logs de los contenedores para obtener más información:


docker logs postgres_container
docker logs node_app_container


