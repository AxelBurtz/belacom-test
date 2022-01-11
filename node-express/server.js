const sqlite3 = require('sqlite3');
const express = require("express");
var app = express();
const cors = require("cors");

// add to connect the server with the client
app.use(cors());
// add to translate the json in the front
app.use(express.json());

// create db
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error("Error opening database " + err.message);
  } else {

    db.run('CREATE TABLE customers( \
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,\
            last_name NVARCHAR(20)  NOT NULL,\
            first_name NVARCHAR(20)  NOT NULL,\
            title NVARCHAR(20),\
            age INTEGER\
        )', (err) => {
      if (err) {
        console.log("Table already exists.");
      }
      // example and insert into db
      let insert = 'INSERT INTO customers (last_name, first_name, title, age) VALUES (?,?,?,?)';
      db.run(insert, ["Axel", "Burtz", "developeur",27 ]);
      db.run(insert, ["Jack", "nicholson", "CEO",84 ]);
      db.run(insert, ["Emma", "Watson", "CFO", 31 ]);
    });
  }
});

// method show
app.get("/customers/:id", (req, res, next) => {
  var params = [req.params.id]
  db.get("SELECT * FROM customers where id = ?", [req.params.id], (err, row) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.status(200).json(row);
  });
});

// method all
app.get("/customers", (req, res, next) => {
  db.all("SELECT * FROM customers", [], (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.status(200).json({ rows });
  });
});

// method create
app.post("/create/", (req, res, next) => {
  db.run("INSERT INTO customers (last_name, first_name, title, age) VALUES (?,?,?,?)",
    [req.body.last_name, req.body.first_name, req.body.title, req.body.age],
    function (err, result) {
      if (err) {
        res.status(400).json({ "error": err.message })
        return;
      }
      res.status(201).json({
        "id": this.lastID
      })
    });
});

// method update
app.patch("/update", (req, res, next) => {
  db.run(`UPDATE customers SET last_name = ?, first_name = ?, title = ?, age = ? WHERE id = ?`,
    [req.body.last_name, req.body.first_name, req.body.title, req.body.age, req.body.id],
    function (err, result) {
      if (err) {
        res.status(400).json({ "error": res.message })
        return;
      }
      res.status(200).json({ updatedID: this.changes });
    });
});

// method delete
app.delete("/delete/:id", (req, res, next) => {
  const id = req.params.id
  db.run(`DELETE FROM customers WHERE id = ?`,
    id,
    function (err, result) {
      if (err) {
        res.status(400).json({ "error": res.message })
        return;
      }
      res.status(200).json({ deletedID: this.changes })
    });
});


const HTTP_PORT = 8000
app.listen(HTTP_PORT, () => {
  console.log("Server is listening on port " + HTTP_PORT);
});
