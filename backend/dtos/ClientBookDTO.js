const ClientBook = require('../models/ClientBook');

class CreateClientBookDTO {
    constructor(data) {
        this.client_id = data.client_id;
        this.book_id = data.book_id;
        this.user_id = data.user_id;
        this.borrow_date = data.borrow_date;
        this.quantity = data.quantity;
        this.status = data.status;
    }

    toModel() {
        return new ClientBook({
            client_id: this.client_id,
            book_id: this.book_id,
            user_id: this.user_id,
            borrow_date: this.borrow_date,
            quantity: this.quantity,
            status: this.status
        });
    }
}

class UpdateClientBookDTO {
    constructor(data) {
        this.client_id = data.client_id;
        this.book_id = data.book_id;
        this.user_id = data.user_id;
        this.borrow_date = data.borrow_date;
        this.status = data.status;
        this.quantity = data.quantity ? parseInt(data.quantity) : undefined;
    }

    toModel(existingModel) {
        return new ClientBook({
            ...existingModel,
            client_id: this.client_id || existingModel.client_id,
            book_id: this.book_id || existingModel.book_id,
            user_id: this.user_id || existingModel.user_id,
            borrow_date: this.borrow_date || existingModel.borrow_date,
            status: this.status || existingModel.status,
            quantity: this.quantity || existingModel.quantity
        });
    }
}

class ClientBookResponseDTO {
    constructor(clientBook) {
        this.id = clientBook.id;
        this.client_id = clientBook.client_id;
        this.book_id = clientBook.book_id;
        this.user_id = clientBook.user_id;
        this.borrow_date = clientBook.borrow_date;
        this.quantity = clientBook.quantity;
        this.status = clientBook.status;
        if (clientBook.client_name) this.client_name = clientBook.client_name;
        if (clientBook.book_title) this.book_title = clientBook.book_title;
        if (clientBook.book_author) this.book_author = clientBook.book_author;
        if (clientBook.username) this.username = clientBook.username;
    }

    static fromModel(clientBook) {
        return new ClientBookResponseDTO(clientBook);
    }

    static fromModelList(clientBooks) {
        return clientBooks.map(clientBook => new ClientBookResponseDTO(clientBook));
    }
}

module.exports = {
    CreateClientBookDTO,
    UpdateClientBookDTO,
    ClientBookResponseDTO
}; 