export interface WorkoutDetail {
  type: string
  color: string
  exercises: string[]
  warmup: string[]
  mobility: string[]
  stretches: string[]
  notes?: string
}

export interface DailyWorkout {
  date: Date
  dayName: string
  workouts: WorkoutDetail[]
}

// Running progression system
export interface RunningPhase {
  name: string
  startDate: Date
  endDate: Date
  description: string
  longRunProgression: number[]
  tempoProgression: string[]
  intervalProgression: string[]
}

export const runningPhases: RunningPhase[] = [
  {
    name: "Build Base",
    startDate: new Date('2025-08-25'),
    endDate: new Date('2025-09-21'),
    description: "Weeks 1–4 (Aug 25 – Sept 21) → Build Base",
    longRunProgression: [2, 3, 4, 5],
    tempoProgression: ["15–25 min @ 9:45–10:15 pace", "15–25 min @ 9:45–10:15 pace", "15–25 min @ 9:45–10:15 pace", "15–25 min @ 9:45–10:15 pace"],
    intervalProgression: ["6–8 × 1 min hard / 1 min jog", "6–8 × 1 min hard / 1 min jog", "6–8 × 1 min hard / 1 min jog", "6–8 × 1 min hard / 1 min jog"]
  },
  {
    name: "Extend Endurance",
    startDate: new Date('2025-09-22'),
    endDate: new Date('2025-10-19'),
    description: "Weeks 5–8 (Sept 22 – Oct 19) → Extend Endurance",
    longRunProgression: [6, 7, 8, 9],
    tempoProgression: ["25–30 min @ 9:50 pace", "25–30 min @ 9:50 pace", "25–30 min @ 9:50 pace", "25–30 min @ 9:50 pace"],
    intervalProgression: ["400m repeats (e.g., 6 × 400m @ 9:00 pace w/ 2 min jog)", "400m repeats (e.g., 6 × 400m @ 9:00 pace w/ 2 min jog)", "400m repeats (e.g., 6 × 400m @ 9:00 pace w/ 2 min jog)", "400m repeats (e.g., 6 × 400m @ 9:00 pace w/ 2 min jog)"]
  },
  {
    name: "Big Build",
    startDate: new Date('2025-10-20'),
    endDate: new Date('2025-11-16'),
    description: "Weeks 9–12 (Oct 20 – Nov 16) → Big Build",
    longRunProgression: [10, 12, 14, 16],
    tempoProgression: ["30–35 min @ ~10:00 pace", "30–35 min @ ~10:00 pace", "30–35 min @ ~10:00 pace", "30–35 min @ ~10:00 pace"],
    intervalProgression: ["800m repeats (4–6 × 800m @ 9:00 pace)", "800m repeats (4–6 × 800m @ 9:00 pace)", "800m repeats (4–6 × 800m @ 9:00 pace)", "800m repeats (4–6 × 800m @ 9:00 pace)"]
  },
  {
    name: "Peak & Celebration",
    startDate: new Date('2025-11-17'),
    endDate: new Date('2025-12-04'),
    description: "Weeks 13–14 (Nov 17 – Dec 4) → Peak & Celebration",
    longRunProgression: [18, 22],
    tempoProgression: ["30–35 min @ ~10:00 pace", "Taper for birthday run"],
    intervalProgression: ["800m repeats (4–6 × 800m @ 9:00 pace)", "Light intervals"]
  },
  {
    name: "Recovery & Reset",
    startDate: new Date('2025-12-05'),
    endDate: new Date('2025-12-18'),
    description: "Phase 1: Recovery & Reset (2 weeks after Dec 4)",
    longRunProgression: [0, 0], // Recovery weeks
    tempoProgression: ["3 short runs (20–30 min easy jog). No pace target, just movement", "4 runs (25–40 min easy, 1 optional strides session: 6×15s fast strides w/ 90s walk)"],
    intervalProgression: ["No intervals", "6×15s fast strides w/ 90s walk (optional)"]
  },
  {
    name: "Base Building",
    startDate: new Date('2026-01-01'),
    endDate: new Date('2026-02-28'),
    description: "Phase 2: Base Building (Jan–Feb, ~8 weeks)",
    longRunProgression: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
    tempoProgression: ["20–25 min continuous @ comfortably hard", "20–25 min continuous @ comfortably hard", "20–25 min continuous @ comfortably hard", "20–25 min continuous @ comfortably hard", "20–25 min continuous @ comfortably hard", "20–25 min continuous @ comfortably hard", "20–25 min continuous @ comfortably hard", "20–25 min continuous @ comfortably hard"],
    intervalProgression: ["8×400m @ 5k effort w/ 90s jog", "8×400m @ 5k effort w/ 90s jog", "8×400m @ 5k effort w/ 90s jog", "8×400m @ 5k effort w/ 90s jog", "8×400m @ 5k effort w/ 90s jog", "8×400m @ 5k effort w/ 90s jog", "8×400m @ 5k effort w/ 90s jog", "8×400m @ 5k effort w/ 90s jog"]
  },
  {
    name: "Strength + Speed",
    startDate: new Date('2026-03-01'),
    endDate: new Date('2026-04-30'),
    description: "Phase 3: Strength + Speed (Mar–Apr, ~8 weeks)",
    longRunProgression: [10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14],
    tempoProgression: ["30–35 min, progress to 2×20 min intervals", "30–35 min, progress to 2×20 min intervals", "30–35 min, progress to 2×20 min intervals", "30–35 min, progress to 2×20 min intervals", "30–35 min, progress to 2×20 min intervals", "30–35 min, progress to 2×20 min intervals", "30–35 min, progress to 2×20 min intervals", "30–35 min, progress to 2×20 min intervals"],
    intervalProgression: ["8×200m hill sprints, jog down recoveries", "8×200m hill sprints, jog down recoveries", "8×200m hill sprints, jog down recoveries", "8×200m hill sprints, jog down recoveries", "8×200m hill sprints, jog down recoveries", "8×200m hill sprints, jog down recoveries", "8×200m hill sprints, jog down recoveries", "8×200m hill sprints, jog down recoveries"]
  }
]

