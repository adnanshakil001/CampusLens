import { pool } from '../src/config/db';

const COLLEGES_DATA = [
  {
    name: 'Indian Institute of Technology Bombay',
    slug: 'iit-bombay',
    location: 'Mumbai, Maharashtra',
    state: 'Maharashtra',
    city: 'Mumbai',
    type: 'Government',
    fees: 220000,
    rating: 4.9,
    logo_url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=100&h=100&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=500&fit=crop&q=80',
    overview: 'Established in 1958, IIT Bombay is a premier global institute for engineering education and research. Located in Powai, Mumbai, the campus is surrounded by scenic beauty and offers state-of-the-art facilities.',
    established: 1958,
    ranking: 3,
  },
  {
    name: 'Indian Institute of Technology Delhi',
    slug: 'iit-delhi',
    location: 'New Delhi, Delhi',
    state: 'Delhi',
    city: 'New Delhi',
    type: 'Government',
    fees: 225000,
    rating: 4.8,
    logo_url: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=100&h=100&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=500&fit=crop&q=80',
    overview: 'IIT Delhi is a public technical and research university located in Hauz Khas, Delhi. It is one of the oldest IITs and ranks consistently among the top universities in India and globally.',
    established: 1961,
    ranking: 2,
  },
  {
    name: 'Indian Institute of Technology Madras',
    slug: 'iit-madras',
    location: 'Chennai, Tamil Nadu',
    state: 'Tamil Nadu',
    city: 'Chennai',
    type: 'Government',
    fees: 215000,
    rating: 4.8,
    logo_url: 'https://images.unsplash.com/photo-1595853035070-59a39fe84de3?w=100&h=100&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&h=500&fit=crop&q=80',
    overview: 'IIT Madras is situated in a beautiful forest campus in Chennai. It has been ranked as the No. 1 engineering institute in India by NIRF for multiple consecutive years.',
    established: 1959,
    ranking: 1,
  },
  {
    name: 'BITS Pilani - Birla Institute of Technology and Science',
    slug: 'bits-pilani',
    location: 'Pilani, Rajasthan',
    state: 'Rajasthan',
    city: 'Pilani',
    type: 'Private',
    fees: 550000,
    rating: 4.7,
    logo_url: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=100&h=100&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=500&fit=crop&q=80',
    overview: 'Birla Institute of Technology & Science, Pilani is a highly esteemed private deemed university focused primarily on higher education and research in engineering and sciences.',
    established: 1964,
    ranking: 15,
  },
  {
    name: 'National Institute of Technology Trichy',
    slug: 'nit-trichy',
    location: 'Tiruchirappalli, Tamil Nadu',
    state: 'Tamil Nadu',
    city: 'Tiruchirappalli',
    type: 'Government',
    fees: 145000,
    rating: 4.6,
    logo_url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=100&h=100&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=500&fit=crop&q=80',
    overview: 'NIT Trichy is a public technical and research university located in Tamil Nadu. It is consistently ranked as the top National Institute of Technology (NIT) in India.',
    established: 1964,
    ranking: 9,
  },
  {
    name: 'Delhi Technological University',
    slug: 'dtu-delhi',
    location: 'Rohini, Delhi',
    state: 'Delhi',
    city: 'Delhi',
    type: 'Government',
    fees: 200000,
    rating: 4.5,
    logo_url: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=100&h=100&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=500&fit=crop&q=80',
    overview: 'Delhi Technological University (formerly Delhi College of Engineering) is a premier state university in Delhi known for its strong industry relations, legacy, and exceptional placement records.',
    established: 1941,
    ranking: 29,
  },
  {
    name: 'Vellore Institute of Technology',
    slug: 'vit-vellore',
    location: 'Vellore, Tamil Nadu',
    state: 'Tamil Nadu',
    city: 'Vellore',
    type: 'Private',
    fees: 198000,
    rating: 4.2,
    logo_url: 'https://images.unsplash.com/photo-1595853035070-59a39fe84de3?w=100&h=100&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&h=500&fit=crop&q=80',
    overview: 'VIT Vellore is a highly popular private university in India, renowned for its spacious campus, modern classrooms, diverse student clubs, and extensive global placement drives.',
    established: 1984,
    ranking: 11,
  }
];

