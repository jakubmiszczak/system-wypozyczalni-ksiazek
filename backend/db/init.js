const db = require('./database');
const fs = require('fs');
const path = require('path');

const createTables = [
    {
        name: 'users',
        sql: `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            role TEXT NOT NULL DEFAULT 'user',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`
    },
    {
        name: 'clients',
        sql: `CREATE TABLE IF NOT EXISTS clients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            PESEL TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone_number TEXT NOT NULL
        )`
    },
    {
        name: 'books',
        sql: `CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            release_date DATE NOT NULL,
            genre TEXT NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            stock INTEGER NOT NULL DEFAULT 0
        )`
    },
    {
        name: 'client_books',
        sql: `CREATE TABLE IF NOT EXISTS client_books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_id INTEGER NOT NULL,
            book_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            borrow_date DATE NOT NULL,
            quantity INTEGER NOT NULL DEFAULT 1,
            status TEXT NOT NULL DEFAULT 'borrowed',
            FOREIGN KEY (client_id) REFERENCES clients (id),
            FOREIGN KEY (book_id) REFERENCES books (id),
            FOREIGN KEY (user_id) REFERENCES users (id)
        )`
    }
];

const initializeDatabase = async () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            console.log('Initializing database...');
            
            createTables.forEach(table => {
                db.run(table.sql, (err) => {
                    if (err) {
                        console.error(`Error creating ${table.name} table:`, err);
                        reject(err);
                        return;
                    }
                    console.log(`${table.name} table initialized`);
                });
            });

            db.get(
                `SELECT 
                    (SELECT COUNT(*) FROM clients) as clientCount,
                    (SELECT COUNT(*) FROM books) as bookCount,
                    (SELECT COUNT(*) FROM client_books) as borrowingCount,
                    (SELECT COUNT(*) FROM users) as userCount`,
                (err, counts) => {
                    if (err) {
                        console.error('Error checking database:', err);
                        reject(err);
                        return;
                    }
                    
                    if (!counts.clientCount && !counts.bookCount && !counts.borrowingCount && !counts.userCount) {
                        console.log('Database is empty, seeding initial data...');
                        const seedSQL = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
                        db.exec(seedSQL, (err) => {
                            if (err) {
                                console.error('Error seeding database:', err);
                                reject(err);
                            } else {
                                console.log('Database seeded successfully');
                                resolve();
                            }
                        });
                    } else {
                        console.log('Database already contains data, skipping seed');
                        resolve();
                    }
                }
            );
        });
    });
};

initializeDatabase().catch(console.error);

db.on('error', (err) => {
    console.error('Database error:', err);
});

process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('Database connection closed.');
        }
        process.exit();
    });
});

module.exports = db;
