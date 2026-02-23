const ClientRepository = require('../repositories/clientRepository');
const ClientBookRepository = require('../repositories/clientBookRepository');
const { CreateClientDTO, UpdateClientDTO, ClientResponseDTO } = require('../dtos/ClientDTO');

class ClientController {
    async createClient(req, res, next) {
        try {
            const clientDTO = new CreateClientDTO(req.body);
            const clientModel = clientDTO.toModel();
            
            try {
                clientModel.validate();
            } catch (error) {
                error.statusCode = 400;
                return next(error);
            }

            const client = await ClientRepository.create(clientModel);
            res.status(201).json(ClientResponseDTO.fromModel(client));
        } catch (error) {
            next(error);
        }
    }

    async getClients(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await ClientRepository.findAll(page, limit);
            
            return res.json({
                clients: ClientResponseDTO.fromModelList(result.clients),
                pagination: result.pagination
            });
        } catch (error) {
            next(error);
        }
    }

    async getClient(req, res, next) {
        try {
            const client = await ClientRepository.findById(req.params.id);
            if (!client) {
                const error = new Error('Client not found');
                error.statusCode = 404;
                return next(error);
            }
            res.json(ClientResponseDTO.fromModel(client));
        } catch (error) {
            next(error);
        }
    }

    async updateClient(req, res, next) {
        try {
            const clientDTO = new UpdateClientDTO(req.body);
            const clientModel = clientDTO.toModel();
            
            try {
                clientModel.validate();
            } catch (error) {
                error.statusCode = 400;
                return next(error);
            }

            const client = await ClientRepository.update(req.params.id, clientModel);
            res.json(ClientResponseDTO.fromModel(client));
        } catch (error) {
            next(error);
        }
    }

    async deleteClient(req, res, next) {
        try {
            await ClientRepository.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async getClientBorrowings(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const clientId = req.params.id;
            const userId = req.user.role === 'admin' ? null : req.user.id;

            const client = await ClientRepository.findById(clientId);
            if (!client) {
                const error = new Error('Client not found');
                error.statusCode = 404;
                return next(error);
            }

            const result = await ClientBookRepository.findByClientId(clientId, page, limit, userId);
            
            return res.json({
                client: ClientResponseDTO.fromModel(client),
                borrowings: result.borrowings,
                pagination: result.pagination
            });
        } catch (error) {
            next(error);
        }
    }

    async getClientsForSelect(req, res, next) {
        try {
            const clients = await ClientRepository.findAllForSelect();
            res.json(clients);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ClientController(); 