async function seed() {
  console.log('Starting data seeding...');
  try {
    // Clean old data to avoid duplications
    await pool.query('TRUNCATE colleges CASCADE');
    await pool.query('TRUNCATE users CASCADE');
    console.log('Cleared existing data.');

    // Seed Colleges
    const idMap: Record<string, number> = {};
    for (const c of COLLEGES_DATA) {
      const res = await pool.query(
        `INSERT INTO colleges (name, slug, location, state, city, type, fees, rating, logo_url, cover_url, overview, established, ranking)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id`,
        [c.name, c.slug, c.location, c.state, c.city, c.type, c.fees, c.rating, c.logo_url, c.cover_url, c.overview, c.established, c.ranking]
      );
      idMap[c.slug] = res.rows[0].id;
    }
    console.log('Seeded Colleges successfully.');

    // Seed Courses
    const courses = [
      // IIT Bombay
      { college_id: idMap['iit-bombay'], name: 'B.Tech Computer Science & Engineering', duration: '4 Years', fees: 220000, level: 'UG', intake: 120, eligibility: 'Class 12 with 75% + JEE Advanced' },
      { college_id: idMap['iit-bombay'], name: 'B.Tech Electrical Engineering', duration: '4 Years', fees: 220000, level: 'UG', intake: 80, eligibility: 'Class 12 with 75% + JEE Advanced' },
      { college_id: idMap['iit-bombay'], name: 'M.Tech Microelectronics', duration: '2 Years', fees: 50000, level: 'PG', intake: 40, eligibility: 'B.Tech/BE in relevant discipline + GATE' },
      
      // IIT Delhi
      { college_id: idMap['iit-delhi'], name: 'B.Tech Computer Science & Engineering', duration: '4 Years', fees: 225000, level: 'UG', intake: 110, eligibility: 'Class 12 with 75% + JEE Advanced' },
      { college_id: idMap['iit-delhi'], name: 'B.Tech Mechanical Engineering', duration: '4 Years', fees: 225000, level: 'UG', intake: 90, eligibility: 'Class 12 with 75% + JEE Advanced' },
      { college_id: idMap['iit-delhi'], name: 'M.Tech Telecommunications', duration: '2 Years', fees: 55000, level: 'PG', intake: 35, eligibility: 'B.Tech/BE + GATE' },

      // BITS Pilani
      { college_id: idMap['bits-pilani'], name: 'B.E. Computer Science', duration: '4 Years', fees: 550000, level: 'UG', intake: 150, eligibility: 'Class 12 with 75% in PCM + BITSAT' },
      { college_id: idMap['bits-pilani'], name: 'B.E. Electronics & Instrumentation', duration: '4 Years', fees: 550000, level: 'UG', intake: 100, eligibility: 'Class 12 with 75% in PCM + BITSAT' },

      // NIT Trichy
      { college_id: idMap['nit-trichy'], name: 'B.Tech Computer Science & Engineering', duration: '4 Years', fees: 145000, level: 'UG', intake: 120, eligibility: 'Class 12 with 75% + JEE Main' },
      { college_id: idMap['nit-trichy'], name: 'B.Tech Electronics & Communication', duration: '4 Years', fees: 145000, level: 'UG', intake: 100, eligibility: 'Class 12 with 75% + JEE Main' },

      // DTU
      { college_id: idMap['dtu-delhi'], name: 'B.Tech Computer Engineering', duration: '4 Years', fees: 200000, level: 'UG', intake: 240, eligibility: 'Class 12 with 60% in PCM + JEE Main' },
      { college_id: idMap['dtu-delhi'], name: 'B.Tech Software Engineering', duration: '4 Years', fees: 200000, level: 'UG', intake: 180, eligibility: 'Class 12 with 60% in PCM + JEE Main' }
    ];

    for (const cr of courses) {
      await pool.query(
        `INSERT INTO courses (college_id, name, duration, fees, level, intake, eligibility)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [cr.college_id, cr.name, cr.duration, cr.fees, cr.level, cr.intake, cr.eligibility]
      );
    }
    console.log('Seeded Courses successfully.');

    // Seed Placements
    const placements = [
      { college_id: idMap['iit-bombay'], year: 2025, highest_package: 168.00, average_package: 24.50, placement_percentage: 97.20, recruiters: ['Google', 'Microsoft', 'Uber', 'Qualcomm', 'Apple'] },
      { college_id: idMap['iit-delhi'], year: 2025, highest_package: 150.00, average_package: 23.80, placement_percentage: 96.50, recruiters: ['Google', 'Microsoft', 'Goldman Sachs', 'Amazon', 'Intel'] },
      { college_id: idMap['iit-madras'], year: 2025, highest_package: 140.00, average_package: 22.40, placement_percentage: 95.80, recruiters: ['Google', 'Microsoft', 'Rubrik', 'Nvidia', 'Texas Instruments'] },
      { college_id: idMap['bits-pilani'], year: 2025, highest_package: 98.50, average_package: 20.10, placement_percentage: 98.00, recruiters: ['Apple', 'Microsoft', 'JPMorgan', 'Oracle', 'Cisco'] },
      { college_id: idMap['nit-trichy'], year: 2025, highest_package: 52.80, average_package: 16.20, placement_percentage: 94.20, recruiters: ['Amazon', 'Qualcomm', 'Intel', 'Samsung', 'Paypal'] },
      { college_id: idMap['dtu-delhi'], year: 2025, highest_package: 84.50, average_package: 15.60, placement_percentage: 92.50, recruiters: ['Microsoft', 'Amazon', 'Adobe', 'Uber', 'Paytm'] }
    ];

    for (const pl of placements) {
      await pool.query(
        `INSERT INTO placements (college_id, year, highest_package, average_package, placement_percentage, recruiters)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [pl.college_id, pl.year, pl.highest_package, pl.average_package, pl.placement_percentage, pl.recruiters]
      );
    }
    console.log('Seeded Placements successfully.');

    // Seed Predictor Cutoffs (Realistic ranks for prediction)
    const cutoffs = [
      // IIT Bombay (JEE Advanced)
      { college_id: idMap['iit-bombay'], exam: 'JEE Advanced', rank_cutoff: 67, category: 'General', branch: 'Computer Science & Engineering', quota: 'AI', year: 2025 },
      { college_id: idMap['iit-bombay'], exam: 'JEE Advanced', rank_cutoff: 350, category: 'OBC', branch: 'Computer Science & Engineering', quota: 'AI', year: 2025 },
      { college_id: idMap['iit-bombay'], exam: 'JEE Advanced', rank_cutoff: 120, category: 'SC', branch: 'Computer Science & Engineering', quota: 'AI', year: 2025 },
      { college_id: idMap['iit-bombay'], exam: 'JEE Advanced', rank_cutoff: 450, category: 'General', branch: 'Electrical Engineering', quota: 'AI', year: 2025 },
      
      // IIT Delhi (JEE Advanced)
      { college_id: idMap['iit-delhi'], exam: 'JEE Advanced', rank_cutoff: 115, category: 'General', branch: 'Computer Science & Engineering', quota: 'AI', year: 2025 },
      { college_id: idMap['iit-delhi'], exam: 'JEE Advanced', rank_cutoff: 580, category: 'OBC', branch: 'Computer Science & Engineering', quota: 'AI', year: 2025 },
      { college_id: idMap['iit-delhi'], exam: 'JEE Advanced', rank_cutoff: 1200, category: 'General', branch: 'Mechanical Engineering', quota: 'AI', year: 2025 },

      // NIT Trichy (JEE Main)
      { college_id: idMap['nit-trichy'], exam: 'JEE Main', rank_cutoff: 1500, category: 'General', branch: 'Computer Science & Engineering', quota: 'AI', year: 2025 },
      { college_id: idMap['nit-trichy'], exam: 'JEE Main', rank_cutoff: 3500, category: 'OBC', branch: 'Computer Science & Engineering', quota: 'AI', year: 2025 },
      { college_id: idMap['nit-trichy'], exam: 'JEE Main', rank_cutoff: 4200, category: 'General', branch: 'Electronics & Communication Engineering', quota: 'AI', year: 2025 },

      // DTU (JEE Main)
      { college_id: idMap['dtu-delhi'], exam: 'JEE Main', rank_cutoff: 6500, category: 'General', branch: 'Computer Engineering', quota: 'HS', year: 2025 },
      { college_id: idMap['dtu-delhi'], exam: 'JEE Main', rank_cutoff: 12000, category: 'General', branch: 'Computer Engineering', quota: 'AI', year: 2025 },
      { college_id: idMap['dtu-delhi'], exam: 'JEE Main', rank_cutoff: 22000, category: 'OBC', branch: 'Computer Engineering', quota: 'HS', year: 2025 },
      { college_id: idMap['dtu-delhi'], exam: 'JEE Main', rank_cutoff: 14500, category: 'General', branch: 'Software Engineering', quota: 'AI', year: 2025 }
    ];

    for (const ct of cutoffs) {
      await pool.query(
        `INSERT INTO predictor_cutoffs (college_id, exam, rank_cutoff, category, branch, quota, year)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [ct.college_id, ct.exam, ct.rank_cutoff, ct.category, ct.branch, ct.quota, ct.year]
      );
    }
    console.log('Seeded Cutoffs successfully.');

    // Seed Reviews
    const reviews = [
      { college_id: idMap['iit-bombay'], user_name: 'Anjali Sharma', rating: 5, comment: 'Phenomenal professors, incredible sports facilities, and an unmatched tech culture. The campus is absolutely gorgeous!' },
      { college_id: idMap['iit-bombay'], user_name: 'Rohan Mehta', rating: 4, comment: 'Placements are superb. Competition is extremely high and can sometimes feel stressful, but overall an amazing place.' },
      { college_id: idMap['bits-pilani'], user_name: 'Siddharth Sen', rating: 5, comment: 'Zero attendance policy gives you complete freedom to build startups or do open-source. Best decision of my life.' }
    ];

    for (const rv of reviews) {
      await pool.query(
        `INSERT INTO reviews (college_id, user_name, rating, comment)
         VALUES ($1, $2, $3, $4)`,
        [rv.college_id, rv.user_name, rv.rating, rv.comment]
      );
    }
    console.log('Seeded Reviews successfully.');

    console.log('Database seeding finished successfully!');
  } catch (error) {
    console.error('Error during database seeding:', error);
  } finally {
    await pool.end();
    console.log('Database connection closed.');
  }
}

seed();
