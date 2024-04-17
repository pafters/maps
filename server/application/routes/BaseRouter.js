const Router = require('express');
const router = new Router();

//const SceneRouter = require('./SceneRouter');
const SystemRouter = require('./SystemRouter');
const UserRouter = require('./UserRouter');
const TableRouter = require('./TableRouter');
const TourRouter = require('./TourRouter');

//router.use('/scene', SceneRouter);
router.use('/system', SystemRouter);
router.use('/users', UserRouter);
router.use('/tables', TableRouter);
router.use('/tours', TourRouter);

module.exports = router;