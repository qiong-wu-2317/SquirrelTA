const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'db', 'squirrel.sqlite3');

// Create a new SQLite database in the 'db' directory
const db = new sqlite3.Database(dbPath);

// Function to generate a random integer between min and max
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Function to generate a random name
const getRandomName = () => {
    const names = ['Squeaky', 'Rusty', 'Chippy', 'Nutty', 'Whiskers', 'Fuzzy', 'Scurry', 'Chomp', 'Squeal', 'Twitch'];
    return names[Math.floor(Math.random() * names.length)];
};

// Function to generate a random species
const getRandomSpecies = () => {
    const species = ['Eastern Gray', 'Fox', 'Red', 'Flying', 'Southern Flying'];
    return species[Math.floor(Math.random() * species.length)];
};

// Create table and insert random data
db.serialize(() => {
    // Create the table
    db.run(`
        CREATE TABLE IF NOT EXISTS squirrel (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            age INTEGER,
            species TEXT
        )
    `);

    // Insert 10 random records
    const stmt = db.prepare('INSERT INTO squirrel (name, age, species) VALUES (?, ?, ?)');
    for (let i = 0; i < 10; i++) {
        stmt.run(getRandomName(), getRandomInt(1, 10), getRandomSpecies());
    }
    stmt.finalize();

    // Query the table to confirm insertion
    db.each('SELECT * FROM squirrel', (err, row) => {
        if (err) {
            console.error(err.message);
            return;
        }
        console.log(`${row.id}: ${row.name}, Age: ${row.age}, Species: ${row.species}`);
    });
});

// Close the database connection
db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Database connection closed.');
});