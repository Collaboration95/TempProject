const express = require('express');
const mysql = require('mysql2');
const app = express();

// Set up a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Mcqueen@$95',
  database: 'test_db'
});
const table_name = "regressionresult";

// Define a route to handle the SQL query and return the results as JSON
app.get('/api/sql-data', (req, res) => {
  const sqlHeader = 'SHOW COLUMNS FROM '+table_name;
  const sqlData = 'SELECT * FROM '+table_name;
  
  connection.query(sqlHeader, (error, headerResults, fields) => {
    if (error) throw error;

    connection.query(sqlData, (error, dataResults, fields) => {
      if (error) throw error;

      const header = headerResults.map(result => result.Field);
      const data = dataResults;

      const response = {
        header,
        data
      };

      res.json(response);
    });
  });
});

app.get('/api/sql-data-fail', (req, res) => {
  const sqlHeader = 'SHOW COLUMNS FROM '+table_name;
  const sqlData = `SELECT * FROM ${table_name} WHERE outcome='Failed'`;

  connection.query(sqlHeader, (error, headerResults, fields) => {
    if (error) throw error;

    connection.query(sqlData, (error, dataResults, fields) => {
      if (error) throw error;

      const header = headerResults.map(result => result.Field);
      const data = dataResults;

      const response = {
        header,
        data
      };

      res.json(response);
    });
  });
});

// // Serve the HTML, CSS, and JavaScript files
app.use(express.static('public'));

// Start the server on port 3001 (or another port of your choice)
app.listen(3001, () => {
  console.log('Server listening on port 3001');
});

