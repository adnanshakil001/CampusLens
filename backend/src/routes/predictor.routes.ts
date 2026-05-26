import { Router } from 'express';
import { getExams, predictColleges } from '../controllers/predictor.controller';
import { validate } from '../middleware/validate.middleware';
import { z } from 'zod';

const router = Router();

const predictSchema = z.object({
  body: z.object({
    exam: z.string().min(1, 'Exam is required'),
    rank: z.number().min(1, 'Rank must be a positive number'),
    category: z.string().min(1, 'Category is required'),
    quota: z.string().optional(),
  }),
});

router.get('/exams', getExams);
router.post('/', validate(predictSchema), predictColleges);

export default router;
