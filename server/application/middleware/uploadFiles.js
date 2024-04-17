const multer = require('multer');
const transliterate = require('transliterate');

function fileFilter(req, file, cb) {
    // Разрешенные расширения файлов
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];
    // Проверяем расширение файла
    const fileExtension = transliterate(file.originalname.substring(file.originalname.lastIndexOf('.')).toLowerCase()).trim();

    if (allowedExtensions.includes(fileExtension)) {
        // Позволяем загрузку файла
        cb(null, true);
    } else {
        // Ошибка при загрузке файла
        cb(new Error('Неверный формат файла'));
    }
}


const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'data/');
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}` + '-' + file.originalname)
    }
})
//const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

const uploadFile = (req, res, next) => {
    // Загружаем файл 'avatar' (если он есть)
    upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'photos', maxCount: 30 }])(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return next(err);
        } else if (err) {
            return next(err);
        }

        // Проверяем, загружен ли файл 'avatar'
        if (!req.files['avatar']) {
            console.log('Файл "avatar" не загружен');
        }

        // Проверяем, загружен ли хотя бы один файл в массиве 'photos'
        if (!req.files['photos'] || req.files['photos'].length === 0) {
            console.log('Файлы "photos" не загружены');
        }

        next();
    });
};

module.exports = uploadFile