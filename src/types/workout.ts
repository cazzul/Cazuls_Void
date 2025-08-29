export interface WorkoutSet {
  id: string
  exercise: string
  weight?: number
  reps?: number
  distance?: number
  duration?: number
  pace?: string
  notes?: string
}

export interface LiftingWorkout {
  id: string
  date: string
  type: 'push' | 'pull' | 'legs' | 'upper'
  exercises: {
    name: string
    sets: WorkoutSet[]
  }[]
  notes?: string
}

export interface RunningWorkout {
  id: string
  date: string
  type: 'interval' | 'tempo' | 'long-run' | 'easy' | 'recovery'
  distance: number
  duration: number
  pace: string
  intervals?: {
    distance: number
    pace: string
    rest: string
  }[]
  notes?: string
}

export interface MTBWorkout {
  id: string
  date: string
  type: 'endurance' | 'power-skills'
  distance: number
  duration: number
  avgSpeed: number
  maxSpeed?: number
  heartRate?: {
    avg: number
    max: number
  }
  notes?: string
}

export interface WeeklyVolume {
  date: string
  back: number
  chest: number
  biceps: number
  triceps: number
  shoulders: number
  milesRun: number
  quads: number
  hamstrings: number
  milesMTB: number
}

export type WorkoutType = LiftingWorkout | RunningWorkout | MTBWorkout 