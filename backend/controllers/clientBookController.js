const ClientBookRepository = require('../repositories/clientBookRepository');
const BookRepository = require('../repositories/bookRepository');
const ClientRepository = require('../repositories/clientRepository');
const { CreateClientBookDTO, UpdateClientBookDTO, ClientBookResponseDTO } = require('../dtos/ClientBookDTO');
const { BookResponseDTO } = require('../dtos/BookDTO');
const { ClientResponseDTO } = require('../dtos/ClientDTO');
const UserRepository = require('../repositories/userRepository');

class ClientBookController {
    async createBorrowing(req, res, next) {
        try {
            const borrowingDTO = new CreateClientBookDTO({
                ...req.body,
                user_id: req.user.id
            });
            const borrowingModel = borrowingDTO.toModel();
            
            try {
                borrowingModel.validate();
            } catch (error) {
                error.statusCode = 400;
                return next(error);
            }

            const book = await BookRepository.findById(borrowingModel.book_id);
            if (book.stock < borrowingModel.quantity) {
                const error = new Error('Not enough books in stock');
                error.statusCode = 400;
                return next(error);
            }

            await BookRepository.updateStock(borrowingModel.book_id, -borrowingModel.quantity);
            
            const borrowing = await ClientBookRepository.create(borrowingModel);
            res.status(201).json(ClientBookResponseDTO.fromModel(borrowing));
        } catch (error) {
            next(error);
        }
    }

    async getBorrowings(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const userId = req.user.role === 'admin' ? null : req.user.id;
            
            let result;
            if (req.query.clientId) {
                result = await ClientBookRepository.findByClientId(req.query.clientId, page, limit, userId);
            } else if (req.query.bookId) {
                result = await ClientBookRepository.findByBookId(req.query.bookId, page, limit, userId);
            } else {
                result = await ClientBookRepository.findAll(page, limit, userId);
            }
            
            return res.json({
                borrowings: ClientBookResponseDTO.fromModelList(result.borrowings),
                pagination: result.pagination
            });
        } catch (error) {
            next(error);
        }
    }

    async updateBorrowing(req, res, next) {
        try {
            const userId = req.user.role === 'admin' ? null : req.user.id;
            const existing = await ClientBookRepository.findById(req.params.id, userId);
            
            if (!existing) {
                const error = new Error('Borrowing not found');
                error.statusCode = 404;
                return next(error);
            }

            const borrowingDTO = new UpdateClientBookDTO({
                ...req.body,
                user_id: existing.user_id
            });
            const borrowingModel = borrowingDTO.toModel(existing);

            let stockChange = 0;

            if (existing.status !== borrowingModel.status) {
                stockChange = borrowingModel.status === 'returned' ? 
                    borrowingModel.quantity :
                    -borrowingModel.quantity;
            }
            else if (borrowingModel.status === 'borrowed' && existing.quantity !== borrowingModel.quantity) {
                stockChange = existing.quantity - borrowingModel.quantity;
            }

            if (stockChange !== 0) {
                const book = await BookRepository.findById(borrowingModel.book_id);
                if (book.stock + stockChange < 0) {
                    const error = new Error('Not enough books in stock');
                    error.statusCode = 400;
                    return next(error);
                }
                
                await BookRepository.updateStock(borrowingModel.book_id, stockChange);
            }
            
            const borrowing = await ClientBookRepository.update(req.params.id, borrowingModel, userId);
            res.json(ClientBookResponseDTO.fromModel(borrowing));
        } catch (error) {
            next(error);
        }
    }

    async deleteBorrowing(req, res, next) {
        try {
            const userId = req.user.role === 'admin' ? null : req.user.id;
            const existing = await ClientBookRepository.findById(req.params.id, userId);
            
            if (!existing) {
                const error = new Error('Borrowing not found');
                error.statusCode = 404;
                return next(error);
            }

            await ClientBookRepository.delete(req.params.id, userId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async getBorrowingDetails(req, res, next) {
        try {
            const userId = req.user.role === 'admin' ? null : req.user.id;
            const borrowing = await ClientBookRepository.findById(req.params.id, userId);
            if (!borrowing) {
                const error = new Error('Borrowing not found');
                error.statusCode = 404;
                return next(error);
            }

            const [book, client, user] = await Promise.all([
                BookRepository.findById(borrowing.book_id),
                ClientRepository.findById(borrowing.client_id),
                UserRepository.findById(borrowing.user_id)
            ]);

            res.json({
                borrowing: {
                    ...ClientBookResponseDTO.fromModel(borrowing),
                    username: user.username
                },
                book: BookResponseDTO.fromModel(book),
                client: ClientResponseDTO.fromModel(client)
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ClientBookController(); 