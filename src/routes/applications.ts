import { Router } from 'express';
import { submitApplication, getPresignedUrl } from '../controllers/applications.js';

const router = Router();

router.post('/submit', submitApplication);
router.post('/presign', getPresignedUrl);

export default router;