export function getCurrentRunningPhase(date: Date = new Date()): RunningPhase | null {
  // First check if we're in one of the defined phases
  const definedPhase = runningPhases.find(phase => 
    date >= phase.startDate && date <= phase.endDate
  )
  
  if (definedPhase) {
    return definedPhase
  }
  
  // If we're past all defined phases, calculate the continuous progression
  // This handles Phase 4: Continuous Progression (Indefinite Cycle)
  const lastPhaseEnd = new Date('2026-04-30')
  if (date > lastPhaseEnd) {
    const weeksSinceLastPhase = Math.floor((date.getTime() - lastPhaseEnd.getTime()) / (7 * 24 * 60 * 60 * 1000))
    const cycleLength = 24 // 8 weeks base + 8 weeks strength + 8 weeks race specific
    const currentCycle = Math.floor(weeksSinceLastPhase / cycleLength)
    const weekInCycle = weeksSinceLastPhase % cycleLength
    
    // Determine which phase of the cycle we're in
    if (weekInCycle < 8) {
      // Base Building phase
      return {
        name: `Base Building (Cycle ${currentCycle + 1})`,
        startDate: new Date(lastPhaseEnd.getTime() + (currentCycle * cycleLength * 7 * 24 * 60 * 60 * 1000)),
        endDate: new Date(lastPhaseEnd.getTime() + ((currentCycle * cycleLength + 8) * 7 * 24 * 60 * 60 * 1000)),
        description: `Base (8–12 weeks) → build mileage & aerobic capacity. Cycle ${currentCycle + 1}`,
        longRunProgression: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
        tempoProgression: ["20–25 min continuous @ comfortably hard", "20–25 min continuous @ comfortably hard", "20–25 min continuous @ comfortably hard", "20–25 min continuous @ comfortably hard", "20–25 min continuous @ comfortably hard", "20–25 min continuous @ comfortably hard", "20–25 min continuous @ comfortably hard", "20–25 min continuous @ comfortably hard"],
        intervalProgression: ["8×400m @ 5k effort w/ 90s jog", "8×400m @ 5k effort w/ 90s jog", "8×400m @ 5k effort w/ 90s jog", "8×400m @ 5k effort w/ 90s jog", "8×400m @ 5k effort w/ 90s jog", "8×400m @ 5k effort w/ 90s jog", "8×400m @ 5k effort w/ 90s jog", "8×400m @ 5k effort w/ 90s jog"]
      }
    } else if (weekInCycle < 16) {
      // Strength + Speed phase
      return {
        name: `Strength + Speed (Cycle ${currentCycle + 1})`,
        startDate: new Date(lastPhaseEnd.getTime() + ((currentCycle * cycleLength + 8) * 7 * 24 * 60 * 60 * 1000)),
        endDate: new Date(lastPhaseEnd.getTime() + ((currentCycle * cycleLength + 16) * 7 * 24 * 60 * 60 * 1000)),
        description: `Strength/Speed (8–12 weeks) → hills, intervals, tempos. Cycle ${currentCycle + 1}`,
        longRunProgression: [10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14],
        tempoProgression: ["30–35 min, progress to 2×20 min intervals", "30–35 min, progress to 2×20 min intervals", "30–35 min, progress to 2×20 min intervals", "30–35 min, progress to 2×20 min intervals", "30–35 min, progress to 2×20 min intervals", "30–35 min, progress to 2×20 min intervals", "30–35 min, progress to 2×20 min intervals", "30–35 min, progress to 2×20 min intervals"],
        intervalProgression: ["8×200m hill sprints, jog down recoveries", "8×200m hill sprints, jog down recoveries", "8×200m hill sprints, jog down recoveries", "8×200m hill sprints, jog down recoveries", "8×200m hill sprints, jog down recoveries", "8×200m hill sprints, jog down recoveries", "8×200m hill sprints, jog down recoveries", "8×200m hill sprints, jog down recoveries"]
      }
    } else {
      // Race Specific phase
      return {
        name: `Race Specific (Cycle ${currentCycle + 1})`,
        startDate: new Date(lastPhaseEnd.getTime() + ((currentCycle * cycleLength + 16) * 7 * 24 * 60 * 60 * 1000)),
        endDate: new Date(lastPhaseEnd.getTime() + ((currentCycle * cycleLength + 24) * 7 * 24 * 60 * 60 * 1000)),
        description: `Race Specific (8–12 weeks) → choose a goal (5k, 10k, half-marathon, or even another marathon) and tailor workouts. Cycle ${currentCycle + 1}`,
        longRunProgression: [10, 11, 12, 13, 14, 15, 16, 17, 18],
        tempoProgression: ["30–35 min @ ~10:00 pace", "30–35 min @ ~10:00 pace", "30–35 min @ ~10:00 pace", "30–35 min @ ~10:00 pace", "30–35 min @ ~10:00 pace", "30–35 min @ ~10:00 pace", "30–35 min @ ~10:00 pace", "30–35 min @ ~10:00 pace"],
        intervalProgression: ["800m repeats (4–6 × 800m @ 9:00 pace)", "800m repeats (4–6 × 800m @ 9:00 pace)", "800m repeats (4–6 × 800m @ 9:00 pace)", "800m repeats (4–6 × 800m @ 9:00 pace)", "800m repeats (4–6 × 800m @ 9:00 pace)", "800m repeats (4–6 × 800m @ 9:00 pace)", "800m repeats (4–6 × 800m @ 9:00 pace)", "800m repeats (4–6 × 800m @ 9:00 pace)"]
      }
    }
  }
  
  return null
}

