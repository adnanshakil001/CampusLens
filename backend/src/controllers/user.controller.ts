import { Request, Response, NextFunction } from 'express';
import { pool } from '../config/db';

export const getSavedColleges = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const user = req.user;

  if (!user) {
    res.status(401).json({ error: 'Unauthorized.' });
    return;
  }

  try {
    const result = await pool.query(
      `SELECT c.* 
       FROM saved_colleges sc
       JOIN colleges c ON sc.college_id = c.id
       WHERE sc.user_id = $1`,
      [user.id]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};

export const saveCollege = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { collegeId } = req.body;
  const user = req.user;

  if (!user) {
    res.status(401).json({ error: 'Unauthorized.' });
    return;
  }

  if (!collegeId) {
    res.status(400).json({ error: 'Missing college ID.' });
    return;
  }

  try {
    // Insert saved college (ignore duplicates via primary key clash or handle with ON CONFLICT)
    await pool.query(
      `INSERT INTO saved_colleges (user_id, college_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, college_id) DO NOTHING`,
      [user.id, Number(collegeId)]
    );

    res.status(201).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const unsaveCollege = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params; // College ID
  const user = req.user;

  if (!user) {
    res.status(401).json({ error: 'Unauthorized.' });
    return;
  }

  try {
    await pool.query(
      'DELETE FROM saved_colleges WHERE user_id = $1 AND college_id = $2',
      [user.id, Number(id)]
    );

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
