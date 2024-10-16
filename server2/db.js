const { Pool } = require("pg");

// Database connection configuration
class Database {
  constructor() {
    console.log(process.env.POSTGRES_URL)
    this.pool = new Pool({
      connectionString:
        "postgres://default:va2sQXOhUyE3@ep-soft-poetry-a4fihvg0-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require", // Use your environment variable
    });

    this.createTableIfNotExists();
  }

  // Create table if it doesn't exist
  createTableIfNotExists() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS patient (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        age INT,
        address VARCHAR(255)
      );
    `;

    this.pool.query(createTableQuery, (err, result) => {
      if (err) {
        console.error("Error creating table: ", err);
      } else {
        console.log('Table "patient" created or already exists.');
      }
    });
  }

  // Method to execute SQL queries
  executeQuery(sql, params, callback) {
    this.pool.query(sql, params, (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }

  // Close the database connection
  close() {
    this.pool.end();
  }
}

module.exports = new Database();