export function getCurrentWeekInPhase(date: Date = new Date()): { phase: RunningPhase, weekIndex: number, isDeloadWeek: boolean } | null {
  const phase = getCurrentRunningPhase(date)
  if (!phase) return null

  const weeksSinceStart = Math.floor((date.getTime() - phase.startDate.getTime()) / (7 * 24 * 60 * 60 * 1000))
  const weekIndex = Math.min(weeksSinceStart, phase.longRunProgression.length - 1)
  
  // Deload weeks start after Dec 18, 2025 (after Recovery & Reset phase)
  const deloadStartDate = new Date('2025-12-18')
  const isDeloadWeek = date > deloadStartDate && (weekIndex + 1) % 4 === 0

  return { phase, weekIndex, isDeloadWeek }
}

export function getCurrentWeekTargets(date: Date = new Date()) {
  const weekInfo = getCurrentWeekInPhase(date)
  if (!weekInfo) {
    console.log('No running phase found for date:', date)
    return null
  }

  const { phase, weekIndex, isDeloadWeek } = weekInfo
  let longRunTarget = phase.longRunProgression[weekIndex] || 0
  let tempoTarget = phase.tempoProgression[weekIndex] || ""
  let intervalTarget = phase.intervalProgression[weekIndex] || ""

  // Apply deload if it's a deload week
  if (isDeloadWeek && longRunTarget > 0) {
    longRunTarget = Math.round(longRunTarget * 0.7 * 10) / 10 // 30% reduction, rounded to 0.1
  }

  console.log('Running targets for date:', date, {
    phase: phase.name,
    weekIndex,
    longRunTarget,
    tempoTarget,
    intervalTarget,
    isDeloadWeek
  })

  return {
    longRun: longRunTarget,
    tempo: tempoTarget,
    interval: intervalTarget,
    isDeloadWeek,
    phaseName: phase.name,
    weekNumber: weekIndex + 1
  }
}

