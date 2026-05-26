-- CampusLens Database Schema (PostgreSQL DDL)

-- Enable UUID extension if needed, but simple SERIAL or bigserial is standard and reliable
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user', -- 'user' or 'admin'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS colleges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    location VARCHAR(255) NOT NULL,
    state VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- e.g., 'Government', 'Private', 'Autonomous'
    fees INT NOT NULL, -- Average annual fees in INR
    rating NUMERIC(3, 2) DEFAULT 0.00, -- Average rating out of 5
    logo_url VARCHAR(500),
    cover_url VARCHAR(500),
    overview TEXT NOT NULL,
    established INT,
    ranking INT, -- NIRF ranking
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    college_id INT REFERENCES colleges(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    duration VARCHAR(50) NOT NULL, -- e.g., '4 Years', '2 Years'
    fees INT NOT NULL, -- Annual fee in INR
    level VARCHAR(50) NOT NULL, -- 'UG' or 'PG'
    intake INT,
    eligibility TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS placements (
    id SERIAL PRIMARY KEY,
    college_id INT REFERENCES colleges(id) ON DELETE CASCADE,
    year INT NOT NULL,
    highest_package NUMERIC(5, 2) NOT NULL, -- In LPA, e.g., 45.50
    average_package NUMERIC(5, 2) NOT NULL, -- In LPA, e.g., 12.30
    placement_percentage NUMERIC(5, 2), -- e.g., 95.50
    recruiters TEXT[], -- Array of recruiter names
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    college_id INT REFERENCES colleges(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    user_name VARCHAR(255) NOT NULL, -- Denormalized in case user is deleted
    rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS predictor_cutoffs (
    id SERIAL PRIMARY KEY,
    college_id INT REFERENCES colleges(id) ON DELETE CASCADE,
    exam VARCHAR(50) NOT NULL, -- 'JEE Main', 'JEE Advanced', 'GATE', 'CAT'
    rank_cutoff INT NOT NULL, -- Closing rank
    category VARCHAR(50) NOT NULL, -- 'General', 'OBC', 'SC', 'ST', 'EWS'
    branch VARCHAR(255) NOT NULL, -- e.g., 'Computer Science & Engineering'
    quota VARCHAR(50) DEFAULT 'AI', -- 'AI' (All India), 'HS' (Home State)
    year INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    user_name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    views INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS answers (
    id SERIAL PRIMARY KEY,
    question_id INT REFERENCES questions(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    user_name VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS votes (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    question_id INT REFERENCES questions(id) ON DELETE CASCADE,
    answer_id INT REFERENCES answers(id) ON DELETE CASCADE,
    vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('up', 'down')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT one_vote_target CHECK (
        (question_id IS NOT NULL AND answer_id IS NULL) OR
        (question_id IS NULL AND answer_id IS NOT NULL)
    ),
    CONSTRAINT unique_user_question_vote UNIQUE (user_id, question_id),
    CONSTRAINT unique_user_answer_vote UNIQUE (user_id, answer_id)
);

CREATE TABLE IF NOT EXISTS saved_colleges (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    college_id INT REFERENCES colleges(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, college_id)
);

CREATE TABLE IF NOT EXISTS saved_comparisons (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    college_ids INT[] NOT NULL, -- Array of college IDs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for fast querying
CREATE INDEX IF NOT EXISTS idx_colleges_slug ON colleges(slug);
CREATE INDEX IF NOT EXISTS idx_colleges_location ON colleges(state, city);
CREATE INDEX IF NOT EXISTS idx_colleges_fees ON colleges(fees);
CREATE INDEX IF NOT EXISTS idx_colleges_rating ON colleges(rating);
CREATE INDEX IF NOT EXISTS idx_courses_college_id ON courses(college_id);
CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(level);
CREATE INDEX IF NOT EXISTS idx_placements_college_id ON placements(college_id);
CREATE INDEX IF NOT EXISTS idx_reviews_college_id ON reviews(college_id);
CREATE INDEX IF NOT EXISTS idx_predictor_cutoffs_exam ON predictor_cutoffs(exam, rank_cutoff);
CREATE INDEX IF NOT EXISTS idx_questions_created_at ON questions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_answers_question_id ON answers(question_id);
