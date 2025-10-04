const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transactionController');

// @route   GET api/transactions
// @desc    Get all transactions for a user
// @access  Private
router.get('/', auth, getTransactions);

// @route   POST api/transactions
// @desc    Add a new transaction
// @access  Private
router.post('/', auth, addTransaction);

// @route   PUT api/transactions/:id
// @desc    Update a transaction
// @access  Private
router.put('/:id', auth, updateTransaction);

// @route   DELETE api/transactions/:id
// @desc    Delete a transaction
// @access  Private
router.delete('/:id', auth, deleteTransaction);

// @route   GET api/transactions/download-csv
// @desc    Download transactions as CSV
// @access  Private
router.get('/download-csv', auth, require('../controllers/transactionController').downloadCSV);


module.exports = router;
