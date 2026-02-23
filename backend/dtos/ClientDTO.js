const Client = require('../models/Client');

class CreateClientDTO {
    constructor(data) {
        this.first_name = data.first_name;
        this.last_name = data.last_name;
        this.PESEL = data.PESEL;
        this.email = data.email;
        this.phone_number = data.phone_number;
    }

    toModel() {
        return new Client(this);
    }
}

class UpdateClientDTO {
    constructor(data) {
        this.first_name = data.first_name;
        this.last_name = data.last_name;
        this.PESEL = data.PESEL;
        this.email = data.email;
        this.phone_number = data.phone_number;
    }

    toModel() {
        return new Client(this);
    }
}

class ClientResponseDTO {
    constructor(client) {
        this.id = client.id;
        this.first_name = client.first_name;
        this.last_name = client.last_name;
        this.PESEL = client.PESEL;
        this.email = client.email;
        this.phone_number = client.phone_number;
    }

    static fromModel(client) {
        return new ClientResponseDTO(client);
    }

    static fromModelList(clients) {
        return clients.map(client => new ClientResponseDTO(client));
    }
}

module.exports = {
    CreateClientDTO,
    UpdateClientDTO,
    ClientResponseDTO
}; 