const multer = require('multer');

const ALLOWED_MIMETYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

function fileFilter(req, file, cb) {
  if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos JPG y PNG.'), false);
  }
}

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: MAX_SIZE_BYTES },
});

module.exports = upload;
module.exports.fileFilter = fileFilter;
