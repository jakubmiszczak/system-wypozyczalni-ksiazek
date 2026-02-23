const BookRepository = require('../repositories/bookRepository');
const ClientBookRepository = require('../repositories/clientBookRepository');
const { CreateBookDTO, UpdateBookDTO, BookResponseDTO } = require('../dtos/BookDTO');

class BookController {
    async createBook(req, res, next) {
        try {
            const bookDTO = new CreateBookDTO(req.body);
            const bookModel = bookDTO.toModel();
            
            try {
                bookModel.validate();
            } catch (error) {
                error.statusCode = 400;
                return next(error);
            }

            const book = await BookRepository.create(bookModel);
            res.status(201).json(BookResponseDTO.fromModel(book));
        } catch (error) {
            next(error);
        }
    }

    async getBooks(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await BookRepository.findAll(page, limit);
            
            return res.json({
                books: BookResponseDTO.fromModelList(result.books),
                pagination: result.pagination
            });
        } catch (error) {
            next(error);
        }
    }

    async getBook(req, res, next) {
        try {
            const book = await BookRepository.findById(req.params.id);
            if (!book) {
                const error = new Error('Book not found');
                error.statusCode = 404;
                return next(error);
            }
            res.json(BookResponseDTO.fromModel(book));
        } catch (error) {
            next(error);
        }
    }

    async updateBook(req, res, next) {
        try {
            const bookDTO = new UpdateBookDTO(req.body);
            const bookModel = bookDTO.toModel();
            
            try {
                bookModel.validate();
            } catch (error) {
                error.statusCode = 400;
                return next(error);
            }

            const book = await BookRepository.update(req.params.id, bookModel);
            res.json(BookResponseDTO.fromModel(book));
        } catch (error) {
            next(error);
        }
    }

    async deleteBook(req, res, next) {
        try {
            await BookRepository.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async getBookBorrowings(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const bookId = req.params.id;
            const userId = req.user.role === 'admin' ? null : req.user.id;

            const book = await BookRepository.findById(bookId);
            if (!book) {
                const error = new Error('Book not found');
                error.statusCode = 404;
                return next(error);
            }

            const result = await ClientBookRepository.findByBookId(bookId, page, limit, userId);
            
            return res.json({
                book: BookResponseDTO.fromModel(book),
                borrowings: result.borrowings,
                pagination: result.pagination
            });
        } catch (error) {
            next(error);
        }
    }

    async getBooksForSelect(req, res, next) {
        try {
            const books = await BookRepository.findAllForSelect();
            res.json(books);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new BookController(); 