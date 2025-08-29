import { supabase } from './supabase'

export interface WorkoutData {
  date: string
  workoutType: 'lifting' | 'running' | 'mtb'
  exercises?: Array<{
    name: string
    sets: number
    bodyPart: string
  }>
  distance?: number
  duration?: number
}

export interface ExerciseSet {
  weight: number
  reps: number
}

export interface ExerciseData {
  name: string
  sets: ExerciseSet[]
  bodyPart?: string
}

export class DatabaseService {
  // Save lifting workout
  static async saveLiftingWorkout(date: string, exercises: ExerciseData[]) {
    try {
      console.log('Starting to save lifting workout:', { date, exercisesCount: exercises.length });
      
      // First, create the workout session
      const { data: sessionData, error: sessionError } = await supabase
        .from('workout_sessions')
        .insert([
          {
            workout_type: 'lifting',
            date: date,
            notes: 'Lifting workout'
          }
        ])
        .select()
        .single()

      if (sessionError) {
        console.error('Error creating workout session:', sessionError);
        throw sessionError;
      }

      console.log('Workout session created successfully:', sessionData.id);

      // Save exercises and their sets
      for (const exercise of exercises) {
        try {
          console.log('Processing exercise:', exercise.name);
          
          // Get body part for the exercise
          const bodyPart = this.getBodyPartForExercise(exercise.name);
          console.log(`Exercise "${exercise.name}" mapped to body part: ${bodyPart}`);
          
          const bodyPartId = await this.getBodyPartId(bodyPart);
          console.log(`Body part "${bodyPart}" has ID: ${bodyPartId}`);
          
          // Insert the exercise
          const { data: exerciseData, error: exerciseError } = await supabase
            .from('lifting_exercises')
            .insert([
              {
                workout_session_id: sessionData.id,
                exercise_name: exercise.name,
                body_part_id: bodyPartId,
                sets_completed: exercise.sets.length
              }
            ])
            .select()
            .single()

          if (exerciseError) {
            console.error(`Error inserting exercise "${exercise.name}":`, exerciseError);
            throw exerciseError;
          }

          console.log(`Exercise "${exercise.name}" inserted successfully with ID: ${exerciseData.id}`);

          // Insert individual sets
          for (let i = 0; i < exercise.sets.length; i++) {
            const set = exercise.sets[i];
            const { error: setError } = await supabase
              .from('lifting_sets')
              .insert([
                {
                  lifting_exercise_id: exerciseData.id,
                  set_number: i + 1,
                  weight: set.weight,
                  reps: set.reps
                }
              ])

            if (setError) {
              console.error(`Error inserting set ${i + 1} for exercise "${exercise.name}":`, setError);
              throw setError;
            }
          }

          console.log(`All ${exercise.sets.length} sets for "${exercise.name}" inserted successfully`);
          
        } catch (exerciseError) {
          console.error(`Failed to process exercise "${exercise.name}":`, exerciseError);
          // Continue with other exercises instead of failing completely
          console.warn(`Skipping exercise "${exercise.name}" and continuing with others...`);
        }
      }

      console.log('Lifting workout saved successfully');
      return sessionData;
    } catch (error) {
      console.error('Error saving lifting workout:', error);
      throw error;
    }
  }

  // Save running workout to database
  static async saveRunningWorkout(date: string, distance: number, duration: number, runType: string, notes?: string): Promise<any> {
    try {
      console.log('Starting to save running workout:', { date, distance, duration, runType, notes });
      
      // Create workout session
      const { data: sessionData, error: sessionError } = await supabase
        .from('workout_sessions')
        .insert([{ workout_type: 'running', date: date, notes: notes || 'Running workout' }])
        .select()
        .single();

      if (sessionError) {
        console.error('Error creating running workout session:', sessionError);
        throw sessionError;
      }
      console.log('Running workout session created successfully:', sessionData.id);

      // Create running workout record
      const { data: runningData, error: runningError } = await supabase
        .from('running_workouts')
        .insert([{
          workout_session_id: sessionData.id,
          distance: distance,
          duration: duration,
          run_type: runType,
          notes: notes
        }])
        .select()
        .single();

      if (runningError) {
        console.error('Error creating running workout record:', runningError);
        throw runningError;
      }
      console.log('Running workout record created successfully:', runningData.id);

      return sessionData;
    } catch (error) {
      console.error('Error saving running workout:', error);
      throw error;
    }
  }

