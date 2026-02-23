class ClientBook {
    constructor(data) {
        this.id = data.id;
        this.client_id = data.client_id;
        this.book_id = data.book_id;
        this.user_id = data.user_id;
        this.borrow_date = data.borrow_date || new Date().toISOString().split('T')[0];
        this.quantity = data.quantity || 1;
        this.status = data.status || 'borrowed';
    }

    validate() {
        if (!this.client_id) throw new Error('Client ID is required');
        if (!this.book_id) throw new Error('Book ID is required');
        if (!this.user_id) throw new Error('User ID is required');
        
        const numericQuantity = parseInt(this.quantity);
        if (isNaN(numericQuantity)) throw new Error('Quantity must be a number');
        if (numericQuantity < 1) throw new Error('Quantity must be at least 1');
        if (numericQuantity > 1000) throw new Error('Quantity cannot exceed 1000');
        
        if (!['borrowed', 'returned'].includes(this.status)) {
            throw new Error('Status must be either borrowed or returned');
        }
    }
}

module.exports = ClientBook; 