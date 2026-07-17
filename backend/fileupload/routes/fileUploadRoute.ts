import { Router } from 'express';
import multerConfig from '../../middleware/multer';
import { removeUploadedFile, uploadFile } from '../controllers/uploadFileCotroller';
import { userAuthMiddleware } from '../../middleware/auth/authMiddleware';

const router = Router();

router.post(
  '',
  userAuthMiddleware,
  (req, res, next) => {
    multerConfig.multipleFileUpload()(req, res, function (err: any) {
      if (err) {
        return res.status(400).json({
          status: 'fail',
          error: err.message,
        });
      }
      next();
    });
  },
  uploadFile,
);
//router.post('', userAuthMiddleware, multerConfig.multipleFileUpload(), uploadFile);
router.delete('/remove', userAuthMiddleware, removeUploadedFile);

export default router;
