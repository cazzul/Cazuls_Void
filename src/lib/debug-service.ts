import { supabase } from './supabase'

export class DebugService {
  // Check what exercises exist in the database
  static async checkDatabaseExercises() {
    try {
      console.log('🔍 Checking database exercises...');
      
      // Check exercise categories
      const { data: exerciseCategories, error: ecError } = await supabase
        .from('exercise_categories')
        .select('*')
        .order('name');
      
      if (ecError) {
        console.error('Error fetching exercise categories:', ecError);
        return;
      }
      
      console.log('📋 Exercise Categories in Database:');
      exerciseCategories?.forEach(ex => {
        console.log(`  - ${ex.name} (Body Part ID: ${ex.body_part_id})`);
      });
      
      // Check body parts
      const { data: bodyParts, error: bpError } = await supabase
        .from('body_parts')
        .select('*')
        .order('name');
      
      if (bpError) {
        console.error('Error fetching body parts:', bpError);
        return;
      }
      
      console.log('💪 Body Parts in Database:');
      bodyParts?.forEach(bp => {
        console.log(`  - ${bp.name} (ID: ${bp.id}, Color: ${bp.color})`);
      });
      
      // Check recent workout sessions
      const { data: recentWorkouts, error: rwError } = await supabase
        .from('workout_sessions')
        .select(`
          id,
          date,
          workout_type,
          lifting_exercises (
            id,
            exercise_name,
            body_part_id,
            sets_completed
          )
        `)
        .eq('workout_type', 'lifting')
        .order('date', { ascending: false })
        .limit(5);
      
      if (rwError) {
        console.error('Error fetching recent workouts:', rwError);
        return;
      }
      
      console.log('🏋️ Recent Workout Sessions:');
      recentWorkouts?.forEach(workout => {
        console.log(`  📅 ${workout.date} (ID: ${workout.id})`);
        workout.lifting_exercises?.forEach(exercise => {
          console.log(`    - ${exercise.exercise_name} (${exercise.sets_completed} sets, Body Part ID: ${exercise.body_part_id})`);
        });
      });
      
    } catch (error) {
      console.error('Error in debug service:', error);
    }
  }

  // Test body part mapping for specific exercises
  static async testExerciseMapping() {
    const testExercises = [
      'Back Squat',
      'Romanian Deadlift', 
      'Dumbbell Curls',
      'Iso Tricep Extensions',
      'Lateral Raises'
    ];
    
    console.log('🧪 Testing exercise mapping...');
    
    for (const exercise of testExercises) {
      console.log(`\n📝 Testing: "${exercise}"`);
      
      // Import the DatabaseService to test the mapping
      try {
        const { DatabaseService } = await import('./database-service');
        const bodyPart = (DatabaseService as any).getBodyPartForExercise(exercise);
        console.log(`  ✅ Mapped to: ${bodyPart}`);
        
        // Try to get the body part ID
        try {
          const bodyPartId = await (DatabaseService as any).getBodyPartId(bodyPart);
          console.log(`  ✅ Body Part ID: ${bodyPartId}`);
        } catch (error) {
          console.log(`  ❌ Failed to get Body Part ID:`, error);
        }
        
      } catch (error) {
        console.log(`  ❌ Error testing mapping:`, error);
      }
    }
  }

  // Check if specific exercises exist in exercise_categories
  static async checkSpecificExercises() {
    const exercisesToCheck = [
      'Back Squat',
      'Romanian Deadlift',
      'Dumbbell Curls', 
      'Iso Tricep Extensions',
      'Lateral Raises'
    ];
    
    console.log('🔍 Checking specific exercises in database...');
    
    for (const exercise of exercisesToCheck) {
      const { data, error } = await supabase
        .from('exercise_categories')
        .select('*')
        .ilike('name', `%${exercise}%`);
      
      if (error) {
        console.log(`  ❌ Error checking "${exercise}":`, error);
        continue;
      }
      
      if (data && data.length > 0) {
        console.log(`  ✅ "${exercise}" found:`, data.map(d => d.name));
      } else {
        console.log(`  ❌ "${exercise}" NOT found in database`);
      }
    }
  }

  // Run all debug checks
  static async runAllChecks() {
    console.log('🚀 Running all debug checks...\n');
    
    await this.checkDatabaseExercises();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await this.checkSpecificExercises();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await this.testExerciseMapping();
    
    console.log('\n✅ Debug checks complete!');
  }
} 