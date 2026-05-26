import { Request, Response, NextFunction } from 'express';
import { pool } from '../config/db';

export const listQuestions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await pool.query(`
      SELECT q.*, 
             COUNT(a.id)::int as answers_count,
             COALESCE(SUM(CASE WHEN v.vote_type = 'up' THEN 1 WHEN v.vote_type = 'down' THEN -1 ELSE 0 END), 0)::int as votes_score
      FROM questions q
      LEFT JOIN answers a ON q.id = a.question_id
      LEFT JOIN votes v ON q.id = v.question_id
      GROUP BY q.id
      ORDER BY q.created_at DESC
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};

export const createQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { title, content } = req.body;
  const user = req.user;

  if (!user) {
    res.status(401).json({ error: 'Unauthorized. Authentication required.' });
    return;
  }

  try {
    const result = await pool.query(
      `INSERT INTO questions (user_id, user_name, title, content)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [user.id, user.fullName, title, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const getQuestionDetail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;

  try {
    // Increment views
    await pool.query('UPDATE questions SET views = views + 1 WHERE id = $1', [Number(id)]);

    // Get question info
    const questionRes = await pool.query(
      `SELECT q.*, 
              COALESCE(SUM(CASE WHEN v.vote_type = 'up' THEN 1 WHEN v.vote_type = 'down' THEN -1 ELSE 0 END), 0)::int as votes_score
       FROM questions q
       LEFT JOIN votes v ON q.id = v.question_id
       WHERE q.id = $1
       GROUP BY q.id`,
      [Number(id)]
    );

    if (questionRes.rows.length === 0) {
      res.status(404).json({ error: 'Question not found' });
      return;
    }

    // Get answers list
    const answersRes = await pool.query(
      `SELECT a.*,
              COALESCE(SUM(CASE WHEN v.vote_type = 'up' THEN 1 WHEN v.vote_type = 'down' THEN -1 ELSE 0 END), 0)::int as votes_score
       FROM answers a
       LEFT JOIN votes v ON a.id = v.answer_id
       WHERE a.question_id = $1
       GROUP BY a.id
       ORDER BY a.created_at ASC`,
      [Number(id)]
    );

    res.status(200).json({
      question: questionRes.rows[0],
      answers: answersRes.rows,
    });
  } catch (error) {
    next(error);
  }
};

export const createAnswer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params; // Question ID
  const { content } = req.body;
  const user = req.user;

  if (!user) {
    res.status(401).json({ error: 'Unauthorized. Authentication required.' });
    return;
  }

  try {
    // Validate question exists
    const qCheck = await pool.query('SELECT id FROM questions WHERE id = $1', [Number(id)]);
    if (qCheck.rows.length === 0) {
      res.status(404).json({ error: 'Question not found' });
      return;
    }

    const result = await pool.query(
      `INSERT INTO answers (question_id, user_id, user_name, content)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [Number(id), user.id, user.fullName, content]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const voteQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const { voteType } = req.body; // 'up' or 'down'
  const user = req.user;

  if (!user) {
    res.status(401).json({ error: 'Unauthorized.' });
    return;
  }

  try {
    // Remove existing vote
    await pool.query('DELETE FROM votes WHERE user_id = $1 AND question_id = $2', [user.id, Number(id)]);

    // Insert new vote
    await pool.query(
      'INSERT INTO votes (user_id, question_id, vote_type) VALUES ($1, $2, $3)',
      [user.id, Number(id), voteType]
    );

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const voteAnswer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params; // Answer ID
  const { voteType } = req.body;
  const user = req.user;

  if (!user) {
    res.status(401).json({ error: 'Unauthorized.' });
    return;
  }

  try {
    // Remove existing vote
    await pool.query('DELETE FROM votes WHERE user_id = $1 AND answer_id = $2', [user.id, Number(id)]);

    // Insert new vote
    await pool.query(
      'INSERT INTO votes (user_id, answer_id, vote_type) VALUES ($1, $2, $3)',
      [user.id, Number(id), voteType]
    );

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
