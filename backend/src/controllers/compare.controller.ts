import { Request, Response, NextFunction } from 'express';
import { pool } from '../config/db';

export const compareColleges = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { ids } = req.query;

  if (!ids) {
    res.status(400).json({ error: 'Missing college IDs for comparison. Provide a comma-separated list under "ids".' });
    return;
  }

  try {
    const idList = String(ids)
      .split(',')
      .map((id) => Number(id.trim()))
      .filter((id) => !isNaN(id));

    if (idList.length === 0) {
      res.status(400).json({ error: 'Invalid college IDs provided.' });
      return;
    }

    // Query details for all selected colleges
    const collegesQuery = await pool.query(
      `SELECT * FROM colleges WHERE id = ANY($1::int[])`,
      [idList]
    );

    const colleges = collegesQuery.rows;

    const result = [];

    // Gather sub-resources for each college (placements and courses count)
    for (const college of colleges) {
      const placementRes = await pool.query(
        'SELECT * FROM placements WHERE college_id = $1 ORDER BY year DESC LIMIT 1',
        [college.id]
      );

      const coursesCountRes = await pool.query(
        'SELECT COUNT(*)::int as count FROM courses WHERE college_id = $1',
        [college.id]
      );

      result.push({
        ...college,
        latestPlacement: placementRes.rows[0] || null,
        coursesCount: coursesCountRes.rows[0].count || 0,
      });
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
