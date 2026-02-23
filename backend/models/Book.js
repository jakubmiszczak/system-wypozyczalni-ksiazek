class Book {
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.author = data.author;
        this.release_date = data.release_date;
        this.genre = data.genre;
        this.price = data.price;
        this.stock = data.stock;
    }

    validate() {
        if (!this.title) throw new Error('Title is required');
        if (!this.author) throw new Error('Author is required');
        if (!this.release_date) throw new Error('Release date is required');
        if (!this.genre) throw new Error('Genre is required');
        if (!this.price) throw new Error('Price is required');
        
        const numericPrice = parseFloat(this.price);
        if (isNaN(numericPrice) || numericPrice <= 0) throw new Error('Price must be a positive number');
        if (numericPrice > 1000000) throw new Error('Price cannot exceed 1,000,000');
        
        const numericStock = parseInt(this.stock);
        if (isNaN(numericStock) || numericStock < 0) throw new Error('Stock cannot be negative');
        if (numericStock > 1000000) throw new Error('Stock cannot exceed 1,000,000');
    }
}

module.exports = Book; 