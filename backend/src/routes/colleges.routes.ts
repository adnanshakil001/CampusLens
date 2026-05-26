import { Router } from 'express';
import {
  listColleges,
  getCollegeDetail,
  getCollegeCourses,
  getCollegePlacements,
  getCollegeReviews,
  createCollegeReview,
} from '../controllers/colleges.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { z } from 'zod';

const router = Router();

const reviewSchema = z.object({
  body: z.object({
    rating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
    comment: z.string().min(5, 'Review comment must be at least 5 characters long'),
  }),
});

// Listing and Detail
router.get('/', listColleges);
router.get('/:slug', getCollegeDetail);

// Sub-resources
router.get('/:slug/courses', getCollegeCourses);
router.get('/:slug/placements', getCollegePlacements);
router.get('/:slug/reviews', getCollegeReviews);

// Add review (auth gated)
router.post('/:slug/reviews', authenticate, validate(reviewSchema), createCollegeReview);

export default router;
