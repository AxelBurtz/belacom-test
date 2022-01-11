const sqlite3 = require('sqlite3');
const express = require("express");
var app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

// create db
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error("Error opening database " + err.message);
  } else {

    db.run('CREATE TABLE customers( \
            customer_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,\
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
  db.get("SELECT * FROM customers where customer_id = ?", [req.params.id], (err, row) => {
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

  const last_name = req.body.last_name
  const first_name = req.body.first_name
  const title = req.body.title
  const age = req.body.age

  db.run("INSERT INTO customers (last_name, first_name, title, age) VALUES (?,?,?,?)",
    [req.body.last_name, req.body.first_name, req.body.title, req.body.age],
    function (err, result) {
      if (err) {
        res.status(400).json({ "error": err.message })
        return;
      }
      res.status(201).json({
        "customer_id": this.lastID
      })
    });
});

// method update
app.patch("/customers/", (req, res, next) => {
  var reqBody = req.body;
  db.run(`UPDATE customers set last_name = ?, first_name = ?, title = ?, age = ? WHERE customer_id = ?`,
    [reqBody.last_name, reqBody.first_name, reqBody.title, reqBody.age, reqBody.customer_id],
    function (err, result) {
      if (err) {
        res.status(400).json({ "error": res.message })
        return;
      }
      res.status(200).json({ updatedID: this.changes });
    });
});

// method delete
app.delete("/customers/:id", (req, res, next) => {
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


const HTTP_PORT = 8000
app.listen(HTTP_PORT, () => {
  console.log("Server is listening on port " + HTTP_PORT);
});
