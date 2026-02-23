const express = require('express');
const router = express.Router();
const ClientBookController = require('../controllers/clientBookController');
const auth = require('../middleware/auth');


router.post('/', auth(['admin', 'user']), ClientBookController.createBorrowing);

router.get('/', auth(['admin', 'user']), ClientBookController.getBorrowings);

router.get('/:id/details', auth(['admin', 'user']), ClientBookController.getBorrowingDetails);

router.put('/:id', auth(['admin', 'user']), ClientBookController.updateBorrowing);

router.delete('/:id', auth(['admin', 'user']), ClientBookController.deleteBorrowing);

module.exports = router; 