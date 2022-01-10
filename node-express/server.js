const sqlite3 = require('sqlite3');
const express = require("express");
var app = express();

const HTTP_PORT = 8000
app.listen(HTTP_PORT, () => {
  console.log("Server is listening on port " + HTTP_PORT);
});

const db = new sqlite3.Database('./emp_database.db', (err) => {
  if (err) {
    console.error("Erro opening database " + err.message);
  } else {

    // create db
    db.run('CREATE TABLE employees( \
            employee_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,\
            last_name NVARCHAR(20)  NOT NULL,\
            first_name NVARCHAR(20)  NOT NULL,\
            title NVARCHAR(20),\
            age INTEGER\
        )', (err) => {
      if (err) {
        console.log("Table already exists.");
      }
      // example and insert into db
      let insert = 'INSERT INTO employees (last_name, first_name, title, age) VALUES (?,?,?,?)';
      db.run(insert, ["Axel", "Burtz", "developeur",27 ]);
      db.run(insert, ["Jack", "nicholson", "CEO",84 ]);
      db.run(insert, ["Emma", "Watson", "CFO", 31 ]);
    });
  }
});

// method show
app.get("/employees/:id", (req, res, next) => {
  var params = [req.params.id]
  db.get("SELECT * FROM employees where employee_id = ?", [req.params.id], (err, row) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.status(200).json(row);
  });
});

// method all
app.get("/employees", (req, res, next) => {
  db.all("SELECT * FROM employees", [], (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.status(200).json({ rows });
  });
});

// method create
app.post("/employees/", (req, res, next) => {
  var reqBody = req.body;
  db.run("INSERT INTO employees (last_name, first_name, title, age) VALUES (?,?,?,?)",
    [reqBody.last_name, reqBody.first_name, reqBody.title, reqBody.age],
    function (err, result) {
      if (err) {
        res.status(400).json({ "error": err.message })
        return;
      }
      res.status(201).json({
        "employee_id": this.lastID
      })
    });
});

// method update
app.patch("/employees/", (req, res, next) => {
  var reqBody = req.body;
  db.run(`UPDATE employees set last_name = ?, first_name = ?, title = ?, age = ? WHERE employee_id = ?`,
    [reqBody.last_name, reqBody.first_name, reqBody.title, reqBody.age, reqBody.employee_id],
    function (err, result) {
      if (err) {
        res.status(400).json({ "error": res.message })
        return;
      }
      res.status(200).json({ updatedID: this.changes });
    });
});

// method delete
app.delete("/employees/:id", (req, res, next) => {
  db.run(`DELETE FROM user WHERE id = ?`,
    req.params.id,
    function (err, result) {
      if (err) {
        res.status(400).json({ "error": res.message })
        return;
      }
      res.status(200).json({ deletedID: this.changes })
    });
});
