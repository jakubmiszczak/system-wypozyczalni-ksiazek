const db = require('../db/database');
const Book = require('../models/Book');

class BookRepository {
    async create(bookModel) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO books (title, author, release_date, genre, price, stock) 
                        VALUES (?, ?, ?, ?, ?, ?)`;
            db.run(sql, 
                [bookModel.title, bookModel.author, bookModel.release_date, 
                 bookModel.genre, bookModel.price, bookModel.stock], 
                function(err) {
                    if (err) reject(err);
                    resolve(new Book({ id: this.lastID, ...bookModel }));
                });
        });
    }

    async findAll(page = 1, limit = 10) {
        return new Promise((resolve, reject) => {
            const offset = (page - 1) * limit;
            const sql = `SELECT * FROM books LIMIT ? OFFSET ?`;
            
            db.all(sql, [limit, offset], (err, rows) => {
                if (err) reject(err);
                
                const books = rows.map(row => new Book(row));
                
                db.get('SELECT COUNT(*) as total FROM books', (err, count) => {
                    if (err) reject(err);
                    resolve({
                        books,
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
            const sql = `SELECT * FROM books WHERE id = ?`;
            db.get(sql, [id], (err, book) => {
                if (err) reject(err);
                resolve(book ? new Book(book) : null);
            });
        });
    }

    async update(id, bookModel) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE books 
                        SET title = ?, author = ?, release_date = ?, genre = ?, price = ?, stock = ?
                        WHERE id = ?`;
            db.run(sql, 
                [bookModel.title, bookModel.author, bookModel.release_date, 
                 bookModel.genre, bookModel.price, bookModel.stock, id],
                (err) => {
                    if (err) reject(err);
                    resolve(new Book({ id, ...bookModel }));
                });
        });
    }

    async delete(id) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM books WHERE id = ?`;
            db.run(sql, [id], (err) => {
                if (err) reject(err);
                resolve({ id });
            });
        });
    }

    async updateStock(id, quantityChange) {
        return new Promise((resolve, reject) => {
            const sql = `
                UPDATE books 
                SET stock = stock + ? 
                WHERE id = ?
            `;
            
            db.run(sql, [quantityChange, id], (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }

    async findAllForSelect() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT id, title, stock 
                FROM books 
                ORDER BY title
            `;
            
            db.all(sql, [], (err, rows) => {
                if (err) reject(err);
                resolve(rows.map(row => ({
                    id: row.id,
                    title: row.title,
                    stock: row.stock
                })));
            });
        });
    }
}

module.exports = new BookRepository(); 