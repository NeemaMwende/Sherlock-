// import pkg from "pg";
// const { Client } = pkg;

// export const client = new Client({
//   connectionString: process.env.DATABASE_URL,
//   ssl: true,
// });
// client.connect();

import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL!, {
  fetchOptions: {
    timeout: 10000,
  },
});
export default sql;
