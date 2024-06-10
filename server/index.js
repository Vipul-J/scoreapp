const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection(config.mysql);
app.get("/", (req, res) => res.send("Express on Vercel"));

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to MySQL database');

    // Create tables if not exists
    const createTables = [
        'CREATE TABLE IF NOT EXISTS teams (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL)',
        'CREATE TABLE IF NOT EXISTS events (id INT AUTO_INCREMENT PRIMARY KEY, eventName VARCHAR(255) NOT NULL, facultyCoordinator VARCHAR(255) NOT NULL)',
        'CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL)',
        'CREATE TABLE IF NOT EXISTS team_scores (event_id INT, team_id INT, score INT, selected_round VARCHAR(255), FOREIGN KEY (event_id) REFERENCES events(id), FOREIGN KEY (team_id) REFERENCES teams(id))'
    ];
    

    // Execute each CREATE TABLE statement
    createTables.forEach(sql => {
        db.query(sql, (err, result) => {
            if (err) {
                console.error("Error creating tables:", err);
            } else {
                console.log('Table created or already exists');
            }
        });
    });
});

// ADMIN - Teams

app.post('/postTeam', (req, res) => {
    const team = { name: req.body.name };
    const sql = 'INSERT INTO teams SET ?';
    db.query(sql, team, (err, result) => {
        if (err) throw err;
        res.send('Team added...');
    });
});

app.get('/teams', (req, res) => {
    const sql = 'SELECT * FROM teams';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.put('/updateTeam/:id', (req, res) => {
    const id = req.params.id;
    const newName = req.body.name;

    const sql = 'UPDATE teams SET name = ? WHERE id = ?';
    db.query(sql, [newName, id], (err, result) => {
        if (err) throw err;
        res.send('Team updated...');
    });
});

app.delete('/deleteTeam/:id', (req, res) => {
    const id = req.params.id;

    const sql = 'DELETE FROM teams WHERE id = ?';
    db.query(sql, id, (err, result) => {
        if (err) throw err;
        res.send('Team deleted...');
    });
});

// ADMIN - Events

app.post('/postEvents', (req, res) => {
    const event = { eventName: req.body.eventName, facultyCoordinator: req.body.facultyCoordinator };
    const sql = 'INSERT INTO events SET ?';
    db.query(sql, event, (err, result) => {
        if (err) throw err;
        res.send('Event added...');
    });
});

app.get('/events', (req, res) => {
    const sql = 'SELECT * FROM events';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.put('/updateEvent/:id', (req, res) => {
    const id = req.params.id;
    const { eventName, facultyCoordinator } = req.body;

    const sql = 'UPDATE events SET eventName = ?, facultyCoordinator = ? WHERE id = ?';
    db.query(sql, [eventName, facultyCoordinator, id], (err, result) => {
        if (err) throw err;
        res.send('Event updated...');
    });
});

app.delete('/deleteEvent/:id', (req, res) => {
    const id = req.params.id;

    const sql = 'DELETE FROM events WHERE id = ?';
    db.query(sql, id, (err, result) => {
        if (err) throw err;
        res.send('Event deleted...');
    });
});

// ADMIN - Users

app.post('/register', (req, res) => {
    const { username, password } = req.body;

    const sqlCheckUser = 'SELECT * FROM users WHERE username = ?';
    db.query(sqlCheckUser, [username], (err, results) => {
        if (err) {
            console.error('Error checking username:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (results.length > 0) {
            return res.status(400).json({ error: 'Username already taken' });
        }

        const sqlInsertUser = 'INSERT INTO users (username, password) VALUES (?, ?)';
        db.query(sqlInsertUser, [username, password], (err, result) => {
            if (err) {
                console.error('Error registering user:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.status(201).json({ message: 'User registered successfully', user: { username, password } });
        });
    });
});

app.get('/users', (req, res) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], (err, results) => {
        if (err) {
            console.error('Error logging in:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const user = results[0];
        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        res.json({ message: 'Login successful', user: { username: user.username } });
    });
});

app.delete('/deleteUser/:id', (req, res) => {
    const userId = req.params.id;

    const sql = 'DELETE FROM users WHERE id = ?';
    db.query(sql, userId, (err, result) => {
        if (err) {
            console.error('Error deleting user:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.send('User deleted successfully');
    });
});

// SCORER - MarkScore

app.get('/faculty-coordinator/:id', (req, res) => {
    const eventId = req.params.id;
    const sql = 'SELECT facultyCoordinator FROM events WHERE id = ?';
    db.query(sql, [eventId], (err, results) => {
        if (err) {
            console.error('Error fetching faculty coordinator:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json({ coordinator: results[0].facultyCoordinator });
    });
});

// Server-side code

// SCORER - MarkScore

app.post('/score', (req, res) => {
    const { eventId, selectedRound, teams } = req.body;

    // Validate input
    if (!eventId || !selectedRound || !teams || !Array.isArray(teams)) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    // Check if scores have already been submitted for the selected round and event
    const checkExistingScoresQuery = 'SELECT * FROM team_scores WHERE event_id = ? AND selected_round = ? LIMIT 1';
    db.query(checkExistingScoresQuery, [eventId, selectedRound], (err, results) => {
        if (err) {
            console.error('Error checking existing scores:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (results.length > 0) {
            return res.status(400).json({ error: 'Scores have already been submitted for this round and event. Please go to admin and verify.' });
        }

        // Insert team scores into 'team_scores' table
        const teamInsertPromises = teams.map(({ id, score }) => {
            return new Promise((resolve, reject) => {
                const insertTeamScoreQuery = 'INSERT INTO team_scores (event_id, team_id, score, selected_round) VALUES (?, ?, ?, ?)';
                db.query(insertTeamScoreQuery, [eventId, id, score, selectedRound], (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        });

        Promise.all(teamInsertPromises)
            .then(() => {
                res.status(200).json({ message: 'Score submitted successfully' });
            })
            .catch((err) => {
                console.error('Error inserting team scores:', err);
                res.status(500).json({ error: 'Internal server error' });
            });
    });
});

app.get('/team-scores/:eventId/:selectedRound', (req, res) => {
    const { eventId, selectedRound } = req.params;

    const sql = `
        SELECT ts.team_id, t.name as team_name, ts.score, ts.selected_round
        FROM team_scores ts
        JOIN teams t ON ts.team_id = t.id
        WHERE ts.event_id = ? AND ts.selected_round = ?
    `;
    db.query(sql, [eventId, selectedRound], (err, results) => {
        if (err) {
            console.error('Error fetching team scores:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
