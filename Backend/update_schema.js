const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: __dirname + '/.env' });
const sql = neon(process.env.DATABASE_URL);

async function updateSchema() {
  try {
    console.log('Adding sector column to avicultura_movimientos...');
    await sql`ALTER TABLE avicultura_movimientos ADD COLUMN IF NOT EXISTS sector text DEFAULT 'avicola'`;
    console.log('Done. Column sector added (or already existed).');
  } catch (err) {
    console.error('Error:', err.message);
  }
}
updateSchema();
