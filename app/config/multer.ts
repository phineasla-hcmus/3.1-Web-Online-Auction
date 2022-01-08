import multer from 'multer';
import { MAX_IMAGES, MAX_IMAGE_SIZE } from './secret';

const storage = multer.memoryStorage();
// const storage = multer.diskStorage({ destination: './public/images/product' });

export const upload = multer({
  storage,
  limits: { fileSize: MAX_IMAGE_SIZE, files: MAX_IMAGES },
  fileFilter: (req, file, cb) => {
    // if (file.mimetype.includes('image/')) {
    //   cb(null, true);
    // } else {
    //   cb(new Error('Only images are allowed'));
    // }
    cb(null, file.mimetype.includes('image/'));
  },
});
