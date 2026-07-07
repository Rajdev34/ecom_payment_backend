import { Router } from 'express';
import multer from 'multer';
import { submitApplication } from '../controllers/applications.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024
  }
});

router.post('/submit', upload.single('document'), submitApplication);

export default router;
