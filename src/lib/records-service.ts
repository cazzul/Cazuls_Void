import { supabase } from './supabase'

export interface WorkingSet {
  id: number
  date: string
  muscleGroup: string
  muscleColor: string
  exerciseName: string
  weight: number
  reps: number
  setNumber: number
  workoutId: number
  createdAt: string
}

export interface UnifiedWorkoutRecord {
  id: string
  date: string
  workoutType: 'lifting' | 'running' | 'mtb'
  type: string // 'Back Squat', 'Easy Run', 'Endurance Ride'
  category: string // 'Quads', 'Endurance', 'Power'
  color: string // muscle group color or workout type color
  
  // Lifting-specific
  weight?: number
  reps?: number
  setNumber?: number
  
  // Running/MTB-specific
  distance?: number
  duration?: number
  pace?: string
  speed?: number
  avgHeartRate?: number
  maxHeartRate?: number
  
  // Common
  notes?: string
  createdAt: string
  workoutId: number
}

export interface RecordsFilters {
  searchTerm?: string
  workoutTypes?: ('lifting' | 'running' | 'mtb')[]
  muscleGroups?: string[]
  dateRange?: {
    start: string
    end: string
  }
  exerciseName?: string
}

export interface SortConfig<T> {
  field: keyof T
  direction: 'asc' | 'desc'
}

export interface WorkingSetSortConfig extends SortConfig<WorkingSet> {}
export interface UnifiedWorkoutSortConfig extends SortConfig<UnifiedWorkoutRecord> {}

