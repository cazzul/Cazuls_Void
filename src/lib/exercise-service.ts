import { supabase } from './supabase'

export interface Exercise {
  id: number
  name: string
  body_part_id: number
  is_compound: boolean
}

export interface BodyPart {
  id: number
  name: string
  color: string
}

export class ExerciseService {
  // Get all exercise categories from the database
  static async getExercises(): Promise<Exercise[]> {
    const { data, error } = await supabase
      .from('exercise_categories')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching exercises:', error)
      return []
    }

    return data || []
  }

  // Get all body parts from the database
  static async getBodyParts(): Promise<BodyPart[]> {
    const { data, error } = await supabase
      .from('body_parts')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching body parts:', error)
      return []
    }

    return data || []
  }

  // Get exercises by body part
  static async getExercisesByBodyPart(bodyPartId: number): Promise<Exercise[]> {
    const { data, error } = await supabase
      .from('exercise_categories')
      .select('*')
      .eq('body_part_id', bodyPartId)
      .order('name')

    if (error) {
      console.error('Error fetching exercises by body part:', error)
      return []
    }

    return data || []
  }

  // Get exercises by name (for search functionality)
  static async searchExercises(searchTerm: string): Promise<Exercise[]> {
    const { data, error } = await supabase
      .from('exercise_categories')
      .select('*')
      .ilike('name', `%${searchTerm}%`)
      .order('name')
      .limit(20)

    if (error) {
      console.error('Error searching exercises:', error)
      return []
    }

    return data || []
  }

  // Populate database with default exercises if they don't exist
  static async populateDefaultExercises(): Promise<void> {
    try {
      // Check if exercises already exist
      const existingExercises = await this.getExercises()
      if (existingExercises.length > 0) {
        console.log('Exercises already exist in database')
        return
      }

      // Get body parts first
      const bodyParts = await this.getBodyParts()
      if (bodyParts.length === 0) {
        console.error('No body parts found. Please run the database schema first.')
        return
      }

      // Create a mapping of body part names to IDs
      const bodyPartMap = bodyParts.reduce((acc, part) => {
        acc[part.name] = part.id
        return acc
      }, {} as Record<string, number>)

      // Default exercises to insert
      const defaultExercises = [
        // Back exercises
        { name: 'Pull-ups', bodyPart: 'Back', isCompound: true },
        { name: 'Barbell Row', bodyPart: 'Back', isCompound: true },
        { name: 'Lat Pulldown', bodyPart: 'Back', isCompound: false },
        { name: 'Dumbbell Row', bodyPart: 'Back', isCompound: false },
        { name: 'Face Pulls', bodyPart: 'Back', isCompound: false },
        { name: 'T-Bar Row', bodyPart: 'Back', isCompound: true },
        { name: 'Single-Arm Dumbbell Row', bodyPart: 'Back', isCompound: false },

        // Chest exercises
        { name: 'Bench Press', bodyPart: 'Chest', isCompound: true },
        { name: 'Incline Dumbbell Press', bodyPart: 'Chest', isCompound: false },
        { name: 'Push-ups', bodyPart: 'Chest', isCompound: true },
        { name: 'Dips', bodyPart: 'Chest', isCompound: true },
        { name: 'Decline Bench Press', bodyPart: 'Chest', isCompound: true },
        { name: 'Cable Flyes', bodyPart: 'Chest', isCompound: false },
        { name: 'Dumbbell Flyes', bodyPart: 'Chest', isCompound: false },

        // Biceps exercises
        { name: 'Barbell Curl', bodyPart: 'Biceps', isCompound: false },
        { name: 'Hammer Curl', bodyPart: 'Biceps', isCompound: false },
        { name: 'Dumbbell Curl', bodyPart: 'Biceps', isCompound: false },
        { name: 'Preacher Curl', bodyPart: 'Biceps', isCompound: false },
        { name: 'Concentration Curl', bodyPart: 'Biceps', isCompound: false },
        { name: 'Cable Curl', bodyPart: 'Biceps', isCompound: false },

        // Triceps exercises
        { name: 'Overhead Triceps Extension', bodyPart: 'Triceps', isCompound: false },
        { name: 'Skull Crushers', bodyPart: 'Triceps', isCompound: false },
        { name: 'Tricep Pushdown', bodyPart: 'Triceps', isCompound: false },
        { name: 'Diamond Push-ups', bodyPart: 'Triceps', isCompound: true },
        { name: 'Close-Grip Bench Press', bodyPart: 'Triceps', isCompound: true },

        // Shoulder exercises
        { name: 'Overhead Press', bodyPart: 'Shoulders', isCompound: true },
        { name: 'Lateral Raises', bodyPart: 'Shoulders', isCompound: false },
        { name: 'Dumbbell Shoulder Press', bodyPart: 'Shoulders', isCompound: false },
        { name: 'Arnold Press', bodyPart: 'Shoulders', isCompound: false },
        { name: 'Front Raises', bodyPart: 'Shoulders', isCompound: false },
        { name: 'Rear Delt Flyes', bodyPart: 'Shoulders', isCompound: false },
        { name: 'Upright Rows', bodyPart: 'Shoulders', isCompound: true },

        // Leg exercises
        { name: 'Back Squat', bodyPart: 'Quads', isCompound: true },
        { name: 'Romanian Deadlift', bodyPart: 'Hamstrings', isCompound: true },
        { name: 'Bulgarian Split Squat', bodyPart: 'Quads', isCompound: false },
        { name: 'Hip Thrust', bodyPart: 'Hamstrings', isCompound: false },
        { name: 'Leg Curl Machine', bodyPart: 'Hamstrings', isCompound: false },
        { name: 'Calf Raises', bodyPart: 'Calves', isCompound: false },
        { name: 'Front Squat', bodyPart: 'Quads', isCompound: true },
        { name: 'Deadlift', bodyPart: 'Back', isCompound: true },
        { name: 'Leg Press', bodyPart: 'Quads', isCompound: true },
        { name: 'Leg Extension', bodyPart: 'Quads', isCompound: false },
        { name: 'Standing Calf Raises', bodyPart: 'Calves', isCompound: false },
        { name: 'Seated Calf Raises', bodyPart: 'Calves', isCompound: false },

        // Core exercises
        { name: 'Plank', bodyPart: 'Core', isCompound: false },
        { name: 'Russian Twists', bodyPart: 'Core', isCompound: false },
        { name: 'Crunches', bodyPart: 'Core', isCompound: false },
        { name: 'Leg Raises', bodyPart: 'Core', isCompound: false },
        { name: 'Mountain Climbers', bodyPart: 'Core', isCompound: false },
        { name: 'Ab Wheel Rollout', bodyPart: 'Core', isCompound: false },
        { name: 'Hanging Leg Raises', bodyPart: 'Core', isCompound: false }
      ]

      // Insert exercises
      for (const exercise of defaultExercises) {
        const bodyPartId = bodyPartMap[exercise.bodyPart]
        if (bodyPartId) {
          const { error } = await supabase
            .from('exercise_categories')
            .insert([
              {
                name: exercise.name,
                body_part_id: bodyPartId,
                is_compound: exercise.isCompound
              }
            ])
          
          if (error) {
            console.error(`Error inserting exercise ${exercise.name}:`, error)
          }
        }
      }

      console.log('Default exercises populated successfully')
    } catch (error) {
      console.error('Error populating default exercises:', error)
    }
  }
} 