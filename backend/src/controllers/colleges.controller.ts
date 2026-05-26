import { Request, Response, NextFunction } from 'express';
import { pool } from '../config/db';

export const listColleges = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const {
    search,
    state,
    city,
    type,
    minFees,
    maxFees,
    minRating,
    exam,
    rank,
  } = req.query;

  try {
    let queryText = 'SELECT * FROM colleges WHERE 1=1';
    const queryParams: any[] = [];
    let paramCounter = 1;

    // Filter by search keyword
    if (search) {
      queryText += ` AND (name ILIKE $${paramCounter} OR location ILIKE $${paramCounter} OR overview ILIKE $${paramCounter})`;
      queryParams.push(`%${search}%`);
      paramCounter++;
    }

    // Filter by state
    if (state) {
      queryText += ` AND state = $${paramCounter}`;
      queryParams.push(state);
      paramCounter++;
    }

    // Filter by city
    if (city) {
      queryText += ` AND city = $${paramCounter}`;
      queryParams.push(city);
      paramCounter++;
    }

    // Filter by type
    if (type) {
      queryText += ` AND type = $${paramCounter}`;
      queryParams.push(type);
      paramCounter++;
    }

    // Filter by min fees
    if (minFees) {
      queryText += ` AND fees >= $${paramCounter}`;
      queryParams.push(Number(minFees));
      paramCounter++;
    }

    // Filter by max fees
    if (maxFees) {
      queryText += ` AND fees <= $${paramCounter}`;
      queryParams.push(Number(maxFees));
      paramCounter++;
    }

    // Filter by min rating
    if (minRating) {
      queryText += ` AND rating >= $${paramCounter}`;
      queryParams.push(Number(minRating));
      paramCounter++;
    }

    // Filter by Exam Cutoffs (Predictor Integration inside listing search!)
    if (exam && rank) {
      queryText += ` AND id IN (
        SELECT DISTINCT college_id FROM predictor_cutoffs 
        WHERE exam = $${paramCounter} AND rank_cutoff >= $${paramCounter + 1}
      )`;
      queryParams.push(exam, Number(rank));
      paramCounter += 2;
    }

    // Sorting by NIRF ranking (nulls last) or rating
    queryText += ' ORDER BY CASE WHEN ranking IS NULL THEN 1 ELSE 0 END, ranking ASC, rating DESC';

    const result = await pool.query(queryText, queryParams);
    res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};

export const getCollegeDetail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { slug } = req.params;

  try {
    const result = await pool.query('SELECT * FROM colleges WHERE slug = $1', [slug]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'College not found' });
      return;
    }

    const college = result.rows[0];

    // Fetch placement info for the most recent year
    const placementsResult = await pool.query(
      'SELECT * FROM placements WHERE college_id = $1 ORDER BY year DESC LIMIT 1',
      [college.id]
    );

    res.status(200).json({
      ...college,
      latestPlacement: placementsResult.rows[0] || null,
    });
  } catch (error) {
    next(error);
  }
};

export const getCollegeCourses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { slug } = req.params;

  try {
    const collegeRes = await pool.query('SELECT id FROM colleges WHERE slug = $1', [slug]);
    if (collegeRes.rows.length === 0) {
      res.status(404).json({ error: 'College not found' });
      return;
    }

    const coursesRes = await pool.query(
      'SELECT * FROM courses WHERE college_id = $1 ORDER BY level DESC, fees ASC',
      [collegeRes.rows[0].id]
    );

    res.status(200).json(coursesRes.rows);
  } catch (error) {
    next(error);
  }
};

export const getCollegePlacements = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { slug } = req.params;

  try {
    const collegeRes = await pool.query('SELECT id FROM colleges WHERE slug = $1', [slug]);
    if (collegeRes.rows.length === 0) {
      res.status(404).json({ error: 'College not found' });
      return;
    }

    const placementsRes = await pool.query(
      'SELECT * FROM placements WHERE college_id = $1 ORDER BY year DESC',
      [collegeRes.rows[0].id]
    );

    res.status(200).json(placementsRes.rows);
  } catch (error) {
    next(error);
  }
};

export const getCollegeReviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { slug } = req.params;

  try {
    const collegeRes = await pool.query('SELECT id FROM colleges WHERE slug = $1', [slug]);
    if (collegeRes.rows.length === 0) {
      res.status(404).json({ error: 'College not found' });
      return;
    }

    const reviewsRes = await pool.query(
      'SELECT * FROM reviews WHERE college_id = $1 ORDER BY created_at DESC',
      [collegeRes.rows[0].id]
    );

    res.status(200).json(reviewsRes.rows);
  } catch (error) {
    next(error);
  }
};

export const createCollegeReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { slug } = req.params;
  const { rating, comment } = req.body;
  const user = req.user; // Set by authenticate middleware

  if (!user) {
    res.status(401).json({ error: 'Unauthorized. Authentication required.' });
    return;
  }

  try {
    const collegeRes = await pool.query('SELECT id, rating FROM colleges WHERE slug = $1', [slug]);
    if (collegeRes.rows.length === 0) {
      res.status(404).json({ error: 'College not found' });
      return;
    }

    const collegeId = collegeRes.rows[0].id;

    // Insert review
    const newReviewRes = await pool.query(
      `INSERT INTO reviews (college_id, user_id, user_name, rating, comment)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [collegeId, user.id, user.fullName, Number(rating), comment]
    );

    // Recalculate average rating for the college
    const ratingStats = await pool.query(
      'SELECT AVG(rating)::numeric(3,2) as avg_rating FROM reviews WHERE college_id = $1',
      [collegeId]
    );

    const newAvgRating = ratingStats.rows[0].avg_rating || rating;
    await pool.query('UPDATE colleges SET rating = $1 WHERE id = $2', [newAvgRating, collegeId]);

    res.status(201).json(newReviewRes.rows[0]);
  } catch (error) {
    next(error);
  }
};
