const db = require('../db/database');
const User = require('../models/User');

class UserRepository {
    async create(userModel) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO users (username, password, email, role) 
                        VALUES (?, ?, ?, ?)`;
            db.run(sql, 
                [userModel.username, userModel.password, userModel.email, userModel.role],
                async function(err) {
                    if (err) reject(err);
                    const user = await new UserRepository().findById(this.lastID);
                    resolve(user);
                });
        });
    }

    async findByUsername(username) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE username = ?';
            db.get(sql, [username], (err, row) => {
                if (err) reject(err);
                resolve(row ? new User(row) : null);
            });
        });
    }

    async findByEmail(email) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE email = ?';
            db.get(sql, [email], (err, row) => {
                if (err) reject(err);
                resolve(row ? new User(row) : null);
            });
        });
    }

    async findById(id) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT *
                FROM users
                WHERE id = ?
            `;
            
            db.get(sql, [id], (err, row) => {
                if (err) reject(err);
                if (!row) {
                    resolve(null);
                    return;
                }
                resolve(new User(row));
            });
        });
    }
}

module.exports = new UserRepository(); 