  // Save MTB workout to database
  static async saveMTBWorkout(
    date: string, 
    distance: number, 
    duration: number, 
    rideType: string, 
    avgSpeed?: number, 
    maxSpeed?: number, 
    avgHeartRate?: number, 
    maxHeartRate?: number, 
    notes?: string
  ): Promise<any> {
    try {
      console.log('Starting to save MTB workout:', { 
        date, distance, duration, rideType, avgSpeed, maxSpeed, avgHeartRate, maxHeartRate, notes 
      });
      
      // Create workout session
      const { data: sessionData, error: sessionError } = await supabase
        .from('workout_sessions')
        .insert([{ workout_type: 'mtb', date: date, notes: notes || 'MTB workout' }])
        .select()
        .single();

      if (sessionError) {
        console.error('Error creating MTB workout session:', sessionError);
        throw sessionError;
      }
      console.log('MTB workout session created successfully:', sessionData.id);

      // Create MTB workout record
      const { data: mtbData, error: mtbError } = await supabase
        .from('mtb_workouts')
        .insert([{
          workout_session_id: sessionData.id,
          distance: distance,
          duration: duration,
          ride_type: rideType,
          avg_speed: avgSpeed,
          max_speed: maxSpeed,
          avg_heart_rate: avgHeartRate,
          max_heart_rate: maxHeartRate,
          notes: notes
        }])
        .select()
        .single();

      if (mtbError) {
        console.error('Error creating MTB workout record:', mtbError);
        throw mtbError;
      }
      console.log('MTB workout record created successfully:', mtbData.id);

      return sessionData;
    } catch (error) {
      console.error('Error saving MTB workout:', error);
      throw error;
    }
  }

  // Get workouts for chart
  static async getWeeklyWorkouts(startDate: string, endDate: string): Promise<WorkoutData[]> {
    const { data: sessions, error } = await supabase
      .from('workout_sessions')
      .select(`
        *,
        lifting_exercises (*),
        running_workouts (*),
        mtb_workouts (*)
      `)
      .gte('date', startDate)
      .lte('date', endDate)

    if (error) throw error

    return sessions.map(session => {
      if (session.workout_type === 'lifting') {
        return {
          date: session.date,
          workoutType: 'lifting',
          exercises: session.lifting_exercises.map((ex: any) => ({
            name: ex.exercise_name,
            sets: ex.sets_completed,
            bodyPart: this.getBodyPartForExercise(ex.exercise_name)
          }))
        }
      } else if (session.workout_type === 'running') {
        return {
          date: session.date,
          workoutType: 'running',
          distance: session.running_workouts[0]?.distance,
          duration: session.running_workouts[0]?.duration
        }
      } else if (session.workout_type === 'mtb') {
        return {
          date: session.date,
          workoutType: 'mtb',
          distance: session.mtb_workouts[0]?.distance,
          duration: session.mtb_workouts[0]?.duration
        }
      }
    }).filter(Boolean) as WorkoutData[]
  }

  private static exerciseToBodyPart: Record<string, string> = {
    // Back exercises
    'Pull-ups': 'Back',
    'Barbell Row': 'Back',
    'Lat Pulldown': 'Back',
    'Dumbbell Row': 'Back',
    'Face Pulls': 'Back',
    'T-Bar Row': 'Back',
    'Single-Arm Dumbbell Row': 'Back',
    'Deadlift': 'Back',
    
    // Chest exercises
    'Bench Press': 'Chest',
    'Incline Dumbbell Press': 'Chest',
    'Push-ups': 'Chest',
    'Dips': 'Chest',
    'Decline Bench Press': 'Chest',
    'Cable Flyes': 'Chest',
    'Dumbbell Flyes': 'Chest',
    
    // Biceps exercises
    'Barbell Curl': 'Biceps',
    'Barbell Curls': 'Biceps',
    'Hammer Curl': 'Biceps',
    'Hammer Curls': 'Biceps',
    'Dumbbell Curl': 'Biceps',
    'Dumbbell Curls': 'Biceps',
    'Preacher Curl': 'Biceps',
    'Preacher Curls': 'Biceps',
    'Concentration Curl': 'Biceps',
    'Concentration Curls': 'Biceps',
    'Cable Curl': 'Biceps',
    'Cable Curls': 'Biceps',
    
    // Triceps exercises
    'Overhead Triceps Extension': 'Triceps',
    'Overhead Tricep Extension': 'Triceps',
    'Overhead Tricep Extensions': 'Triceps',
    'Iso Tricep Extension': 'Triceps',
    'Iso Tricep Extensions': 'Triceps',
    'Skull Crushers': 'Triceps',
    'Tricep Pushdown': 'Triceps',
    'Diamond Push-ups': 'Triceps',
    'Close-Grip Bench Press': 'Triceps',
    
    // Shoulder exercises
    'Overhead Press': 'Shoulders',
    'Lateral Raises': 'Shoulders',
    'Lateral Raise': 'Shoulders',
    'Dumbbell Shoulder Press': 'Shoulders',
    'Arnold Press': 'Shoulders',
    'Front Raises': 'Shoulders',
    'Front Raise': 'Shoulders',
    'Rear Delt Flyes': 'Shoulders',
    'Rear Delt Flye': 'Shoulders',
    'Upright Rows': 'Shoulders',
    'Upright Row': 'Shoulders',
    
    // Leg exercises
    'Back Squat': 'Quads',
    'Back Squats': 'Quads',
    'Front Squat': 'Quads',
    'Front Squats': 'Quads',
    'Romanian Deadlift': 'Hamstrings',
    'Romanian Deadlifts': 'Hamstrings',
    'Bulgarian Split Squat': 'Quads',
    'Bulgarian Split Squats': 'Quads',
    'Hip Thrust': 'Hamstrings',
    'Hip Thrusts': 'Hamstrings',
    'Leg Curl Machine': 'Hamstrings',
    'Leg Press': 'Quads',
    'Leg Extension': 'Quads',
    
    // Core exercises
    'Plank': 'Core',
    'Russian Twists': 'Core',
    'Crunches': 'Core',
    'Leg Raises': 'Core',
    'Mountain Climbers': 'Core',
    'Ab Wheel Rollout': 'Core',
    'Hanging Leg Raises': 'Core',
    
    // Calf exercises
    'Calf Raises': 'Calves',
    'Standing Calf Raises': 'Calves',
    'Seated Calf Raises': 'Calves'
  }

