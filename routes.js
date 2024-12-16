import express from "express";
import sqlite3 from "sqlite3";

const router = express.Router();
const db = new sqlite3.Database("./database.sqlite");

db.serialize(() => {
  db.run(`
      CREATE TABLE IF NOT EXISTS cars (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        brand TEXT ,
        model TEXT ,
        color TEXT ,
        year INTEGER
      )
    `);
});

router.get("/cars", (req, res) => {
  db.all("SELECT * FROM cars;", (err, car) => {
    if (err) return res.status(500).json({ message: err.message });
    res.status(200).json(car);
  });
});

router.get("/cars/:id", (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM cars WHERE id = ?;", [id], (err, car) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!car) return res.status(404).json({ message: "404 no car" });
    res.status(200).json(car);
  });
});

router.post("/cars", (req, res) => {
  const { brand, model, color, year } = req.body;

  db.run(
    `INSERT INTO cars (brand, model, color, year) VALUES (?, ?, ?, ?)`,
    [brand, model, color, year],
    function (err) {
      if (err) return res.status(500).json({ message: err.message });
      res.status(201).json({brand, model, color, year });
    }
  );
});

router.put("/cars/:id", (req, res) => {
  const id = req.params.id;
  const { brand, model, color, year } = req.body;

  db.get("SELECT * FROM cars WHERE id = ?;", [id], (err, car) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!car) return res.status(404).json({ message: "404 car not found" });

    db.run(
      `UPDATE cars SET brand = ?, model = ?, color = ?, year = ? WHERE id = ?`,
      [brand, model, color, year, id],
      function (err) {
        if (err) return res.status(500).json({ message: err.message });
        res.status(200).json({brand, model, color, year });
      }
    );
  });
});

router.delete("/cars/:id", (req, res) => {
  const id = req.params.id;

  db.get("SELECT * FROM cars WHERE id = ?;", [id], (err, car) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!car) return res.status(404).json({ message: "404 car not found" });

    db.run("DELETE FROM cars WHERE id = ?;", [id], (err) => {
      if (err) return res.status(500).json({ message: err.message });
      res.sendStatus(204);
    });
  });
});

export default router;
