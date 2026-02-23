var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const initDb = require('./db/init');

const booksRouter = require('./routes/books');
const clientsRouter = require('./routes/clients');
const clientBooksRouter = require('./routes/clientBooks');
const errorHandler = require('./middleware/errorHandler');
const authRouter = require('./routes/auth');

var app = express();

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let dbInitialized = false;

app.use(async (req, res, next) => {
    try {
        if (!dbInitialized) {
            await initDb;
            dbInitialized = true;
        }
        next();
    } catch (error) {
        next(error);
    }
});

app.use('/api/books', booksRouter);
app.use('/api/clients', clientsRouter);
app.use('/api/borrowings', clientBooksRouter);
app.use('/api/auth', authRouter);

app.use((req, res, next) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

app.use(errorHandler);

module.exports = app;
