// Load required modules
const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');

// PostgreSQL setup
const { Pool } = require('pg');
const connectionString = `postgres://postgres:CTI_110_WakeTech@localhost/Gradebook`;
const pool = new Pool({ connectionString: connectionString });

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Route for the main HTML page
router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'MalakhiHicks_gradebook.html'));
});

app.use("/", router);

// API route to get grades
router.get('/api/grades', async function (req, res) {
    try {
        const result = await pool.query(`
            SELECT Students.student_id, first_name, last_name, AVG(assignments.grade) as total_grade
            FROM Students
            LEFT JOIN Assignments ON Assignments.student_id = Students.student_id
            GROUP BY Students.student_id
            ORDER BY total_grade DESC
        `);

        if (!result || !result.rows) {
            console.error("No result returned from query.");
            return res.status(500).send("No data returned from database.");
        }

        result.rows.forEach(row => {
            console.log(`Student Name: ${row.first_name} ${row.last_name}`);
            console.log(`Grade: ${row.total_grade}`);
        });

        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Database query failed:", err);
        res.status(500).send("Database query failed.");
    }
});

// Start server
let server = app.listen(3000, function () {
    console.log("App Server via Express is listening on port 3000");
    console.log("To quit, press CTRL + C");
});
