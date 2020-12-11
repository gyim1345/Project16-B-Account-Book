const Router = require('koa-router');
const router = new Router();
const transactionController = require('../controller/transaction.controller');

router.get('/:accountBookId', transactionController.getTransactions);
router.get('/', transactionController.getAccountBookTransactions);
router.get('/:year/:month', transactionController.getCalendarTransactions);
router.post('/', transactionController.addTransaction);
router.patch('/', transactionController.updateTransaction);
router.delete('/', transactionController.deleteTransaction);

module.exports = router;
