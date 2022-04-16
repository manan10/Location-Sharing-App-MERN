const multer = require('multer')
const uuid = require('uuid')

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
}

const fileUpload = multer({
    limits: 500000,
    storage: multer.diskStorage({
        destination: (req, file, callback) =>   callback(null, 'uploads/images'),
        filename: (req, file, callback) =>  callback(null, uuid.v1() + '.' + MIME_TYPE_MAP[file.mimetype])
    }),
    fileFilter: (req, file, cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        let error = isValid ? null : new Error('Invalid mime type!');
        cb(error, isValid);
    }
})

module.exports = fileUpload