export class RecordsService {
  // Get all workout types with unified data structure
  static async getAllUnifiedWorkouts(
    filters: RecordsFilters = {},
    sortConfig: UnifiedWorkoutSortConfig = { field: 'date', direction: 'desc' }
  ): Promise<UnifiedWorkoutRecord[]> {
    try {
      let allWorkouts: UnifiedWorkoutRecord[] = [];

      // Fetch lifting workouts
      if (!filters.workoutTypes || filters.workoutTypes.includes('lifting')) {
        const liftingWorkouts = await this.getLiftingWorkoutsForUnified(filters);
        allWorkouts.push(...liftingWorkouts);
      }

      // Fetch running workouts
      if (!filters.workoutTypes || filters.workoutTypes.includes('running')) {
        const runningWorkouts = await this.getRunningWorkoutsForUnified(filters);
        allWorkouts.push(...runningWorkouts);
      }

      // Fetch MTB workouts
      if (!filters.workoutTypes || filters.workoutTypes.includes('mtb')) {
        const mtbWorkouts = await this.getMTBWorkoutsForUnified(filters);
        allWorkouts.push(...mtbWorkouts);
      }

      // Apply search filter
      let filteredWorkouts = allWorkouts;
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filteredWorkouts = allWorkouts.filter(workout =>
          workout.type.toLowerCase().includes(searchLower) ||
          workout.category.toLowerCase().includes(searchLower) ||
          (workout.notes && workout.notes.toLowerCase().includes(searchLower))
        );
      }

      // Apply muscle group filter (for lifting workouts)
      if (filters.muscleGroups && filters.muscleGroups.length > 0) {
        filteredWorkouts = filteredWorkouts.filter(workout =>
          workout.workoutType !== 'lifting' || filters.muscleGroups!.includes(workout.category)
        );
      }

      // Apply date range filter
      if (filters.dateRange) {
        filteredWorkouts = filteredWorkouts.filter(workout =>
          workout.date >= filters.dateRange!.start && workout.date <= filters.dateRange!.end
        );
      }

      // Sort the unified data
      return this.sortUnifiedWorkouts(filteredWorkouts, sortConfig);
    } catch (error) {
      console.error('Error fetching unified workouts:', error);
      return [];
    }
  }

  // Get lifting workouts formatted for unified display
  private static async getLiftingWorkoutsForUnified(filters: RecordsFilters): Promise<UnifiedWorkoutRecord[]> {
    try {
      const { data, error } = await supabase
        .from('workout_sessions')
        .select(`
          id,
          date,
          lifting_exercises (
            id,
            exercise_name,
            body_part_id,
            lifting_sets (
              id,
              weight,
              reps,
              set_number,
              created_at
            )
          )
        `)
        .eq('workout_type', 'lifting')
        .order('date', { ascending: false });

      if (error) throw error;

      // Get all body parts for mapping
      const { data: bodyPartsData } = await supabase
        .from('body_parts')
        .select('id, name, color');

      const bodyPartsMap = new Map(
        bodyPartsData?.map(bp => [bp.id, { name: bp.name, color: bp.color }]) || []
      );

      const unifiedWorkouts: UnifiedWorkoutRecord[] = [];
      
      data?.forEach(session => {
        session.lifting_exercises?.forEach(exercise => {
          const bodyPart = bodyPartsMap.get(exercise.body_part_id);
          exercise.lifting_sets?.forEach(set => {
            unifiedWorkouts.push({
              id: set.id.toString(),
              date: session.date,
              workoutType: 'lifting',
              type: exercise.exercise_name,
              category: bodyPart?.name || 'Unknown',
              color: bodyPart?.color || '#666',
              weight: set.weight || 0,
              reps: set.reps || 0,
              setNumber: set.set_number,
              workoutId: session.id,
              createdAt: set.created_at
            });
          });
        });
      });

      return unifiedWorkouts;
    } catch (error) {
      console.error('Error fetching lifting workouts for unified:', error);
      return [];
    }
  }

  // Get running workouts formatted for unified display
  private static async getRunningWorkoutsForUnified(filters: RecordsFilters): Promise<UnifiedWorkoutRecord[]> {
    try {
      const { data, error } = await supabase
        .from('workout_sessions')
        .select(`
          id,
          date,
          running_workouts (
            id,
            distance,
            duration,
            pace,
            run_type,
            notes,
            created_at
          )
        `)
        .eq('workout_type', 'running')
        .order('date', { ascending: false });

      if (error) throw error;

      const unifiedWorkouts: UnifiedWorkoutRecord[] = [];
      
      data?.forEach(session => {
        session.running_workouts?.forEach(run => {
          // Calculate pace if not provided
          let calculatedPace = run.pace;
          if (!calculatedPace && run.distance && run.duration) {
            calculatedPace = this.formatPace(run.duration, run.distance);
          }

          unifiedWorkouts.push({
            id: run.id.toString(),
            date: session.date,
            workoutType: 'running',
            type: `${run.run_type} Run`,
            category: this.getRunningCategory(run.run_type),
            color: this.getRunningColor(run.run_type),
            distance: run.distance,
            duration: run.duration,
            pace: calculatedPace,
            notes: run.notes,
            workoutId: session.id,
            createdAt: run.created_at
          });
        });
      });

      return unifiedWorkouts;
    } catch (error) {
      console.error('Error fetching running workouts for unified:', error);
      return [];
    }
  }

  // Get MTB workouts formatted for unified display
  private static async getMTBWorkoutsForUnified(filters: RecordsFilters): Promise<UnifiedWorkoutRecord[]> {
    try {
      const { data, error } = await supabase
        .from('workout_sessions')
        .select(`
          id,
          date,
          mtb_workouts (
            id,
            distance,
            duration,
            avg_speed,
            max_speed,
            avg_heart_rate,
            max_heart_rate,
            ride_type,
            notes,
            created_at
          )
        `)
        .eq('workout_type', 'mtb')
        .order('date', { ascending: false });

      if (error) throw error;

      const unifiedWorkouts: UnifiedWorkoutRecord[] = [];
      
      data?.forEach(session => {
        session.mtb_workouts?.forEach(ride => {
          unifiedWorkouts.push({
            id: ride.id.toString(),
            date: session.date,
            workoutType: 'mtb',
            type: `${ride.ride_type} Ride`,
            category: this.getMTBCategory(ride.ride_type),
            color: this.getMTBColor(ride.ride_type),
            distance: ride.distance,
            duration: ride.duration,
            speed: ride.avg_speed,
            avgHeartRate: ride.avg_heart_rate,
            maxHeartRate: ride.max_heart_rate,
            notes: ride.notes,
            workoutId: session.id,
            createdAt: ride.created_at
          });
        });
      });

      return unifiedWorkouts;
    } catch (error) {
      console.error('Error fetching MTB workouts for unified:', error);
      return [];
    }
  }

  // Get running category and color
  private static getRunningCategory(runType: string): string {
    const categories: Record<string, string> = {
      'easy': 'Recovery',
      'tempo': 'Tempo',
      'intervals': 'Speed',
      'long': 'Endurance',
      'recovery': 'Recovery'
    };
    return categories[runType] || 'General';
  }

  private static getRunningColor(runType: string): string {
    const colors: Record<string, string> = {
      'easy': 'var(--color-easy-run)',
      'tempo': 'var(--color-tempo-run)',
      'intervals': 'var(--color-intervals)',
      'long': 'var(--color-long-run)',
      'recovery': 'var(--color-recovery)'
    };
    return colors[runType] || 'var(--color-secondary)';
  }

  // Get MTB category and color
  private static getMTBCategory(rideType: string): string {
    const categories: Record<string, string> = {
      'endurance': 'Endurance',
      'power': 'Power',
      'recovery': 'Recovery',
      'climbing': 'Climbing'
    };
    return categories[rideType] || 'General';
  }

  private static getMTBColor(rideType: string): string {
    const colors: Record<string, string> = {
      'endurance': 'var(--color-endurance)',
      'power': 'var(--color-power)',
      'recovery': 'var(--color-recovery)',
      'climbing': 'var(--color-climbing)'
    };
    return colors[rideType] || 'var(--color-secondary)';
  }

  // Get all working sets (lifting only - for backward compatibility)
  static async getAllWorkingSets(
    filters: RecordsFilters = {},
    sortConfig: WorkingSetSortConfig = { field: 'date', direction: 'desc' }
  ): Promise<WorkingSet[]> {
    try {
      const { data, error } = await supabase
        .from('workout_sessions')
        .select(`
          id,
          date,
          lifting_exercises (
            id,
            exercise_name,
            body_part_id,
            lifting_sets (
              id,
              weight,
              reps,
              set_number,
              created_at
            )
          )
        `)
        .eq('workout_type', 'lifting')
        .order('date', { ascending: false })

      if (error) throw error

      // Get all body parts for mapping
      const { data: bodyPartsData } = await supabase
        .from('body_parts')
        .select('id, name, color');

      const bodyPartsMap = new Map(
        bodyPartsData?.map(bp => [bp.id, { name: bp.name, color: bp.color }]) || []
      );

      // Transform the nested data into flat working sets
      const workingSets: WorkingSet[] = []
      
      data?.forEach(session => {
        session.lifting_exercises?.forEach(exercise => {
          const bodyPart = bodyPartsMap.get(exercise.body_part_id);
          exercise.lifting_sets?.forEach(set => {
            workingSets.push({
              id: set.id,
              date: session.date,
              muscleGroup: bodyPart?.name || 'Unknown',
              muscleColor: bodyPart?.color || '#666',
              exerciseName: exercise.exercise_name,
              weight: set.weight || 0,
              reps: set.reps || 0,
              setNumber: set.set_number,
              workoutId: session.id,
              createdAt: set.created_at
            })
          })
        })
      })

      // Apply search filter
      let filteredSets = workingSets
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase()
        filteredSets = workingSets.filter(set =>
          set.exerciseName.toLowerCase().includes(searchLower) ||
          set.muscleGroup.toLowerCase().includes(searchLower)
        )
      }

      // Apply muscle group filter
      if (filters.muscleGroups && filters.muscleGroups.length > 0) {
        filteredSets = filteredSets.filter(set =>
          filters.muscleGroups!.includes(set.muscleGroup)
        )
      }

      // Apply exercise name filter
      if (filters.exerciseName) {
        filteredSets = filteredSets.filter(set =>
          set.exerciseName === filters.exerciseName
        )
      }

      // Sort the data
      return this.sortWorkingSets(filteredSets, sortConfig)
    } catch (error) {
      console.error('Error fetching working sets:', error)
      return []
    }
  }

  // Get unique muscle groups for filtering
  static async getMuscleGroups(): Promise<Array<{ name: string; color: string }>> {
    try {
      const { data, error } = await supabase
        .from('body_parts')
        .select('name, color')
        .order('name')

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching muscle groups:', error)
      return []
    }
  }

  // Get unique exercises for filtering
  static async getExercises(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('exercise_categories')
        .select('name')
        .order('name')

      if (error) throw error
      return data?.map(item => item.name) || []
    } catch (error) {
      console.error('Error fetching exercises:', error)
      return []
    }
  }

  // Get date range statistics for all workout types
  static async getDateRangeStats(): Promise<{
    earliestDate: string
    latestDate: string
    totalSets: number
    totalWorkouts: number
    totalRunningWorkouts: number
    totalMTBWorkouts: number
  }> {
    try {
      const [liftingData, runningData, mtbData] = await Promise.all([
        supabase
          .from('workout_sessions')
          .select('date, lifting_exercises(lifting_sets(id))')
          .eq('workout_type', 'lifting')
          .order('date'),
        supabase
          .from('workout_sessions')
          .select('date')
          .eq('workout_type', 'running')
          .order('date'),
        supabase
          .from('workout_sessions')
          .select('date')
          .eq('workout_type', 'mtb')
          .order('date')
      ]);

      const allDates: string[] = [];
      let totalSets = 0;
      let totalLiftingWorkouts = 0;
      let totalRunningWorkouts = 0;
      let totalMTBWorkouts = 0;

      // Process lifting data
      if (liftingData.data) {
        totalLiftingWorkouts = liftingData.data.length;
        liftingData.data.forEach(session => {
          allDates.push(session.date);
          totalSets += session.lifting_exercises?.reduce((sum, exercise) => 
            sum + (exercise.lifting_sets?.length || 0), 0) || 0;
        });
      }

      // Process running data
      if (runningData.data) {
        totalRunningWorkouts = runningData.data.length;
        runningData.data.forEach(session => allDates.push(session.date));
      }

      // Process MTB data
      if (mtbData.data) {
        totalMTBWorkouts = mtbData.data.length;
        mtbData.data.forEach(session => allDates.push(session.date));
      }

      if (allDates.length === 0) {
      return {
          earliestDate: new Date().toISOString().split('T')[0],
          latestDate: new Date().toISOString().split('T')[0],
          totalSets: 0,
          totalWorkouts: 0,
          totalRunningWorkouts: 0,
          totalMTBWorkouts: 0
        };
      }

      const sortedDates = allDates.sort();
      return {
        earliestDate: sortedDates[0],
        latestDate: sortedDates[sortedDates.length - 1],
        totalSets,
        totalWorkouts: totalLiftingWorkouts + totalRunningWorkouts + totalMTBWorkouts,
        totalRunningWorkouts,
        totalMTBWorkouts
      };
    } catch (error) {
      console.error('Error fetching date range stats:', error);
      return {
        earliestDate: new Date().toISOString().split('T')[0],
        latestDate: new Date().toISOString().split('T')[0],
        totalSets: 0,
        totalWorkouts: 0,
        totalRunningWorkouts: 0,
        totalMTBWorkouts: 0
      };
    }
  }

  // Sort working sets by specified field and direction
  private static sortWorkingSets(sets: WorkingSet[], sortConfig: WorkingSetSortConfig): WorkingSet[] {
    return [...sets].sort((a, b) => {
      let aValue = a[sortConfig.field]
      let bValue = b[sortConfig.field]

      // Handle date sorting
      if (sortConfig.field === 'date') {
        aValue = new Date(aValue as string).getTime()
        bValue = new Date(bValue as string).getTime()
      }

      // Handle numeric sorting
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue
      }

      // Handle string sorting
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue)
        return sortConfig.direction === 'asc' ? comparison : -comparison
      }

      return 0
    })
  }

  // Sort unified workouts by specified field and direction
  private static sortUnifiedWorkouts(workouts: UnifiedWorkoutRecord[], sortConfig: UnifiedWorkoutSortConfig): UnifiedWorkoutRecord[] {
    return [...workouts].sort((a, b) => {
      let aValue = a[sortConfig.field]
      let bValue = b[sortConfig.field]

      // Handle date sorting
      if (sortConfig.field === 'date') {
        aValue = new Date(aValue as string).getTime()
        bValue = new Date(bValue as string).getTime()
      }

      // Handle numeric sorting
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue
      }

      // Handle string sorting
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue)
        return sortConfig.direction === 'asc' ? comparison : -comparison
      }

      return 0
    })
  }

  // Format duration from seconds to HH:MM:SS
  private static formatDuration(totalSeconds: number): string {
    if (!totalSeconds || totalSeconds <= 0) return '-';
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  }

  // Format pace from duration (in seconds) and distance
  private static formatPace(totalSeconds: number, distance: number): string {
    if (!totalSeconds || !distance || distance <= 0) return '-';
    
    const totalMinutes = totalSeconds / 60;
    const paceMinutes = Math.floor(totalMinutes / distance);
    const paceSeconds = Math.round(((totalMinutes / distance) % 1) * 60);
    return `${paceMinutes}:${paceSeconds.toString().padStart(2, '0')}`;
  }
} 