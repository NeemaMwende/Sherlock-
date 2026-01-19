import pkg from "pg";
const { Client } = pkg;

export const client = new Client({
  connectionString: process.env.DATABASE_URL,
});
client.connect();
