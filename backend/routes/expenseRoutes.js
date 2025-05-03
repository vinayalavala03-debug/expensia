const express = require('express');
const {addExpense, getAllExpenses, deleteExpense,downloadExpenseExcel} = require('../controllers/expenseController.js');

const { protect } = require('../middleware/authMiddleware.js');

const incomeRouter = express.Router();

incomeRouter.post('/add', protect, addExpense);
incomeRouter.get('/get', protect, getAllExpenses);
incomeRouter.delete('/:id', protect, deleteExpense);
incomeRouter.get('/download', protect, downloadExpenseExcel);

module.exports = incomeRouter;