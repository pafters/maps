const Router = require('express');
const router = new Router();

const uploadFile = require('../middleware/uploadFiles');
const SceneController = require('../controllers/SceneController');

router.post('/create-scene', SceneController.createScene);
// router.post('/update-scene', uploadFile, SceneController.updateScene);
router.get('/:token', SceneController.getScene);

module.exports = router;