  private static getBodyPartForExercise(exerciseName: string): string {
    // First try exact match
    if (this.exerciseToBodyPart[exerciseName]) {
      return this.exerciseToBodyPart[exerciseName];
    }
    
    // Try to find partial matches for common variations
    const normalizedName = exerciseName.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    for (const [exercise, bodyPart] of Object.entries(this.exerciseToBodyPart)) {
      const normalizedExercise = exercise.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (normalizedName.includes(normalizedExercise) || normalizedExercise.includes(normalizedName)) {
        console.log(`Found partial match: "${exerciseName}" -> "${exercise}" -> ${bodyPart}`);
        return bodyPart;
      }
    }
    
    // If still no match, try to guess based on exercise name keywords
    if (exerciseName.toLowerCase().includes('curl')) return 'Biceps';
    if (exerciseName.toLowerCase().includes('tricep') || exerciseName.toLowerCase().includes('triceps')) return 'Triceps';
    if (exerciseName.toLowerCase().includes('squat')) return 'Quads';
    if (exerciseName.toLowerCase().includes('deadlift')) return 'Hamstrings';
    if (exerciseName.toLowerCase().includes('press') || exerciseName.toLowerCase().includes('push')) return 'Chest';
    if (exerciseName.toLowerCase().includes('row') || exerciseName.toLowerCase().includes('pull')) return 'Back';
    if (exerciseName.toLowerCase().includes('raise') || exerciseName.toLowerCase().includes('shoulder')) return 'Shoulders';
    if (exerciseName.toLowerCase().includes('crunch') || exerciseName.toLowerCase().includes('plank')) return 'Core';
    if (exerciseName.toLowerCase().includes('calf')) return 'Calves';
    
    console.warn(`Could not determine body part for exercise: "${exerciseName}". Defaulting to 'Other'.`);
    return 'Other';
  }

  private static async getBodyPartId(bodyPartName: string): Promise<number> {
    try {
      // If body part is 'Other', try to find a default one or create a generic one
      if (bodyPartName === 'Other') {
        console.warn('Exercise mapped to "Other" body part, using default body part ID');
        // Try to use 'Core' as a default fallback
        const { data: coreData, error: coreError } = await supabase
          .from('body_parts')
          .select('id')
          .eq('name', 'Core')
          .single();
        
        if (!coreError && coreData) {
          return coreData.id;
        }
      }

      const { data, error } = await supabase
        .from('body_parts')
        .select('id')
        .eq('name', bodyPartName)
        .single()

      if (error) {
        console.error(`Error finding body part "${bodyPartName}":`, error);
        // Try to find any available body part as fallback
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('body_parts')
          .select('id')
          .limit(1)
          .single();
        
        if (fallbackError) {
          throw new Error(`Could not find body part "${bodyPartName}" and no fallback available`);
        }
        
        console.warn(`Using fallback body part ID ${fallbackData.id} for "${bodyPartName}"`);
        return fallbackData.id;
      }
      
      return data.id;
    } catch (error) {
      console.error(`Failed to get body part ID for "${bodyPartName}":`, error);
      throw error;
    }
  }
}