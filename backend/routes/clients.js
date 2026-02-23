const express = require('express');
const router = express.Router();
const ClientController = require('../controllers/clientController');
const auth = require('../middleware/auth');

router.get('/', auth(['admin', 'user']), ClientController.getClients);

router.get('/select-options', auth(['admin', 'user']), ClientController.getClientsForSelect);

router.get('/:id/borrowings', auth(['admin', 'user']), ClientController.getClientBorrowings);

router.get('/:id', auth(['admin', 'user']), ClientController.getClient);

router.post('/', auth(['admin', 'user']), ClientController.createClient);

router.put('/:id', auth(['admin', 'user']), ClientController.updateClient);

router.delete('/:id', auth(['admin', 'user']), ClientController.deleteClient);

module.exports = router; 