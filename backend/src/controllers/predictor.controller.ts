import { Request, Response, NextFunction } from 'express';
import { pool } from '../config/db';

export const getExams = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await pool.query('SELECT DISTINCT exam FROM predictor_cutoffs ORDER BY exam');
    res.status(200).json(result.rows.map((row) => row.exam));
  } catch (error) {
    next(error);
  }
};

export const predictColleges = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { exam, rank, category, quota } = req.body;

  if (!exam || !rank || !category) {
    res.status(400).json({ error: 'Missing required parameters. Provide "exam", "rank", and "category".' });
    return;
  }

  try {
    const userRank = Number(rank);
    if (isNaN(userRank) || userRank <= 0) {
      res.status(400).json({ error: 'Rank must be a positive number.' });
      return;
    }

    // Match cutoffs: cutoff closing rank must be >= user rank
    // Join with colleges to fetch college info alongside branch matching
    let queryText = `
      SELECT pc.*, c.name as college_name, c.slug as college_slug, c.location, c.fees, c.rating, c.logo_url
      FROM predictor_cutoffs pc
      JOIN colleges c ON pc.college_id = c.id
      WHERE pc.exam = $1 AND pc.rank_cutoff >= $2 AND pc.category = $3
    `;
    const queryParams: any[] = [exam, userRank, category];
    let paramCounter = 4;

    if (quota) {
      queryText += ` AND pc.quota = $${paramCounter}`;
      queryParams.push(quota);
      paramCounter++;
    }

    // Sort results: best chance (highest cutoff rank minus user rank is highly likely chance, or closest match is low rank)
    // Actually, sorting by cutoff rank ascending shows the closest/safest options, or by college ranking
    queryText += ' ORDER BY pc.rank_cutoff ASC, c.ranking ASC';

    const result = await pool.query(queryText, queryParams);

    // Group predictions with extra category meta (e.g. chance levels: Safe, Target, Reach)
    const predictions = result.rows.map((row) => {
      const margin = row.rank_cutoff - userRank;
      let chance = 'Reach'; // Tighter gap
      if (margin > 3000) chance = 'Safe'; // Safe/easy option
      else if (margin > 1000) chance = 'Target'; // Strong choice

      return {
        ...row,
        chance,
      };
    });

    res.status(200).json(predictions);
  } catch (error) {
    next(error);
  }
};
