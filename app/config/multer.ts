import multer from 'multer';

const KB = 1024;
const MB = 1024 * KB;
// const storage = multer.memoryStorage();
const storage = multer.diskStorage({ destination: './public/images/product' });

export const upload = multer({
  storage,
  limits: { fileSize: 2 * MB, files: 10 },
  fileFilter: (req, file, cb) => {
    // if (file.mimetype.includes('image/')) {
    //   cb(null, true);
    // } else {
    //   cb(new Error('Only images are allowed'));
    // }
    cb(null, file.mimetype.includes('image/'));
  },
});
