const TableManager = require("./TableManager");
const DBManager = require("./db/DBManager");
const transliterate = require('transliterate');

class TourManager {

    getTourByUrl = async (url) => {
        const tour = await DBManager.getTourByUrl(url);

        if (tour) {
            const avatarInfo = await DBManager.getAvatarByTour(tour.id);
            const photosInfo = await DBManager.getPhotosByTour(tour.id);
            delete tour.id;
            const avatar = avatarInfo?.path ? process.env.SERVER_API + avatarInfo.path : '';
            const photos = photosInfo[0] ? photosInfo.sort((a, b) => a.index - b.index).map(photo => process.env.SERVER_API + photo.path) : [''];
            const data = {
                tour,
                avatar,
                photos
            };
            return { msg: data, status: 200 }
        } else {
            return { msg: { err: 'Ошибка: Страница не найдена' }, status: 404 }
        }
    }

    insertTour = async (pageData, avatar, photos, indexPhotos) => {
        let tour = await DBManager.getTourIdByUrl(pageData.url);
        let tourId = null;
        if (isNaN(Number(pageData.price)) || pageData.price === '')
            pageData.price = 0;
        if (tour) {
            const updTourInfo = await TableManager.updateEntry('tours', tour.id, pageData);
            if (updTourInfo.msg?.entry[0]?.id)
                tourId = tour.id;
        } else {
            const url = await this.createUrl(pageData.city, pageData.name);
            pageData.url = url;
            const insertTourInfo = await TableManager.insertEntry('tours', pageData);
            if (insertTourInfo.status === 200)
                tourId = insertTourInfo.msg?.entry[0]?.id
        }

        if (tourId) {
            if (avatar) {
                const localAvatar = await DBManager.getAvatarByTour(tourId);
                if (localAvatar) {
                    const updAvatarInfo = await TableManager.updateEntry('avatars', localAvatar.id, { path: avatar[0].path, tour_id: tourId });
                } else {
                    const insertAvatarInfo = await TableManager.insertEntry('avatars', { path: avatar[0].path, tour_id: tourId });
                }
            }

            if (indexPhotos) {
                for (let i = 0; i < indexPhotos.length; i++) {
                    let index = Number(indexPhotos[i])
                    const photo = await DBManager.getPhotoByTour(tourId, index);
                    if (photo) {
                        const updPhotoInfo = await TableManager.updateEntry('photos', photo.id, { path: photos[i].path, tour_id: tourId, index: index });
                    } else {
                        const insertPhotoInfo = await TableManager.insertEntry('photos', { path: photos[i].path, tour_id: tourId, index: index });
                    }
                }
            }
        }

        return { msg: { url: pageData.url }, status: 200 }
    }

    randomChar() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        return characters.charAt(Math.floor(Math.random() * characters.length));
    }

    createUrl = async (name, city) => {
        const re = / /g;

        const url = `${transliterate(name.toLowerCase())} ${transliterate(city.toLowerCase())}`.replace(/[^a-zA-Z ]/g, "").trim().replace(re, '-');

        let tour = await DBManager.getTourIdByUrl(url);
        if (tour) {
            let symb = this.randomChar();
            return await this.createUrl(name, city + symb);
        } else {
            return url;
        }
    }

    getRegions = async () => {
        const regionsInfo = await DBManager.getRegions();

        if (regionsInfo[0]) {
            const regions = regionsInfo.map(elem => elem.region);
            return { msg: { regions }, status: 200 }
        } else
            return { msg: { regions: [] }, status: 404 }
    }

    getCitiesByRegion = async (region) => {
        const citiesInfo = await DBManager.getCitiesByRegion(region);

        if (citiesInfo[0]) {
            const cities = citiesInfo.map(elem => elem.city);
            return { msg: { cities }, status: 200 }
        } else
            return { msg: { cities: [] }, status: 404 }

    }

    getToursByCity = async (city) => {
        const toursInfo = await DBManager.getToursByCity(city);

        if (toursInfo[0]) {
            toursInfo.forEach(tour => tour.path = process.env.SERVER_API + tour.path)
            return { msg: { tours: toursInfo }, status: 200 }
        }
        else
            return { msg: { tours: [] }, status: 404 }
    }

    getCities = async () => {
        const cities = await DBManager.getCities();

        if (cities)
            return { msg: { cities }, status: 200 }
        else return { msg: { cities: [] }, status: 404 }
    }

    deletePhoto = async (path, name) => {
        if (name === 'photos') {
            const deleteInfo = await DBManager.deletePhoto(path);
            if (deleteInfo)
                return { msg: { ok: {} }, status: 200 };
            else return { msg: { err: 'Ошибка удаления' }, status: 500 }
        }
        else {
            const deleteAvatarInfo = await DBManager.deleteAvatar(path);
            if (deleteAvatarInfo)
                return { msg: { ok: {} }, status: 200 };
            else return { msg: { err: 'Ошибка удаления' }, status: 500 }
        }


    }
}

module.exports = new TourManager();