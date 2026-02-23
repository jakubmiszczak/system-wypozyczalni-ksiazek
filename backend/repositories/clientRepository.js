const db = require('../db/database');
const Client = require('../models/Client');

class ClientRepository {
    async create(clientModel) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO clients (first_name, last_name, PESEL, email, phone_number) 
                        VALUES (?, ?, ?, ?, ?)`;
            db.run(sql, 
                [clientModel.first_name, clientModel.last_name, clientModel.PESEL, 
                 clientModel.email, clientModel.phone_number], 
                function(err) {
                    if (err) reject(err);
                    resolve(new Client({ id: this.lastID, ...clientModel }));
                });
        });
    }

    async findAll(page = 1, limit = 10) {
        return new Promise((resolve, reject) => {
            const offset = (page - 1) * limit;
            const sql = `SELECT * FROM clients LIMIT ? OFFSET ?`;
            
            db.all(sql, [limit, offset], (err, rows) => {
                if (err) reject(err);
                
                const clients = rows.map(row => new Client(row));
                
                db.get('SELECT COUNT(*) as total FROM clients', (err, count) => {
                    if (err) reject(err);
                    resolve({
                        clients,
                        pagination: {
                            total: count.total,
                            currentPage: page,
                            totalPages: Math.ceil(count.total / limit)
                        }
                    });
                });
            });
        });
    }

    async findById(id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM clients WHERE id = ?`;
            db.get(sql, [id], (err, client) => {
                if (err) reject(err);
                resolve(client ? new Client(client) : null);
            });
        });
    }

    async update(id, clientModel) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE clients 
                        SET first_name = ?, last_name = ?, PESEL = ?, email = ?, phone_number = ?
                        WHERE id = ?`;
            db.run(sql, 
                [clientModel.first_name, clientModel.last_name, clientModel.PESEL, 
                 clientModel.email, clientModel.phone_number, id],
                (err) => {
                    if (err) reject(err);
                    resolve(new Client({ id, ...clientModel }));
                });
        });
    }

    async delete(id) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM clients WHERE id = ?`;
            db.run(sql, [id], (err) => {
                if (err) reject(err);
                resolve({ id });
            });
        });
    }

    async findAllForSelect() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT id, first_name, last_name 
                FROM clients 
                ORDER BY last_name, first_name
            `;
            
            db.all(sql, [], (err, rows) => {
                if (err) reject(err);
                resolve(rows.map(row => ({
                    id: row.id,
                    name: `${row.first_name} ${row.last_name}`
                })));
            });
        });
    }
}

module.exports = new ClientRepository(); 