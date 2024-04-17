const TourManager = require("../modules/TourManager")

class TourController {

    getTourByUrl = async (req, res) => {
        const { url } = req.query;
        const tourInfo = await TourManager.getTourByUrl(url)

        res.status(tourInfo.status).send(tourInfo.msg);
    }

    insertTour = async (req, res) => {
        const { avatar, photos } = req.files;
        console.log(['add gallery',photos])
        const pageData = JSON.parse(req.body.pageData);
        const indexPhotos = req.body.indexPhotos;
        const insertInfo = await TourManager.insertTour(pageData, avatar, photos, indexPhotos);

        res.status(insertInfo.status).send(insertInfo.msg);
    }

    getRegions = async (req, res) => {
        const regionsInfo = await TourManager.getRegions();

        res.status(regionsInfo.status).send(regionsInfo.msg);
    }

    getCitiesByRegion = async (req, res) => {
        const { region } = req.query;
        const citiesInfo = await TourManager.getCitiesByRegion(region);

        res.status(citiesInfo.status).send(citiesInfo.msg);
    }

    getToursByCity = async (req, res) => {
        const { city } = req.query;
        const citiesInfo = await TourManager.getToursByCity(city);

        res.status(citiesInfo.status).send(citiesInfo.msg);
    }

    getCities = async (req, res) => {
        const citiesInfo = await TourManager.getCities();
        res.status(citiesInfo.status).send(citiesInfo.msg);
    }

    deletePhoto = async (req, res) => {
        const { path, name } = req.query;

        const deleteInfo = await TourManager.deletePhoto(path.replace(process.env.SERVER_API, ''), name);
        res.status(deleteInfo.status).send(deleteInfo.msg);
    }
}

module.exports = new TourController();