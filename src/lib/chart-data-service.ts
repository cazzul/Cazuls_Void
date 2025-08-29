import { WeeklyVolumeData } from '@/components/weekly-volume-chart';

export interface WorkoutData {
  date: string;
  workoutType: 'lifting' | 'running' | 'mtb';
  exercises?: Array<{
    name: string;
    sets: number;
    bodyPart: string;
  }>;
  distance?: number;
  duration?: number;
}

export class ChartDataService {
  // Map exercises to body parts (this would come from database in production)
  private static exerciseToBodyPart: Record<string, string> = {
    // Back exercises
    'Pull-ups': 'Back',
    'Barbell Row': 'Back',
    'Lat Pulldown': 'Back',
    'Dumbbell Row': 'Back',
    'Face Pulls': 'Back',
    'Pull-Ups': 'Back',
    
    // Chest exercises
    'Bench Press': 'Chest',
    'Incline Dumbbell Press': 'Chest',
    'Push-ups': 'Chest',
    'Dips': 'Chest',
    'Incline Barbell Press': 'Chest',
    
    // Biceps exercises
    'Barbell Curl': 'Biceps',
    'Hammer Curl': 'Biceps',
    'Dumbbell Curl': 'Biceps',
    
    // Triceps exercises
    'Overhead Triceps Extension': 'Triceps',
    'Skull Crushers': 'Triceps',
    
    // Shoulder exercises
    'Overhead Press': 'Shoulders',
    'Lateral Raises': 'Shoulders',
    'Dumbbell Shoulder Press': 'Shoulders',
    'Seated Dumbbell Shoulder Press': 'Shoulders',
    
    // Leg exercises
    'Back Squat': 'Quads',
    'Romanian Deadlift': 'Hamstrings',
    'Bulgarian Split Squat': 'Quads',
    'Hip Thrust': 'Hamstrings',
    'Leg Curl Machine': 'Hamstrings',
    'Calf Raises': 'Calves',
  };

  // Get body part for an exercise
  static getBodyPartForExercise(exerciseName: string): string {
    return this.exerciseToBodyPart[exerciseName] || 'Other';
  }

  // Generate weekly volume data from workout data
  static generateWeeklyVolumeData(workouts: WorkoutData[]): WeeklyVolumeData[] {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyData: WeeklyVolumeData[] = days.map(day => ({
      day,
      Back: 0,
      Chest: 0,
      Biceps: 0,
      Triceps: 0,
      Shoulders: 0,
      Hamstrings: 0,
      Quads: 0,
      Running: 0,
      Biking: 0,
    }));

    // Process each workout
    workouts.forEach(workout => {
      const date = new Date(workout.date);
      const dayIndex = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
      
      if (workout.workoutType === 'lifting' && workout.exercises) {
        // Process lifting exercises
        workout.exercises.forEach(exercise => {
          const bodyPart = this.getBodyPartForExercise(exercise.name);
          if (bodyPart in weeklyData[dayIndex]) {
            weeklyData[dayIndex][bodyPart as keyof WeeklyVolumeData] += exercise.sets;
          }
        });
      } else if (workout.workoutType === 'running' && workout.distance) {
        // Process running workouts
        weeklyData[dayIndex].Running += workout.distance;
      } else if (workout.workoutType === 'mtb' && workout.distance) {
        // Process MTB workouts
        weeklyData[dayIndex].Biking += workout.distance;
      }
    });

    return weeklyData;
  }

  // Get current week's data (for demo purposes)
  static getCurrentWeekData(): WeeklyVolumeData[] {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.map((day, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      
      return {
        day,
        Back: 0,
        Chest: 0,
        Biceps: 0,
        Triceps: 0,
        Shoulders: 0,
        Hamstrings: 0,
        Quads: 0,
        Running: 0,
        Biking: 0,
      };
    });
  }

  // Aggregate data by body part for a specific date range
  static aggregateByBodyPart(workouts: WorkoutData[], startDate: Date, endDate: Date) {
    const bodyPartTotals: Record<string, number> = {};
    
    workouts.forEach(workout => {
      const workoutDate = new Date(workout.date);
      if (workoutDate >= startDate && workoutDate <= endDate) {
        if (workout.workoutType === 'lifting' && workout.exercises) {
          workout.exercises.forEach(exercise => {
            const bodyPart = this.getBodyPartForExercise(exercise.name);
            bodyPartTotals[bodyPart] = (bodyPartTotals[bodyPart] || 0) + exercise.sets;
          });
        }
      }
    });
    
    return bodyPartTotals;
  }
} 