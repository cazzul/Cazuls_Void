-- Working Sets View for Records Page
-- This view combines all working sets with muscle group information
-- Run this in your Supabase SQL Editor

CREATE OR REPLACE VIEW working_sets_view AS
SELECT 
    ws.id as workout_session_id,
    ws.date,
    ws.workout_type,
    le.id as exercise_id,
    le.exercise_name,
    bp.name as muscle_group,
    bp.color as muscle_group_color,
    ls.id as set_id,
    ls.set_number,
    ls.weight,
    ls.reps,
    ls.rpe,
    ls.created_at as set_created_at,
    -- Calculate total volume for this set
    COALESCE(ls.weight * ls.reps, 0) as set_volume,
    -- Add a unique identifier for sorting
    ROW_NUMBER() OVER (ORDER BY ws.date DESC, le.exercise_name, ls.set_number) as sort_order
FROM workout_sessions ws
JOIN lifting_exercises le ON ws.id = le.workout_session_id
JOIN body_parts bp ON le.body_part_id = bp.id
JOIN lifting_sets ls ON le.id = ls.lifting_exercise_id
WHERE ws.workout_type = 'lifting'
  AND ls.weight > 0  -- Only include actual working sets
  AND ls.reps > 0    -- Only include sets with reps
ORDER BY ws.date DESC, le.exercise_name, ls.set_number;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_working_sets_date ON workout_sessions(date);
CREATE INDEX IF NOT EXISTS idx_working_sets_exercise ON lifting_exercises(exercise_name);
CREATE INDEX IF NOT EXISTS idx_working_sets_body_part ON body_parts(name);
CREATE INDEX IF NOT EXISTS idx_working_sets_weight ON lifting_sets(weight);
CREATE INDEX IF NOT EXISTS idx_working_sets_reps ON lifting_sets(reps);

-- Grant permissions (if using RLS)
-- ALTER VIEW working_sets_view SET (security_invoker = true);

-- Test the view
-- SELECT * FROM working_sets_view LIMIT 10; 