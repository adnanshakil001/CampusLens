import { Router } from 'express';
import { getSavedColleges, saveCollege, unsaveCollege, getAllUsers } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Fetch all registered users
router.get('/all', getAllUsers);

// Gated routes for saved colleges list
router.get('/saved', authenticate, getSavedColleges);
router.post('/saved', authenticate, saveCollege);
router.delete('/saved/:id', authenticate, unsaveCollege);

export default router;

