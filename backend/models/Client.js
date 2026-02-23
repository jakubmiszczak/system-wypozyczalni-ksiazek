class Client {
    constructor(data) {
        this.id = data.id;
        this.first_name = data.first_name;
        this.last_name = data.last_name;
        this.PESEL = data.PESEL;
        this.email = data.email;
        this.phone_number = data.phone_number;
    }

    validate() {
        if (!this.first_name) throw new Error('First name is required');
        if (this.first_name.length > 50) throw new Error('First name cannot exceed 50 characters');
        
        if (!this.last_name) throw new Error('Last name is required');
        if (this.last_name.length > 50) throw new Error('Last name cannot exceed 50 characters');
        
        if (!this.PESEL || !/^\d{11}$/.test(this.PESEL)) throw new Error('Valid PESEL is required');
        
        if (!this.email || !/\S+@\S+\.\S+/.test(this.email)) throw new Error('Valid email is required');
        if (this.email.length > 255) throw new Error('Email cannot exceed 255 characters');
        
        if (!this.phone_number) throw new Error('Phone number is required');
        if (this.phone_number.length > 15) throw new Error('Phone number cannot exceed 15 characters');
    }
}

module.exports = Client; 