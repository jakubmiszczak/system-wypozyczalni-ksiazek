const db = require('../db/database');
const ClientBook = require('../models/ClientBook');

class ClientBookRepository {
    async create(borrowingModel) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO client_books (client_id, book_id, user_id, borrow_date, quantity, status)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            
            const params = [
                borrowingModel.client_id,
                borrowingModel.book_id,
                borrowingModel.user_id,
                borrowingModel.borrow_date,
                borrowingModel.quantity,
                borrowingModel.status
            ];

            db.run(sql, params, function(err) {
                if (err) reject(err);
                resolve(new ClientBook({ id: this.lastID, ...borrowingModel }));
            });
        });
    }

    async findAll(page = 1, limit = 10, userId = null) {
        return new Promise((resolve, reject) => {
            const offset = (page - 1) * limit;
            let sql = `
                SELECT cb.*, 
                       c.first_name, c.last_name,
                       b.title as book_title, b.author as book_author,
                       u.username
                FROM client_books cb
                JOIN clients c ON cb.client_id = c.id
                JOIN books b ON cb.book_id = b.id
                JOIN users u ON cb.user_id = u.id
            `;
            
            const params = [];
            if (userId) {
                sql += ' WHERE cb.user_id = ?';
                params.push(userId);
            }
            
            sql += ' ORDER BY cb.borrow_date DESC LIMIT ? OFFSET ?';
            params.push(limit, offset);
            
            db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                
                const borrowings = rows.map(row => ({
                    ...new ClientBook(row),
                    client_name: `${row.first_name} ${row.last_name}`,
                    book_title: row.book_title,
                    book_author: row.book_author
                }));
                
                const countSql = userId ? 
                    'SELECT COUNT(*) as total FROM client_books WHERE user_id = ?' :
                    'SELECT COUNT(*) as total FROM client_books';
                
                db.get(countSql, userId ? [userId] : [], (err, count) => {
                    if (err) reject(err);
                    resolve({
                        borrowings,
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

    async findById(id, userId = null) {
        return new Promise((resolve, reject) => {
            let sql = `
                SELECT cb.*, 
                       c.first_name, c.last_name,
                       b.title as book_title, b.author as book_author
                FROM client_books cb
                JOIN clients c ON cb.client_id = c.id
                JOIN books b ON cb.book_id = b.id
                WHERE cb.id = ?
            `;
            
            const params = [id];
            if (userId) {
                sql += ' AND cb.user_id = ?';
                params.push(userId);
            }

            db.get(sql, params, (err, row) => {
                if (err) reject(err);
                if (!row) resolve(null);
                resolve({
                    ...new ClientBook(row),
                    client_name: `${row.first_name} ${row.last_name}`,
                    book_title: row.book_title,
                    book_author: row.book_author
                });
            });
        });
    }

    async findByClientId(clientId, page = 1, limit = 10, userId = null) {
        return new Promise((resolve, reject) => {
            const offset = (page - 1) * limit;
            let sql = `
                SELECT cb.*, 
                       c.first_name, c.last_name,
                       b.title as book_title, b.author as book_author
                FROM client_books cb
                JOIN clients c ON cb.client_id = c.id
                JOIN books b ON cb.book_id = b.id
                WHERE cb.client_id = ?
            `;
            
            const params = [clientId];
            if (userId) {
                sql += ' AND cb.user_id = ?';
                params.push(userId);
            }
            
            sql += ' ORDER BY cb.borrow_date DESC LIMIT ? OFFSET ?';
            params.push(limit, offset);
            
            db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                
                const borrowings = rows.map(row => ({
                    ...new ClientBook(row),
                    client_name: `${row.first_name} ${row.last_name}`,
                    book_title: row.book_title,
                    book_author: row.book_author
                }));
                
                const countSql = userId ? 
                    'SELECT COUNT(*) as total FROM client_books WHERE client_id = ? AND user_id = ?' :
                    'SELECT COUNT(*) as total FROM client_books WHERE client_id = ?';
                
                db.get(countSql, userId ? [clientId, userId] : [clientId], (err, count) => {
                    if (err) reject(err);
                    resolve({
                        borrowings,
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

    async findByBookId(bookId, page = 1, limit = 10, userId = null) {
        return new Promise((resolve, reject) => {
            const offset = (page - 1) * limit;
            let sql = `
                SELECT cb.*, 
                       c.first_name, c.last_name,
                       b.title as book_title, b.author as book_author
                FROM client_books cb
                JOIN clients c ON cb.client_id = c.id
                JOIN books b ON cb.book_id = b.id
                WHERE cb.book_id = ?
            `;
            
            const params = [bookId];
            if (userId) {
                sql += ' AND cb.user_id = ?';
                params.push(userId);
            }
            
            sql += ' ORDER BY cb.borrow_date DESC LIMIT ? OFFSET ?';
            params.push(limit, offset);
            
            db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                
                const borrowings = rows.map(row => ({
                    ...new ClientBook(row),
                    client_name: `${row.first_name} ${row.last_name}`,
                    book_title: row.book_title,
                    book_author: row.book_author
                }));
                
                const countSql = userId ? 
                    'SELECT COUNT(*) as total FROM client_books WHERE book_id = ? AND user_id = ?' :
                    'SELECT COUNT(*) as total FROM client_books WHERE book_id = ?';
                
                db.get(countSql, userId ? [bookId, userId] : [bookId], (err, count) => {
                    if (err) reject(err);
                    resolve({
                        borrowings,
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

    async update(id, borrowingModel, userId = null) {
        return new Promise((resolve, reject) => {
            let sql = `UPDATE client_books 
                      SET client_id = ?, 
                          book_id = ?, 
                          borrow_date = ?, 
                          quantity = ?, 
                          status = ?
                      WHERE id = ?`;
            
            const params = [
                borrowingModel.client_id, 
                borrowingModel.book_id, 
                borrowingModel.borrow_date, 
                borrowingModel.quantity, 
                borrowingModel.status, 
                id
            ];

            if (userId) {
                sql += ' AND user_id = ?';
                params.push(userId);
            }

            db.run(sql, params, (err) => {
                if (err) reject(err);
                resolve(new ClientBook({ id, ...borrowingModel }));
            });
        });
    }

    async delete(id, userId = null) {
        return new Promise((resolve, reject) => {
            let sql = `DELETE FROM client_books WHERE id = ?`;
            const params = [id];
            
            if (userId) {
                sql += ' AND user_id = ?';
                params.push(userId);
            }

            db.run(sql, params, (err) => {
                if (err) reject(err);
                resolve({ id });
            });
        });
    }
}

module.exports = new ClientBookRepository(); 