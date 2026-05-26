import fs from 'fs';
import path from 'path';
import { pool } from '../src/config/db';

async function setupDatabase() {
  console.log('Starting database setup...');
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing schema.sql...');
    await pool.query(schemaSql);
    console.log('Database tables and indexes created successfully.');
  } catch (error) {
    console.error('Error during database setup:', error);
    process.exit(1);
  } finally {
    await pool.end();
    console.log('Database connection pool closed.');
  }
}

setupDatabase();
