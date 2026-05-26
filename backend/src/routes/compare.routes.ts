import { Router } from 'express';
import { compareColleges } from '../controllers/compare.controller';

const router = Router();

router.get('/', compareColleges);

export default router;
