const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function main() {
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/cloudkitchen_db';
  const client = new Client({ connectionString });

  try {
    await client.connect();
    const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await client.query(schema);
    console.log('Database initialized successfully.');

    // Seed demo user
    const demoEmail = 'customer@zepto.com';
    const demoPassword = 'zepto123';
    const passwordHash = await bcrypt.hash(demoPassword, 10);

    try {
      await client.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)',
        ['Demo Customer', demoEmail, passwordHash, 'customer']
      );
      console.log(`Demo user created: ${demoEmail} / ${demoPassword}`);
    } catch (err) {
      if (err.code === '23505') {
        console.log(`Demo user already exists: ${demoEmail}`);
      } else {
        throw err;
      }
    }
  } catch (error) {
    console.error('Failed to initialize database:', error.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main();
