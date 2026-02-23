class User {
    constructor(data) {
        this.id = data.id;
        this.username = data.username;
        this.password = data.password;
        this.email = data.email;
        this.role = data.role || 'user';
        this.created_at = data.created_at;
    }

    validate() {
        if (!this.username || this.username.length < 3) {
            throw new Error('Username must be at least 3 characters long');
        }
        if (this.username.length > 50) {
            throw new Error('Username cannot exceed 50 characters');
        }

        if (!this.email || !/\S+@\S+\.\S+/.test(this.email)) {
            throw new Error('Valid email is required');
        }
        if (this.email.length > 255) {
            throw new Error('Email cannot exceed 255 characters');
        }

        if (!this.password || this.password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }
        if (this.password.length > 72) {
            throw new Error('Password cannot exceed 72 characters');
        }

        if (!['user', 'admin'].includes(this.role)) {
            throw new Error('Invalid role');
        }
    }
}

module.exports = User; 