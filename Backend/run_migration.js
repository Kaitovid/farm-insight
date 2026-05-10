const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: __dirname + '/.env' });
const sql = neon(process.env.DATABASE_URL);

async function migrate() {
  try {
    // AVICOLA
    await sql`
      UPDATE avicultura_movimientos SET sector = 'avicola' WHERE id IN (
        '0a727859-bf7f-446a-9786-cee20e1fe503',
        '131b9bdf-c750-4837-b9ec-d45f8ba5b826',
        '57666a71-690a-4a69-8153-18828e01a0d4',
        '5b5a800a-81ac-424b-937b-cb60335afa6c',
        '68c3a58a-62cc-4564-962b-8778eae9aa11',
        '76d714a5-cc60-45f8-80c4-408a9dd254d8',
        '78c2c8ec-ebe7-49e7-b030-ad10d7455759',
        '7913bbc5-e31b-4db1-bea5-21c50648f5e3',
        '8a290062-0eb9-49e4-b598-f8da52862da3',
        '9966a136-b8bb-42fe-aabf-7f1d2dea5c22',
        '9aad388d-2c10-474c-8549-0ca577ce08ae',
        'a9aa5fe6-75fb-40e2-af2b-11123dfb73ac',
        'a9d63811-5e7b-4734-a990-39b7b189a8be',
        'ac0d9468-4eb9-4eaa-b702-8e51b06c3973',
        'ac2942a2-1bce-4951-818b-0b2a5f39ad90',
        'adc74089-29aa-49cc-a390-9679489c8d06',
        'b57a9a0a-0890-4105-aba5-1269fb6a284e',
        'b5ab48e2-4742-46d4-a5c8-be37d30c28ff',
        'c9dca589-7e24-45ce-ad69-1b529a4c6dcb',
        'de9e1f29-4a55-4983-883f-fdc4ca455b1a',
        'e191a463-d7f0-424f-b4db-8715884d3126',
        'f7f7c009-f3e0-4f53-a34f-d503ab608ed4',
        '4ed5056b-baea-4fd7-a1e6-8e057812647e',
        '65ca4285-02ba-4060-98be-2bc2e0a56e0c',
        'f857b6d8-54e2-4c03-90cf-1ba22bc51c94'
      )
    `;
    console.log('✅ Avícola: 25 registros actualizados');

    // GANDERO
    await sql`
      UPDATE avicultura_movimientos SET sector = 'gandero' WHERE id IN (
        '20964726-6044-406b-8bd0-de3a7a14de11',
        'a8c737e1-b57a-445c-b6b2-18d3b4e666d6'
      )
    `;
    console.log('✅ Gandero: 2 registros actualizados');

    // FRUCTIFERO
    await sql`
      UPDATE avicultura_movimientos SET sector = 'fructifero' WHERE id IN (
        '3b7a2279-3796-4d8c-9337-265b52858f21',
        'c5b59ddc-575b-415d-8baa-b3501085f48d'
      )
    `;
    console.log('✅ Fructífero: 2 registros actualizados');

    // VERIFICACIÓN
    const summary = await sql`
      SELECT sector, COUNT(*) as total
      FROM avicultura_movimientos
      GROUP BY sector
      ORDER BY sector
    `;
    console.log('\n📊 Resumen por sector:');
    summary.forEach(r => console.log(`  ${r.sector}: ${r.total} movimiento(s)`));

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}
migrate();
