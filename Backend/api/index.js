const express = require('express');
const cors = require('cors');
const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configurar CORS para permitir peticiones desde cualquier origen (común en despliegues)
app.use(cors());
app.use(express.json());

// Soporte para DATABASE_URL o VITE_DATABASE_URL
const dbUrl = process.env.DATABASE_URL || process.env.VITE_DATABASE_URL;
const sql = neon(dbUrl);

// ──────────────────────────────────────────────────────────
// RUTAS (Iguales a las anteriores)
// ──────────────────────────────────────────────────────────

app.get('/api/ganado', async (req, res) => {
  try {
    const rows = await sql`
      SELECT
        g.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', gv.id,
              'vacuna_id', gv.vacuna_id,
              'fecha_aplicacion', gv.fecha_aplicacion,
              'proxima_fecha', gv.proxima_fecha,
              'observaciones', gv.observaciones,
              'vacuna', json_build_object(
                'id', v.id,
                'nombre', v.nombre,
                'descripcion', v.descripcion,
                'frecuencia_dias', v.frecuencia_dias
              )
            )
          ) FILTER (WHERE gv.id IS NOT NULL),
          '[]'
        ) AS vacunaciones
      FROM ganado g
      LEFT JOIN ganado_vacunas gv ON gv.ganado_id = g.id
      LEFT JOIN vacunas v ON v.id = gv.vacuna_id
      GROUP BY g.id
      ORDER BY g.created_at DESC
    `;
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ganado', async (req, res) => {
  try {
    const { nombre, numero_identificacion, fecha_entrada, edad_entrada_meses, peso_inicial, estado } = req.body;
    const [row] = await sql`
      INSERT INTO ganado (nombre, numero_identificacion, fecha_entrada, edad_entrada_meses, peso_inicial, estado)
      VALUES (${nombre}, ${numero_identificacion}, ${fecha_entrada}, ${edad_entrada_meses}, ${peso_inicial}, ${estado})
      RETURNING *
    `;
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/ganado/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    const [row] = await sql`
      UPDATE ganado
      SET
        nombre = COALESCE(${fields.nombre ?? null}, nombre),
        numero_identificacion = COALESCE(${fields.numero_identificacion ?? null}, numero_identificacion),
        fecha_entrada = COALESCE(${fields.fecha_entrada ?? null}, fecha_entrada),
        edad_entrada_meses = COALESCE(${fields.edad_entrada_meses ?? null}, edad_entrada_meses),
        peso_inicial = COALESCE(${fields.peso_inicial ?? null}, peso_inicial),
        estado = COALESCE(${fields.estado ?? null}, estado)
      WHERE id = ${id}
      RETURNING *
    `;
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/ganado/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await sql`DELETE FROM ganado WHERE id = ${id}`;
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/vacunas', async (req, res) => {
  try {
    const rows = await sql`SELECT * FROM vacunas ORDER BY nombre`;
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/vacunas', async (req, res) => {
  try {
    const { nombre, descripcion, frecuencia_dias } = req.body;
    const [row] = await sql`
      INSERT INTO vacunas (nombre, descripcion, frecuencia_dias)
      VALUES (${nombre}, ${descripcion}, ${frecuencia_dias})
      RETURNING *
    `;
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/ganado-vacunas', async (req, res) => {
  try {
    const rows = await sql`
      SELECT
        gv.*,
        row_to_json(g) AS ganado,
        row_to_json(v) AS vacuna
      FROM ganado_vacunas gv
      LEFT JOIN ganado g ON g.id = gv.ganado_id
      LEFT JOIN vacunas v ON v.id = gv.vacuna_id
      ORDER BY gv.proxima_fecha ASC
    `;
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ganado-vacunas', async (req, res) => {
  try {
    const { ganado_id, vacuna_id, fecha_aplicacion, proxima_fecha, observaciones } = req.body;
    const [row] = await sql`
      INSERT INTO ganado_vacunas (ganado_id, vacuna_id, fecha_aplicacion, proxima_fecha, observaciones)
      VALUES (${ganado_id}, ${vacuna_id}, ${fecha_aplicacion}, ${proxima_fecha ?? null}, ${observaciones ?? null})
      RETURNING *
    `;
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/ganado-vacunas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await sql`DELETE FROM ganado_vacunas WHERE id = ${id}`;
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/avicultura-movimientos', async (req, res) => {
  try {
    const rows = await sql`SELECT * FROM avicultura_movimientos ORDER BY fecha DESC`;
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/avicultura-movimientos', async (req, res) => {
  try {
    const { tipo, fecha, descripcion, categoria, monto, numero_pollos } = req.body;
    const [row] = await sql`
      INSERT INTO avicultura_movimientos (tipo, fecha, descripcion, categoria, monto, numero_pollos)
      VALUES (${tipo}, ${fecha}, ${descripcion}, ${categoria}, ${monto}, ${numero_pollos ?? null})
      RETURNING *
    `;
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/avicultura-movimientos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await sql`DELETE FROM avicultura_movimientos WHERE id = ${id}`;
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/pollos', async (req, res) => {
  try {
    const rows = await sql`SELECT * FROM "Pollos" ORDER BY created_at DESC`;
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/pollos', async (req, res) => {
  try {
    const body = req.body;
    const keys = Object.keys(body);
    const [row] = await sql`
      INSERT INTO "Pollos" ${sql(body, keys)}
      RETURNING *
    `;
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/pollos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { Numero_pollos } = req.body;
    const [row] = await sql`
      UPDATE "Pollos"
      SET "Numero_pollos" = ${Numero_pollos}
      WHERE id = ${id}
      RETURNING *
    `;
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/categorias', async (req, res) => {
  try {
    const { sector } = req.query;
    let rows;
    if (sector) {
      rows = await sql`SELECT * FROM categorias WHERE sector = ${sector} ORDER BY nombre`;
    } else {
      rows = await sql`SELECT * FROM categorias ORDER BY nombre`;
    }
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Condición para ejecución local
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌱 Farm Insight API running on port ${PORT}`);
  });
}

// Exportar para Vercel
module.exports = app;