export const workoutRoutines = {
  monday: {
    type: "Monday - Push + Tempo Run",
    color: "bg-blue-600",
    workouts: [
      {
        type: "Push Day",
        color: "bg-blue-600",
        exercises: [
          "Bench Press – 4×6–8",
          "Overhead Press – 3×8",
          "Incline Dumbbell Press – 3×8–10",
          "Lateral Raises – 3×12–15",
          "Dips – 3×AMRAP",
          "Overhead Triceps Extension – 3×12"
        ],
        warmup: [
          "Arm circles (forward/backward) – 1 min",
          "Band pull-aparts – 2×15",
          "Push-ups – 2×10",
          "Light DB overhead press – 2×12",
          "Dynamic chest stretch – 30s/side"
        ],
        mobility: [
          "Wall Slides – 2×10",
          "Serratus Punches – 2×12",
          "Pec Doorway Stretch – 2×30 sec per side"
        ],
        stretches: [
          "Doorway chest stretch – 30s/side",
          "Overhead triceps stretch – 30s/side",
          "Shoulder cross-body stretch – 30s/side",
          "Child's pose – 1 min"
        ]
      },
      {
        type: "Tempo Run",
        color: "bg-orange-600",
        exercises: [
          "Current Target: {tempoTarget}"
        ],
        warmup: [
          "5 min brisk walk/jog",
          "High knees – 2×20 sec",
          "A-skips – 2×20m",
          "Butt kicks – 2×20 sec",
          "Leg swings (front/back + side/side) – 10 each per side"
        ],
        mobility: [
          "90/90 Hip Stretch – 2×30 sec per side",
          "Couch Stretch – 2×30 sec per side",
          "Banded Clamshells – 2×12 per side",
          "Monster Walks – 2×12 steps each direction",
          "Hip Airplanes – 2×5 per side",
          "Single-Leg Glute Bridge Hold – 2×20 sec per side"
        ],
        stretches: [
          "Standing quad stretch – 30s/side",
          "Seated hamstring stretch – 30s/side",
          "Calf stretch (wall) – 30s/side",
          "Pigeon stretch – 30s/side",
          "Child's pose – 1 min"
        ]
      }
    ]
  },
  tuesday: {
    type: "Tuesday - Pull",
    color: "bg-green-600",
    workouts: [
      {
        type: "Pull Day",
        color: "bg-green-600",
        exercises: [
          "Pull-Ups – 4×AMRAP (weighted if strong enough)",
          "Barbell Row – 4×8",
          "Lat Pulldown – 3×10–12",
          "Dumbbell Row – 3×10/side",
          "Face Pulls – 3×15",
          "Barbell Curl – 3×10",
          "Hammer Curl – 3×12"
        ],
        warmup: [
          "Jump rope or rower – 2 min",
          "Band rows – 2×15",
          "Scapular pull-ups – 2×8",
          "Face pulls (light band) – 2×12",
          "Dynamic lat stretch – 30s/side"
        ],
        mobility: [
          "Foam Roll Lats – 1 min per side",
          "Banded Lat Stretch – 2×30 sec per side",
          "Prone Y-T-W Holds – 1×5 each (5 sec hold)"
        ],
        stretches: [
          "Overhead banded lat stretch – 30s/side",
          "Seated hamstring stretch – 30s/side",
          "Forearm flexor stretch – 30s/side",
          "Cat-Cow flow – 1 min"
        ]
      }
    ]
  },
  wednesday: {
    type: "Wednesday - Interval Run",
    color: "bg-red-600",
    workouts: [
      {
        type: "Interval Run",
        color: "bg-red-600",
        exercises: [
          "Current Target: {intervalTarget}"
        ],
        warmup: [
          "5 min brisk walk/jog",
          "High knees – 2×20 sec",
          "A-skips – 2×20m",
          "Butt kicks – 2×20 sec",
          "Leg swings (front/back + side/side) – 10 each per side"
        ],
        mobility: [
          "90/90 Hip Stretch – 2×30 sec per side",
          "Couch Stretch – 2×30 sec per side",
          "Banded Clamshells – 2×12 per side",
          "Monster Walks – 2×12 steps each direction",
          "Hip Airplanes – 2×5 per side",
          "Single-Leg Glute Bridge Hold – 2×20 sec per side"
        ],
        stretches: [
          "Standing quad stretch – 30s/side",
          "Seated hamstring stretch – 30s/side",
          "Calf stretch (wall) – 30s/side",
          "Pigeon stretch – 30s/side",
          "Child's pose – 1 min"
        ]
      }
    ]
  },
  thursday: {
    type: "Thursday - Legs",
    color: "bg-purple-600",
    workouts: [
      {
        type: "Leg Day",
        color: "bg-purple-600",
        exercises: [
          "Back Squat – 4×6–8",
          "Romanian Deadlift – 3×8–10",
          "Bulgarian Split Squat – 3×10/side",
          "Hip Thrust – 3×12",
          "Leg Curl Machine – 3×12",
          "Calf Raises – 4×15"
        ],
        warmup: [
          "5 min light bike or jog",
          "Bodyweight squats – 2×15",
          "Walking lunges – 2×10/side",
          "Leg swings (front/back + side/side) – 10 each",
          "Glute bridges – 2×12"
        ],
        mobility: [
          "90/90 Hip Stretch – 2×30 sec per side",
          "Couch Stretch – 2×30 sec per side",
          "Banded Clamshells – 2×12 per side",
          "Monster Walks – 2×12 steps per direction",
          "Hip Airplanes – 2×5 per side",
          "Single-Leg Glute Bridge Hold – 2×20 sec per side"
        ],
        stretches: [
          "Standing quad stretch – 30s/side",
          "Seated hamstring stretch – 30s/side",
          "Pigeon stretch – 30s/side",
          "Frog stretch – 1 min"
        ]
      }
    ]
  },
  friday: {
    type: "Friday - Rest",
    color: "bg-gray-600",
    workouts: [
      {
        type: "Rest Day",
        color: "bg-gray-600",
        exercises: ["Active Recovery", "Mobility Work", "Light Stretching"],
        warmup: [],
        mobility: [
          "Light hip mobility routine",
          "Gentle stretching",
          "Foam rolling"
        ],
        stretches: [
          "Light static stretching",
          "Deep breathing exercises",
          "Recovery focus"
        ]
      }
    ]
  },
  saturday: {
    type: "Saturday - Upper + Long Run",
    color: "bg-orange-600",
    workouts: [
      {
        type: "Upper Day",
        color: "bg-orange-600",
        exercises: [
          "Incline Barbell Press – 4×6–8",
          "Weighted Pull-Ups – 4×6–8",
          "Seated Dumbbell Shoulder Press – 3×10",
          "Dumbbell Row – 3×10",
          "Lateral Raises – 3×15",
          "Barbell Curl superset Skull Crushers – 3×12 each"
        ],
        warmup: [
          "Jump rope – 2 min",
          "Band pull-aparts – 2×15",
          "Push-ups – 2×10",
          "Scapular wall slides – 2×12",
          "Dynamic chest/shoulder opener – 30s/side"
        ],
        mobility: [
          "Scapular Push-Ups – 2×12",
          "Band Pull-Aparts – 2×15",
          "Child's Pose w/ Side Reach – 2×30 sec"
        ],
        stretches: [
          "Doorway chest stretch – 30s/side",
          "Overhead triceps stretch – 30s/side",
          "Lat stretch – 30s/side",
          "Thread-the-needle stretch – 1 min"
        ]
      },
      {
        type: "Long Run",
        color: "bg-blue-600",
        exercises: [
          "Current Target: {longRunTarget} miles"
        ],
        warmup: [
          "5 min brisk walk/jog",
          "High knees – 2×20 sec",
          "A-skips – 2×20m",
          "Butt kicks – 2×20 sec",
          "Leg swings (front/back + side/side) – 10 each per side"
        ],
        mobility: [
          "90/90 Hip Stretch – 2×30 sec per side",
          "Couch Stretch – 2×30 sec per side",
          "Banded Clamshells – 2×12 per side",
          "Monster Walks – 2×12 steps each direction",
          "Hip Airplanes – 2×5 per side",
          "Single-Leg Glute Bridge Hold – 2×20 sec per side"
        ],
        stretches: [
          "Standing quad stretch – 30s/side",
          "Seated hamstring stretch – 30s/side",
          "Calf stretch (wall) – 30s/side",
          "Pigeon stretch – 30s/side",
          "Child's pose – 1 min"
        ]
      }
    ]
  },
  sunday: {
    type: "Sunday - Rest + Optional MTB",
    color: "bg-gray-600",
    workouts: [
      {
        type: "Rest Day",
        color: "bg-gray-600",
        exercises: ["Active Recovery", "Light Activity", "Recovery Focus"],
        warmup: [],
        mobility: [
          "Light hip mobility routine",
          "Gentle stretching",
          "Recovery work"
        ],
        stretches: [
          "Light static stretching",
          "Deep breathing exercises",
          "Recovery focus"
        ]
      },
      {
        type: "Optional MTB Endurance",
        color: "bg-green-600",
        exercises: [
          "1.5–2 hours at comfortable pace (~9–11 mph avg)",
          "Keep heart rate conversational",
          "Focus on smooth cadence (~80–90 rpm)",
          "Goal: aerobic base + fat adaptation"
        ],
        warmup: ["10 min easy spin"],
        mobility: ["Light hip mobility if needed"],
        stretches: ["Light post-ride stretching"]
      }
    ]
  }
}

