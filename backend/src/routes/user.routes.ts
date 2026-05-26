import { Router } from 'express';
import { getSavedColleges, saveCollege, unsaveCollege } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Gated routes for saved colleges list
router.get('/saved', authenticate, getSavedColleges);
router.post('/saved', authenticate, saveCollege);
router.delete('/saved/:id', authenticate, unsaveCollege);

export default router;
