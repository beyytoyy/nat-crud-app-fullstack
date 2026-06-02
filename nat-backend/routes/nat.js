  const express = require("express");
  const router = express.Router();
  const mysql = require("mysql2");

  const db = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "natdb",
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
  });

  // TEST CONNECTION
  db.getConnection((err, connection) => {
      if (err) {
          console.error("Database connection failed", err);
      } else {
          console.log("MYSQL connected successfully");
          connection.release();
      }
  });

  // GET ALL RECORDS
  router.get("/", (req, res) => {
      const query = `
        SELECT *
        FROM nat_records
        ORDER BY id DESC
      `;
    
      db.query(query, (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            error: err.message,
          });
        }
    
        res.json(results);
      });
    });
    
    // GET SINGLE RECORD
    router.get("/:id", (req, res) => {
      const query = `
        SELECT *
        FROM nat_records
        WHERE id = ?
      `;
    
      db.query(query, [req.params.id], (err, results) => {
        if (err)
          return res.status(500).json({
            error: err.message,
          });
    
        if (results.length === 0) {
          return res.status(404).json({
            error: "Record not found",
          });
        }
    
        res.json(results[0]);
      });
    });
    
    // CREATE RECORD
    router.post("/", (req, res) => {
      const {
        respondent_name,
        age,
        sex,
        ethnic,
        academic_performance,
        academic_description,
        iq,
        type_school,
        socio_economic_status,
        study_habit,
        nat_results,
      } = req.body;
    
      const query = `
        INSERT INTO nat_records (
          respondent_name,
          age,
          sex,
          ethnic,
          academic_performance,
          academic_description,
          iq,
          type_school,
          socio_economic_status,
          study_habit,
          nat_results
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
    
      db.query(
        query,
        [
          respondent_name,
          age,
          sex,
          ethnic,
          academic_performance,
          academic_description,
          iq,
          type_school,
          socio_economic_status,
          study_habit,
          nat_results,
        ],
        (err, results) => {
          if (err)
            return res.status(500).json({
              error: err.message,
            });
    
          res.status(201).json({
            id: results.insertId,
            message: "Record created successfully",
          });
        }
      );
    });
    
    // UPDATE RECORD
    router.put("/:id", (req, res) => {
      const {
        respondent_name,
        age,
        sex,
        ethnic,
        academic_performance,
        academic_description,
        iq,
        type_school,
        socio_economic_status,
        study_habit,
        nat_results,
      } = req.body;
    
      const query = `
        UPDATE nat_records
        SET
          respondent_name=?,
          age=?,
          sex=?,
          ethnic=?,
          academic_performance=?,
          academic_description=?,
          iq=?,
          type_school=?,
          socio_economic_status=?,
          study_habit=?,
          nat_results=?
        WHERE id=?
      `;
    
      db.query(
        query,
        [
          respondent_name,
          age,
          sex,
          ethnic,
          academic_performance,
          academic_description,
          iq,
          type_school,
          socio_economic_status,
          study_habit,
          nat_results,
          req.params.id,
        ],
        (err, results) => {
          if (err)
            return res.status(500).json({
              error: err.message,
            });
    
          res.json({
            message: "Record updated successfully",
          });
        }
      );
    });
    
    // DELETE RECORD
    router.delete("/:id", (req, res) => {
      db.query(
        "DELETE FROM nat_records WHERE id=?",
        [req.params.id],
        (err, results) => {
          if (err)
            return res.status(500).json({
              error: err.message,
            });
    
          res.json({
            message: "Record deleted successfully",
          });
        }
      );
    });
    
    module.exports = router;