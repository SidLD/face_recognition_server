require('dotenv').config();
const { Client } = require('pg');

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const client = new Client({
  connectionString: SUPABASE_URL,
});
client.connect().then(() => console.log('Connected successfully'))
.catch((e: { stack: any; }) => console.error('Connection error', e.stack))
.finally(() => client.end());

export default client;