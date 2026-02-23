const Book = require('../models/Book');

class CreateBookDTO {
    constructor(data) {
        this.title = data.title;
        this.author = data.author;
        this.release_date = data.release_date;
        this.genre = data.genre;
        this.price = parseFloat(data.price);
        this.stock = parseInt(data.stock) || 0;
    }

    toModel() {
        return new Book(this);
    }
}

class UpdateBookDTO {
    constructor(data) {
        this.title = data.title;
        this.author = data.author;
        this.release_date = data.release_date;
        this.genre = data.genre;
        this.price = parseFloat(data.price);
        this.stock = parseInt(data.stock);
    }

    toModel() {
        return new Book(this);
    }
}

class BookResponseDTO {
    constructor(book) {
        this.id = book.id;
        this.title = book.title;
        this.author = book.author;
        this.release_date = book.release_date;
        this.genre = book.genre;
        this.price = parseFloat(book.price).toFixed(2);
        this.stock = book.stock;
    }

    static fromModel(book) {
        return new BookResponseDTO(book);
    }

    static fromModelList(books) {
        return books.map(book => new BookResponseDTO(book));
    }
}

module.exports = {
    CreateBookDTO,
    UpdateBookDTO,
    BookResponseDTO
}; 