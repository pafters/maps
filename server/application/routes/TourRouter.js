const Router = require('express');
const router = new Router();

const TourController = require('../controllers/TourController');
const uploadFile = require('../middleware/uploadFiles');

router.get('/get-tour/', TourController.getTourByUrl);
router.post('/insert-tour/', uploadFile, TourController.insertTour);
router.get('/get-regions/', TourController.getRegions);
router.get('/get-cities/', TourController.getCitiesByRegion);
router.get('/get-all-cities/', TourController.getCities);
router.get('/get-tours-by-city', TourController.getToursByCity);
router.delete('/delete-photo/', TourController.deletePhoto);
module.exports = router;