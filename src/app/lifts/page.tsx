"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Dumbbell, ChevronDown, Search, Save, CheckCircle, Bug } from "lucide-react";
import { ExerciseService, Exercise } from "../../lib/exercise-service";
import { DatabaseService } from "../../lib/database-service";
import { DebugService } from "../../lib/debug-service";

interface LiftingWorkout {
  id: string;
  date: string;
  exercises: Array<{
    name: string;
    sets: Array<{
      weight: number;
      reps: number;
    }>;
  }>;
  isSaved?: boolean;
  databaseId?: number;
}

export default function LiftsPage() {
  const [workouts, setWorkouts] = useState<LiftingWorkout[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [currentExercise, setCurrentExercise] = useState("");
  const [currentWeight, setCurrentWeight] = useState("");
  const [currentReps, setCurrentReps] = useState("");
  
  // Exercise dropdown state
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [showExerciseDropdown, setShowExerciseDropdown] = useState(false);
  const [exerciseSearchTerm, setExerciseSearchTerm] = useState("");
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [isLoadingExercises, setIsLoadingExercises] = useState(true);
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState(-1);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Ref for dropdown to handle click outside
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load exercises from database on component mount
  useEffect(() => {
    const loadExercises = async () => {
      try {
        setIsLoadingExercises(true);
        let exerciseList = await ExerciseService.getExercises();
        
        // If no exercises exist, populate the database with defaults
        if (exerciseList.length === 0) {
          console.log('No exercises found, populating database with defaults...');
          await ExerciseService.populateDefaultExercises();
          exerciseList = await ExerciseService.getExercises();
        }
        
        setExercises(exerciseList);
        setFilteredExercises(exerciseList);
      } catch (error) {
        console.error('Error loading exercises:', error);
      } finally {
        setIsLoadingExercises(false);
      }
    };

    loadExercises();
  }, []);

  // Load existing workouts from database with full set data
  useEffect(() => {
    const loadExistingWorkouts = async () => {
      try {
        // For now, we'll just show a message that existing workouts can be loaded
        // In a future update, we can implement full loading of set data
        console.log('Existing workouts loading functionality ready');
      } catch (error) {
        console.error('Error loading existing workouts:', error);
      }
    };

    loadExistingWorkouts();
  }, []);

  // Filter exercises based on search term
  useEffect(() => {
    if (exerciseSearchTerm.trim() === '') {
      setFilteredExercises(exercises);
    } else {
      const filtered = exercises.filter(exercise =>
        exercise.name.toLowerCase().includes(exerciseSearchTerm.toLowerCase())
      );
      setFilteredExercises(filtered);
    }
    setSelectedExerciseIndex(-1); // Reset selection when filtering
  }, [exerciseSearchTerm, exercises]);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowExerciseDropdown(false);
        setExerciseSearchTerm("");
        setSelectedExerciseIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!showExerciseDropdown) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedExerciseIndex(prev => 
          prev < filteredExercises.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedExerciseIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedExerciseIndex >= 0 && filteredExercises[selectedExerciseIndex]) {
          selectExercise(filteredExercises[selectedExerciseIndex].name);
        }
        break;
      case 'Escape':
        setShowExerciseDropdown(false);
        setExerciseSearchTerm("");
        setSelectedExerciseIndex(-1);
        break;
    }
  };

  const addWorkout = () => {
    const newWorkout: LiftingWorkout = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      exercises: [],
    };
    setWorkouts([...workouts, newWorkout]);
    setShowForm(true);
  };

  const testDatabaseConnection = async () => {
    try {
      const exercises = await ExerciseService.getExercises();
      setSaveMessage({ type: 'success', text: `Database connection working! Found ${exercises.length} exercises.` });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage({ type: 'error', text: `Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
      setTimeout(() => setSaveMessage(null), 5000);
    }
  };

  const runDebugChecks = async () => {
    try {
      setSaveMessage({ type: 'success', text: 'Running debug checks... Check console for details.' });
      await DebugService.runAllChecks();
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage({ type: 'error', text: `Debug failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
      setTimeout(() => setSaveMessage(null), 5000);
    }
  };

  const addExercise = (workoutId: string) => {
    if (!currentExercise || !currentWeight || !currentReps) return;

    const updatedWorkouts = workouts.map((workout) => {
      if (workout.id === workoutId) {
        return {
          ...workout,
          exercises: [
            ...workout.exercises,
            {
              name: currentExercise,
              sets: [
                {
                  weight: parseFloat(currentWeight),
                  reps: parseInt(currentReps),
                },
              ],
            },
          ],
        };
      }
      return workout;
    });

    setWorkouts(updatedWorkouts);
    setCurrentExercise("");
    setCurrentWeight("");
    setCurrentReps("");
    setShowExerciseDropdown(false);
  };

  const addSet = (workoutId: string, exerciseIndex: number) => {
    if (!currentWeight || !currentReps) return;

    const updatedWorkouts = workouts.map((workout) => {
      if (workout.id === workoutId) {
        const updatedExercises = [...workout.exercises];
        updatedExercises[exerciseIndex].sets.push({
          weight: parseFloat(currentWeight),
          reps: parseInt(currentReps),
        });
        return { ...workout, exercises: updatedExercises };
      }
      return workout;
    });

    setWorkouts(updatedWorkouts);
    // Don't clear the form inputs when adding sets - keep them for convenience
  };

  const deleteWorkout = (workoutId: string) => {
    setWorkouts(workouts.filter((workout) => workout.id !== workoutId));
  };

  const saveWorkout = async (workoutId: string) => {
    const workout = workouts.find(w => w.id === workoutId);
    if (!workout || workout.exercises.length === 0) return;

    try {
      // Format exercises for database
      const exercisesForDB = workout.exercises.map(exercise => ({
        name: exercise.name,
        sets: exercise.sets,
        bodyPart: exercise.name // We'll get the body part from the exercise service
      }));

      console.log('Saving workout to database:', { workout, exercisesForDB });

      // Save to database
      const savedWorkout = await DatabaseService.saveLiftingWorkout(workout.date, exercisesForDB);
      
      // Update local state to mark as saved
      setWorkouts(workouts.map(w => 
        w.id === workoutId 
          ? { ...w, isSaved: true, databaseId: savedWorkout.id }
          : w
      ));

      // Show success message
      setSaveMessage({ type: 'success', text: 'Workout saved successfully!' });
      setTimeout(() => setSaveMessage(null), 3000);

      console.log('Workout saved successfully:', savedWorkout);
    } catch (error) {
      console.error('Error saving workout:', error);
      
      // Show error message
      setSaveMessage({ type: 'error', text: `Failed to save workout: ${error instanceof Error ? error.message : 'Unknown error'}` });
      setTimeout(() => setSaveMessage(null), 5000);
    }
  };

  const selectExercise = (exerciseName: string) => {
    setCurrentExercise(exerciseName);
    setShowExerciseDropdown(false);
    setExerciseSearchTerm("");
  };

  const toggleExerciseDropdown = () => {
    setShowExerciseDropdown(!showExerciseDropdown);
    if (!showExerciseDropdown) {
      setExerciseSearchTerm("");
      setFilteredExercises(exercises);
    }
  };

  return (
    <>
      {/* Header */}
      <header className="flex justify-between items-center p-6 border-b" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card)' }}>
        <h2 className="text-xl font-semibold" style={{ color: 'var(--color-accent)' }}>LIFTS</h2>
        <div className="flex gap-2">
          <button
            onClick={testDatabaseConnection}
            className="px-3 py-1 rounded-lg text-sm hover:scale-105 transition-all duration-200"
            style={{ backgroundColor: 'var(--color-muted)', color: 'var(--color-foreground)' }}
          >
            Test DB Connection
          </button>
          <button
            onClick={runDebugChecks}
            className="px-3 py-1 rounded-lg text-sm hover:scale-105 transition-all duration-200"
            style={{ backgroundColor: 'var(--color-lifting)', color: 'var(--color-button-text)' }}
          >
            <Bug className="inline h-4 w-4 mr-1" />
            Debug
          </button>
        </div>
      </header>

      {/* Save Message */}
      {saveMessage && (
        <div className={`px-6 py-3 text-center ${
          saveMessage.type === 'success' 
            ? 'bg-green-600 text-white' 
            : 'bg-red-600 text-white'
        }`}>
          {saveMessage.text}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-accent)' }}>
            Lifting Workouts
          </h1>
          <button
            onClick={addWorkout}
            className="flex items-center px-4 py-2 rounded-lg hover:scale-105 transition-all duration-200"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-button-text)' }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Workout
          </button>
        </div>

        {workouts.length === 0 ? (
          <div className="text-center py-12">
            <Dumbbell className="mx-auto h-12 w-12 mb-4" style={{ color: 'var(--color-secondary)' }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--color-foreground)' }}>
              No workouts yet
            </h3>
            <p style={{ color: 'var(--color-secondary)' }}>
              Start tracking your lifting progress by adding your first workout.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {workouts.map((workout) => (
              <div
                key={workout.id}
                className="rounded-lg p-6 border"
                style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-muted)' }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--color-foreground)' }}>
                    {workout.date}
                  </h3>
                  <div className="flex items-center gap-2">
                    {!workout.isSaved && workout.exercises.length > 0 && (
                      <button
                        onClick={() => saveWorkout(workout.id)}
                        className="flex items-center px-3 py-1 rounded-lg hover:scale-105 transition-all duration-200 text-sm"
                        style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-button-text)' }}
                      >
                        <Save className="mr-1 h-3 w-3" />
                        Save
                      </button>
                    )}
                    {workout.isSaved && (
                      <div className="flex items-center px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: 'var(--color-muted)', color: 'var(--color-secondary)' }}>
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Saved
                      </div>
                    )}
                    <button
                      onClick={() => deleteWorkout(workout.id)}
                      className="p-2 rounded-lg hover:scale-105 transition-all duration-200"
                      style={{ backgroundColor: 'var(--color-muted)' }}
                    >
                      <Trash2 className="h-4 w-4" style={{ color: 'var(--color-foreground)' }} />
                    </button>
                  </div>
                </div>

                {workout.exercises.length === 0 ? (
                  <div className="text-center py-4">
                    <p style={{ color: 'var(--color-secondary)' }}>No exercises added yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {workout.exercises.map((exercise, exerciseIndex) => (
                      <div key={exerciseIndex} className="space-y-2">
                        <h4 className="font-medium" style={{ color: 'var(--color-foreground)' }}>
                          {exercise.name}
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {exercise.sets.map((set, setIndex) => (
                            <div key={setIndex} className="flex justify-between">
                              <span style={{ color: 'var(--color-secondary)' }}>Set {setIndex + 1}:</span>
                              <span style={{ color: 'var(--color-foreground)' }}>
                                {set.weight} lbs × {set.reps} reps
                              </span>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => addSet(workout.id, exerciseIndex)}
                          className="text-sm px-3 py-1 rounded-lg hover:scale-105 transition-all duration-200"
                          style={{ backgroundColor: 'var(--color-muted)', color: 'var(--color-foreground)' }}
                        >
                          Add Set
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--color-muted)' }}>
                  <div className="grid grid-cols-3 gap-4">
                    {/* Exercise Name Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                      <button
                        type="button"
                        onClick={toggleExerciseDropdown}
                        className="w-full px-3 py-2 rounded-lg text-sm text-left flex items-center justify-between"
                        style={{ backgroundColor: 'var(--color-muted)', color: 'var(--color-foreground)', border: '1px solid oklch(0.269 0 0)' }}
                      >
                        <span className={currentExercise ? 'text-oklch(0.985 0 0)' : 'text-oklch(0.708 0 0)'}>
                          {currentExercise || 'Exercise name'}
                        </span>
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showExerciseDropdown ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {showExerciseDropdown && (
                        <div className="absolute z-10 w-full mt-1 rounded-lg border shadow-lg max-h-60 overflow-hidden"
                             style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-muted)' }}>
                          {/* Search Input */}
                          <div className="p-2 border-b" style={{ borderColor: 'var(--color-muted)' }}>
                            <div className="relative">
                              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: 'var(--color-secondary)' }} />
                              <input
                                type="text"
                                placeholder="Search exercises..."
                                value={exerciseSearchTerm}
                                onChange={(e) => setExerciseSearchTerm(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-full pl-8 pr-3 py-2 text-sm rounded-lg"
                                style={{ backgroundColor: 'var(--color-muted)', color: 'var(--color-foreground)', border: '1px solid oklch(0.269 0 0)' }}
                                autoFocus
                              />
                            </div>
                            <div className="mt-1 text-xs text-center" style={{ color: 'var(--color-secondary)' }}>
                              {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''} available
                            </div>
                          </div>
                          
                          {/* Exercise List */}
                          <div className="max-h-48 overflow-y-auto">
                            {isLoadingExercises ? (
                              <div className="p-3 text-center text-sm" style={{ color: 'var(--color-secondary)' }}>
                                Loading exercises...
                              </div>
                            ) : filteredExercises.length === 0 ? (
                              <div className="p-3 text-center text-sm" style={{ color: 'var(--color-secondary)' }}>
                                {exerciseSearchTerm ? 'No exercises found' : 'No exercises found'}
                              </div>
                            ) : (
                              filteredExercises.map((exercise, index) => (
                                <button
                                  key={exercise.id}
                                  onClick={() => selectExercise(exercise.name)}
                                  className="w-full px-3 py-2 text-left text-sm hover:scale-105 transition-all duration-200 hover:bg-opacity-80"
                                  style={{ 
                                    backgroundColor: index === selectedExerciseIndex ? 'oklch(0.488 0.243 264.376)' : 'var(--color-muted)', 
                                    color: index === selectedExerciseIndex ? 'oklch(0.205 0 0)' : 'var(--color-foreground)',
                                    borderBottom: '1px solid oklch(0.269 0 0)',
                                    fontWeight: index === selectedExerciseIndex ? '600' : '400'
                                  }}
                                  onKeyDown={handleKeyDown}
                                  onMouseEnter={() => setSelectedExerciseIndex(index)}
                                  onMouseLeave={() => setSelectedExerciseIndex(-1)}
                                >
                                  {exercise.name}
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <input
                      type="number"
                      placeholder="Weight (lbs)"
                      value={currentWeight}
                      onChange={(e) => setCurrentWeight(e.target.value)}
                      className="px-3 py-2 rounded-lg text-sm"
                      style={{ backgroundColor: 'var(--color-muted)', color: 'var(--color-foreground)', border: '1px solid oklch(0.269 0 0)' }}
                    />
                    <input
                      type="number"
                      placeholder="Reps"
                      value={currentReps}
                      onChange={(e) => setCurrentReps(e.target.value)}
                      className="px-3 py-2 rounded-lg text-sm"
                      style={{ backgroundColor: 'var(--color-muted)', color: 'var(--color-foreground)', border: '1px solid oklch(0.269 0 0)' }}
                    />
                  </div>
                  <button
                    onClick={() => addExercise(workout.id)}
                    className="mt-2 px-4 py-2 rounded-lg hover:scale-105 transition-all duration-200"
                    style={{ backgroundColor: 'oklch(0.627 0.265 303.9)', color: 'var(--color-foreground)' }}
                  >
                    Add Exercise
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
} 