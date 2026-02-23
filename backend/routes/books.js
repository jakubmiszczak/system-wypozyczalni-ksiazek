const express = require('express');
const router = express.Router();
const BookController = require('../controllers/bookController');
const auth = require('../middleware/auth');

router.get('/', BookController.getBooks);

router.get('/select-options', auth(['admin', 'user']), BookController.getBooksForSelect);

router.get('/:id/borrowings', auth(['admin', 'user']), BookController.getBookBorrowings);

router.get('/:id', BookController.getBook);

router.post('/', auth(['admin']), BookController.createBook);

router.put('/:id', auth(['admin']), BookController.updateBook);

router.delete('/:id', auth(['admin']), BookController.deleteBook);

module.exports = router; 