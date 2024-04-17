const Router = require('express');
const router = new Router();

const TableController = require('../controllers/TableController');

router.get('/get-table/', TableController.getTable);
router.delete('/delete-entry/', TableController.deleteEntry);
router.put('/update-entry/', TableController.updateEntry);
//router.post('/insert-user', UserController.insertUser);

module.exports = router;