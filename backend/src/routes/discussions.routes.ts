import { Router } from 'express';
import {
  listQuestions,
  createQuestion,
  getQuestionDetail,
  createAnswer,
  voteQuestion,
  voteAnswer,
} from '../controllers/discussions.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { z } from 'zod';

const router = Router();

const questionSchema = z.object({
  body: z.object({
    title: z.string().min(5, 'Title must be at least 5 characters long'),
    content: z.string().min(10, 'Question description must be at least 10 characters long'),
  }),
});

const answerSchema = z.object({
  body: z.object({
    content: z.string().min(5, 'Answer must be at least 5 characters long'),
  }),
});

const voteSchema = z.object({
  body: z.object({
    voteType: z.enum(['up', 'down']),
  }),
});

// Listing & details
router.get('/', listQuestions);
router.post('/', authenticate, validate(questionSchema), createQuestion);
router.get('/:id', getQuestionDetail);

// Answers & voting (auth gated)
router.post('/:id/answers', authenticate, validate(answerSchema), createAnswer);
router.post('/:id/vote', authenticate, validate(voteSchema), voteQuestion);
router.post('/answers/:id/vote', authenticate, validate(voteSchema), voteAnswer);

export default router;
