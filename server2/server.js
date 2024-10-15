const http = require("http");
const url = require("url");
const db = require("./db");
require("dotenv").config();

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  // Set CORS headers to allow requests from anywhere
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle OPTIONS requests (for CORS preflight)
  if (req.method === "OPTIONS") {
    res.writeHead(204); // No Content
    res.end();
    return;
  }

  if (req.method === "POST" && parsedUrl.pathname === "/insert") {
    insertPatient(res);
  } else if (req.method === "GET" && parsedUrl.pathname === "/query") {
    const sql = parsedUrl.query.sql;
    if (sql.toUpperCase().startsWith("SELECT")) {
      executeSelectQuery(sql, res);
    } else {
      sendResponse(res, 403, { error: "Only SELECT queries are allowed." });
    }
  } else {
    sendResponse(res, 404, { error: "Not Found" });
  }
});

// Function to insert a new patient (dummy data)
function insertPatient(res) {
  const insertQuery =

    "INSERT INTO patient (name, age, address) VALUES ('John Doe', 30, '123 Street Name')";
  db.executeQuery(insertQuery, (err, result) => {
    if (err) {
      sendResponse(res, 500, { error: "Database insert error" });
    } else {
      sendResponse(res, 200, {
        message: "Patient inserted successfully",
        result,
      });
    }
  });
}



// Function to execute SELECT queries
function executeSelectQuery(sql, res) {
  db.executeQuery(sql, (err, results) => {
    if (err) {
      sendResponse(res, 500, { error: "Database query error" });
    } else {
      sendResponse(res, 200, results.rows);
    }
  });
}

// Function to send JSON response
function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // Ensure CORS is enabled on all responses
  });
  res.end(JSON.stringify(data));
}

// Start the server
server.listen(80, () => {
  console.log("Server running on port 80.");
});
