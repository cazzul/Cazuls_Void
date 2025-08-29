-- Database Schema for Cazuls Void Fitness Tracker

-- Body Parts table for categorization
CREATE TABLE body_parts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    color VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exercise Categories table
CREATE TABLE exercise_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    body_part_id INTEGER REFERENCES body_parts(id),
    is_compound BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table (for future multi-user support)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workout Sessions table
CREATE TABLE workout_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) DEFAULT 1,
    workout_type VARCHAR(20) NOT NULL, -- 'lifting', 'running', 'mtb'
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lifting Exercises table
CREATE TABLE lifting_exercises (
    id SERIAL PRIMARY KEY,
    workout_session_id INTEGER REFERENCES workout_sessions(id) ON DELETE CASCADE,
    exercise_name VARCHAR(100) NOT NULL,
    body_part_id INTEGER REFERENCES body_parts(id),
    sets_completed INTEGER DEFAULT 0,
    total_volume INTEGER DEFAULT 0, -- total weight × reps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lifting Sets table
CREATE TABLE lifting_sets (
    id SERIAL PRIMARY KEY,
    lifting_exercise_id INTEGER REFERENCES lifting_exercises(id) ON DELETE CASCADE,
    set_number INTEGER NOT NULL,
    weight DECIMAL(6,2),
    reps INTEGER,
    rpe INTEGER CHECK (rpe >= 1 AND rpe <= 10), -- Rate of Perceived Exertion
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Running Workouts table
CREATE TABLE running_workouts (
    id SERIAL PRIMARY KEY,
    workout_session_id INTEGER REFERENCES workout_sessions(id) ON DELETE CASCADE,
    distance DECIMAL(5,2), -- miles
    duration INTEGER, -- minutes
    pace VARCHAR(10), -- calculated pace
    target_pace VARCHAR(10),
    run_type VARCHAR(20), -- 'easy', 'tempo', 'intervals', 'long', 'recovery'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MTB Workouts table
CREATE TABLE mtb_workouts (
    id SERIAL PRIMARY KEY,
    workout_session_id INTEGER REFERENCES workout_sessions(id) ON DELETE CASCADE,
    distance DECIMAL(5,2), -- miles
    duration INTEGER, -- minutes
    avg_speed DECIMAL(4,2), -- mph
    max_speed DECIMAL(4,2), -- mph
    avg_heart_rate INTEGER,
    max_heart_rate INTEGER,
    ride_type VARCHAR(20), -- 'endurance', 'power', 'recovery', 'climbing'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default body parts
INSERT INTO body_parts (name, color) VALUES
('Back', 'oklch(0.488 0.243 264.376)'),
('Chest', 'oklch(0.645 0.246 16.439)'),
('Biceps', 'oklch(0.696 0.17 162.48)'),
('Triceps', 'oklch(0.769 0.188 70.08)'),
('Shoulders', 'oklch(0.627 0.265 303.9)'),
('Hamstrings', 'oklch(0.488 0.243 264.376)'),
('Quads', 'oklch(0.696 0.17 162.48)'),
('Core', 'oklch(0.769 0.188 70.08)'),
('Calves', 'oklch(0.627 0.265 303.9)');

-- Insert default exercise categories with body part mappings
INSERT INTO exercise_categories (name, body_part_id, is_compound) VALUES
-- Back exercises
('Pull-ups', 1, true),
('Barbell Row', 1, true),
('Lat Pulldown', 1, false),
('Dumbbell Row', 1, false),
('Face Pulls', 1, false),

-- Chest exercises
('Bench Press', 2, true),
('Incline Dumbbell Press', 2, false),
('Push-ups', 2, true),
('Dips', 2, true),

-- Biceps exercises
('Barbell Curl', 3, false),
('Hammer Curl', 3, false),
('Dumbbell Curl', 3, false),

-- Triceps exercises
('Overhead Triceps Extension', 4, false),
('Skull Crushers', 4, false),

-- Shoulder exercises
('Overhead Press', 5, true),
('Lateral Raises', 5, false),
('Dumbbell Shoulder Press', 5, false),

-- Leg exercises
('Back Squat', 7, true),
('Romanian Deadlift', 6, true),
('Bulgarian Split Squat', 7, false),
('Hip Thrust', 6, false),
('Leg Curl Machine', 6, false),
('Calf Raises', 9, false);

-- Insert default user
INSERT INTO users (username, email) VALUES ('cazul', 'cazul@void.com');

-- Create indexes for better performance
CREATE INDEX idx_workout_sessions_date ON workout_sessions(date);
CREATE INDEX idx_workout_sessions_type ON workout_sessions(workout_type);
CREATE INDEX idx_lifting_exercises_body_part ON lifting_exercises(body_part_id);
CREATE INDEX idx_exercise_categories_body_part ON exercise_categories(body_part_id); 