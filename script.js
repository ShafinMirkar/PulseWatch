import { pool } from "./src/lib/db.js"

async function main() {
  const users = await pool.query("SELECT * FROM Monitor ")
    console.log(users);
}

main().then(() => pool.end())