export function getWorkoutForDate(date: Date): DailyWorkout {
  const day = date.getDay()
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const dayName = dayNames[day] as keyof typeof workoutRoutines
  
  // Get current running targets for this date
  const runningTargets = getCurrentWeekTargets(date)
  
  // Clone the workout routines and update with current targets
  const updatedWorkouts = workoutRoutines[dayName].workouts.map(workout => {
    if (workout.type === "Tempo Run") {
      const tempoTarget = runningTargets?.tempo || "20–25 min @ comfortable pace"
      return {
        ...workout,
        exercises: workout.exercises.map(exercise => 
          exercise.includes("{tempoTarget}") 
            ? exercise.replace("{tempoTarget}", tempoTarget)
            : exercise
        )
      }
    }
    if (workout.type === "Interval Run") {
      const intervalTarget = runningTargets?.interval || "6–8 × 400m @ 5k effort w/ 90s jog"
      return {
        ...workout,
        exercises: workout.exercises.map(exercise => 
          exercise.includes("{intervalTarget}") 
            ? exercise.replace("{intervalTarget}", intervalTarget)
            : exercise
        )
      }
    }
    if (workout.type === "Long Run") {
      const longRunTarget = runningTargets?.longRun || 6
      return {
        ...workout,
        exercises: workout.exercises.map(exercise => 
          exercise.includes("{longRunTarget}") 
            ? exercise.replace("{longRunTarget}", longRunTarget.toString())
            : exercise
        )
      }
    }
    return workout
  })
  
  return {
    date,
    dayName: workoutRoutines[dayName].type,
    workouts: updatedWorkouts
  }
} 