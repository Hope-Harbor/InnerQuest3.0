// src/lib/db.ts
import { Pool } from 'pg';

const pool = new Pool({
  database: process.env.EMOTION_DB_NAME,
  user: process.env.EMOTION_DB_USER,
  password: process.env.EMOTION_DB_PASSWORD,
  host: process.env.EMOTION_DB_HOST,
  port: process.env.EMOTION_DB_PORT ? parseInt(process.env.EMOTION_DB_PORT, 10) : 5432,
});

export default pool;
