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
