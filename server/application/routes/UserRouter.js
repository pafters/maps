const Router = require('express');
const router = new Router();

const UserController = require('../controllers/UserController');

router.post('/auth', UserController.auth);
router.post('/insert-user', UserController.insertUser);
router.get('/get-me', UserController.getMe);

module.exports = router;