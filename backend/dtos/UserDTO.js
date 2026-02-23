const User = require('../models/User');

class CreateUserDTO {
    constructor(data) {
        this.username = data.username;
        this.password = data.password;
        this.email = data.email;
        this.role = data.role || 'user';
    }

    toModel() {
        return new User(this);
    }
}

class UserResponseDTO {
    constructor(user) {
        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.role = user.role;
        this.created_at = user.created_at;
    }

    static fromModel(user) {
        return new UserResponseDTO(user);
    }
}

module.exports = {
    CreateUserDTO,
    UserResponseDTO
}; 