const { Pool } = require("pg");

if (!process.env.DATABASE_URL) {
  console.error(
    "Missing DATABASE_URL environment variable. Set it in .env locally, " +
    "or in the Render dashboard under Environment before deploying."
  );
  process.exit(1);
}

// Neon (and most managed Postgres providers) require SSL.
// rejectUnauthorized: false is the standard setting for Neon's connection
// string, since Node's default CA bundle doesn't always trust the chain.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Without this handler, a dropped idle connection (common with serverless
// Postgres providers like Neon, which recycle idle connections) can crash
// the whole Node process with an unhandled error.
pool.on("error", (err) => {
  console.error("Unexpected error on idle PostgreSQL client", err);
});

module.exports = pool;
