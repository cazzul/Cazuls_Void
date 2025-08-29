"use client";

import { useState, useEffect } from "react";
import { DatabaseService } from "../../lib/database-service";
import { supabase } from "../../lib/supabase";

interface RunningWorkout {
  id: string;
  distance: number;
  duration: number;
  runType: string;
  notes: string;
  date: string;
}

export default function RunningPage() {
  const [workouts, setWorkouts] = useState<RunningWorkout[]>([]);
  const [newWorkout, setNewWorkout] = useState({
    distance: "",
    hours: "",
    minutes: "",
    seconds: "",
    runType: "easy",
    notes: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');
  const [dbConnectionStatus, setDbConnectionStatus] = useState<'unknown' | 'connected' | 'error'>('unknown');

  // Load existing workouts from database
  useEffect(() => {
    loadWorkouts();
    testDatabaseConnection();
  }, []);

  const loadWorkouts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('workout_sessions')
        .select(`
          id,
          date,
          running_workouts (
            id,
            distance,
            duration,
            run_type,
            notes
          )
        `)
        .eq('workout_type', 'running')
        .order('date', { ascending: false });

      if (error) throw error;

      const runningWorkouts: RunningWorkout[] = [];
      data?.forEach(session => {
        session.running_workouts?.forEach(workout => {
          runningWorkouts.push({
            id: workout.id,
            distance: workout.distance,
            duration: workout.duration,
            runType: workout.run_type,
            notes: workout.notes || '',
            date: session.date
          });
        });
      });

      setWorkouts(runningWorkouts);
    } catch (error) {
      console.error('Error loading running workouts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testDatabaseConnection = async () => {
    try {
      const { data, error } = await supabase.from('workout_sessions').select('id').limit(1);
      if (error) throw error;
      setDbConnectionStatus('connected');
    } catch (error) {
      console.error('Database connection test failed:', error);
      setDbConnectionStatus('error');
    }
  };

  const addWorkout = async () => {
    if (!newWorkout.distance || (!newWorkout.hours && !newWorkout.minutes && !newWorkout.seconds)) {
      setSaveMessage('Please fill in distance and at least one duration field');
      setSaveStatus('error');
      return;
    }

    try {
      setSaveStatus('saving');
      setSaveMessage('Saving workout...');

      const distance = parseFloat(newWorkout.distance);
      
      // Calculate total duration in SECONDS (more precise, avoids decimal issues)
      const hours = parseInt(newWorkout.hours) || 0;
      const minutes = parseInt(newWorkout.minutes) || 0;
      const seconds = parseInt(newWorkout.seconds) || 0;
      
      // Convert everything to total seconds (integer, no decimals)
      const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;

      if (isNaN(distance) || distance <= 0) {
        throw new Error('Please enter a valid distance greater than 0');
      }

      if (totalSeconds <= 0) {
        throw new Error('Please enter a valid duration (at least 1 second)');
      }

      console.log('Duration calculation:', {
        hours,
        minutes, 
        seconds,
        totalSeconds,
        calculation: `${hours} * 3600 + ${minutes} * 60 + ${seconds} = ${totalSeconds} seconds`
      });

      console.log('About to call DatabaseService.saveRunningWorkout with:', {
        date: newWorkout.date,
        distance,
        duration: totalSeconds,
        runType: newWorkout.runType,
        notes: newWorkout.notes
      });

      await DatabaseService.saveRunningWorkout(
        newWorkout.date,
        distance,
        totalSeconds,
        newWorkout.runType,
        newWorkout.notes
      );

      console.log('DatabaseService.saveRunningWorkout completed successfully');

      // Clear form
      setNewWorkout({
        distance: "",
        hours: "",
        minutes: "",
        seconds: "",
        runType: "easy",
        notes: "",
        date: new Date().toISOString().split("T")[0],
      });

      // Reload workouts
      await loadWorkouts();

      setSaveStatus('saved');
      setSaveMessage('Workout saved successfully!');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle');
        setSaveMessage('');
      }, 3000);

    } catch (error) {
      console.error('Error saving running workout:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        error: error
      });
      setSaveStatus('error');
      setSaveMessage(error instanceof Error ? error.message : 'Failed to save workout');
    }
  };

  const deleteWorkout = async (id: string) => {
    if (!confirm('Are you sure you want to delete this workout?')) return;

    try {
      setIsLoading(true);
      
      // First get the workout session ID
      const { data: workoutData, error: workoutError } = await supabase
        .from('running_workouts')
        .select('workout_session_id')
        .eq('id', id)
        .single();

      if (workoutError) throw workoutError;

      // Delete the running workout record
      const { error: deleteWorkoutError } = await supabase
        .from('running_workouts')
        .delete()
        .eq('id', id);

      if (deleteWorkoutError) throw deleteWorkoutError;

      // Delete the workout session
      const { error: deleteSessionError } = await supabase
        .from('workout_sessions')
        .delete()
        .eq('id', workoutData.workout_session_id);

      if (deleteSessionError) throw deleteSessionError;

      // Reload workouts
      await loadWorkouts();
    } catch (error) {
      console.error('Error deleting workout:', error);
      alert('Failed to delete workout');
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setNewWorkout({
      distance: "",
      hours: "",
      minutes: "",
      seconds: "",
      runType: "easy",
      notes: "",
      date: new Date().toISOString().split("T")[0],
    });
    setSaveStatus('idle');
    setSaveMessage('');
  };

  const debugDatabase = async () => {
    try {
      console.log('=== RUNNING PAGE DEBUG ===');
      
      // Test database connection
      const { data: connectionTest, error: connectionError } = await supabase
        .from('workout_sessions')
        .select('id')
        .limit(1);
      
      console.log('Database connection test:', { data: connectionTest, error: connectionError });
      
      // Check workout sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('workout_type', 'running');
      
      console.log('Running workout sessions:', { data: sessions, error: sessionsError });
      
      // Check running workouts table
      const { data: runningWorkouts, error: runningError } = await supabase
        .from('running_workouts')
        .select('*');
      
      console.log('Running workouts table:', { data: runningWorkouts, error: runningError });
      
      // Check table structure
      const { data: tableInfo, error: tableError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable')
        .eq('table_name', 'running_workouts');
      
      console.log('Running workouts table structure:', { data: tableInfo, error: tableError });
      
    } catch (error) {
      console.error('Debug error:', error);
    }
  };

  // Helper function to format duration from seconds to HH:MM:SS
  const formatDuration = (totalSeconds: number): string => {
    if (!totalSeconds || totalSeconds <= 0) return '-';
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  };

  // Helper function to calculate pace
  const calculatePace = (totalSeconds: number, distance: number): string => {
    if (distance <= 0 || !totalSeconds) return '-';
    
    const totalMinutes = totalSeconds / 60;
    const paceMinutes = Math.floor(totalMinutes / distance);
    const paceSeconds = Math.round(((totalMinutes / distance) % 1) * 60);
    return `${paceMinutes}:${paceSeconds.toString().padStart(2, '0')} /mi`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'oklch(0.985 0 0)' }}>
          Running Tracker
        </h1>
        <p style={{ color: 'oklch(0.708 0 0)' }}>
          Track your running workouts and monitor your progress
        </p>
      </div>

      {/* Database Connection Status */}
      <div className="mb-6 p-4 rounded-lg border" style={{ 
        backgroundColor: dbConnectionStatus === 'connected' ? 'oklch(0.145 0 0)' : 'oklch(0.269 0 0)',
        borderColor: dbConnectionStatus === 'connected' ? 'oklch(0.269 0 0)' : 'oklch(0.488 0.243 264.376)'
      }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              dbConnectionStatus === 'connected' ? 'bg-green-500' : 
              dbConnectionStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'
            }`}></div>
            <span className="font-medium" style={{ color: 'oklch(0.985 0 0)' }}>
              Database Status: {
                dbConnectionStatus === 'connected' ? 'Connected' :
                dbConnectionStatus === 'error' ? 'Connection Error' : 'Testing...'
              }
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={testDatabaseConnection}
              className="px-3 py-1 text-sm rounded-lg hover:scale-105 transition-all duration-200"
              style={{ backgroundColor: 'oklch(0.269 0 0)', color: 'oklch(0.985 0 0)' }}
            >
              Test Connection
            </button>
            <button
              onClick={debugDatabase}
              className="px-3 py-1 text-sm rounded-lg hover:scale-105 transition-all duration-200"
              style={{ backgroundColor: 'oklch(0.488 0.243 264.376)', color: 'oklch(0.205 0 0)' }}
            >
              Debug
            </button>
          </div>
        </div>
      </div>

      {/* Add New Workout Form */}
      <div className="mb-8 p-6 rounded-lg border" style={{ backgroundColor: 'oklch(0.145 0 0)', borderColor: 'oklch(0.269 0 0)' }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'oklch(0.985 0 0)' }}>
          Add New Running Workout
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.985 0 0)' }}>
              Distance (miles)
            </label>
            <input
              type="number"
              step="0.1"
              value={newWorkout.distance}
              onChange={(e) => setNewWorkout({ ...newWorkout, distance: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ backgroundColor: 'oklch(0.269 0 0)', color: 'oklch(0.985 0 0)', border: '1px solid oklch(0.269 0 0)' }}
              placeholder="5.2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.985 0 0)' }}>
              Duration
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs text-center mb-1" style={{ color: 'oklch(0.708 0 0)' }}>
                  Hours
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={newWorkout.hours}
                  onChange={(e) => setNewWorkout({ ...newWorkout, hours: e.target.value })}
                  className="w-full px-2 py-2 rounded-lg text-sm text-center"
                  style={{ backgroundColor: 'oklch(0.269 0 0)', color: 'oklch(0.985 0 0)', border: '1px solid oklch(0.269 0 0)' }}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs text-center mb-1" style={{ color: 'oklch(0.708 0 0)' }}>
                  Minutes
                </label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  step="1"
                  value={newWorkout.minutes}
                  onChange={(e) => setNewWorkout({ ...newWorkout, minutes: e.target.value })}
                  className="w-full px-2 py-2 rounded-lg text-sm text-center"
                  style={{ backgroundColor: 'oklch(0.269 0 0)', color: 'oklch(0.985 0 0)', border: '1px solid oklch(0.269 0 0)' }}
                  placeholder="45"
                />
              </div>
              <div>
                <label className="block text-xs text-center mb-1" style={{ color: 'oklch(0.708 0 0)' }}>
                  Seconds
                </label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  step="1"
                  value={newWorkout.seconds}
                  onChange={(e) => setNewWorkout({ ...newWorkout, seconds: e.target.value })}
                  className="w-full px-2 py-2 rounded-lg text-sm text-center"
                  style={{ backgroundColor: 'oklch(0.269 0 0)', color: 'oklch(0.985 0 0)', border: '1px solid oklch(0.269 0 0)' }}
                  placeholder="30"
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.985 0 0)' }}>
              Run Type
            </label>
            <select
              value={newWorkout.runType}
              onChange={(e) => setNewWorkout({ ...newWorkout, runType: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ backgroundColor: 'oklch(0.269 0 0)', color: 'oklch(0.985 0 0)', border: '1px solid oklch(0.269 0 0)' }}
            >
              <option value="easy">Easy</option>
              <option value="tempo">Tempo</option>
              <option value="intervals">Intervals</option>
              <option value="long">Long Run</option>
              <option value="recovery">Recovery</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.985 0 0)' }}>
              Date
            </label>
            <input
              type="date"
              value={newWorkout.date}
              onChange={(e) => setNewWorkout({ ...newWorkout, date: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ backgroundColor: 'oklch(0.269 0 0)', color: 'oklch(0.985 0 0)', border: '1px solid oklch(0.269 0 0)' }}
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.985 0 0)' }}>
            Notes (optional)
          </label>
          <textarea
            value={newWorkout.notes}
            onChange={(e) => setNewWorkout({ ...newWorkout, notes: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 rounded-lg text-sm"
            style={{ backgroundColor: 'oklch(0.269 0 0)', color: 'oklch(0.985 0 0)', border: '1px solid oklch(0.269 0 0)' }}
            placeholder="How did the run feel? Any specific notes..."
          />
        </div>
        
        {/* Save Status and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {saveStatus === 'saving' && (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2" style={{ borderColor: 'oklch(0.488 0.243 264.376)' }}></div>
                <span style={{ color: 'oklch(0.708 0 0)' }}>Saving...</span>
              </div>
            )}
            
            {saveStatus === 'saved' && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-green-400">Saved!</span>
              </div>
            )}
            
            {saveStatus === 'error' && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span className="text-red-400">{saveMessage}</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => {
                console.log('Current form state:', newWorkout);
                const hours = parseInt(newWorkout.hours) || 0;
                const minutes = parseInt(newWorkout.minutes) || 0;
                const seconds = parseInt(newWorkout.seconds) || 0;
                const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
                console.log('Duration calculation test:', {
                  hours,
                  minutes,
                  seconds,
                  totalSeconds,
                  calculation: `${hours} * 3600 + ${minutes} * 60 + ${seconds} = ${totalSeconds} seconds`
                });
              }}
              className="px-3 py-1 text-sm rounded-lg hover:scale-105 transition-all duration-200"
              style={{ backgroundColor: 'oklch(0.269 0 0)', color: 'oklch(0.985 0 0)' }}
            >
              Test Duration
            </button>
            <button
              onClick={clearForm}
              className="px-4 py-2 rounded-lg hover:scale-105 transition-all duration-200"
              style={{ backgroundColor: 'oklch(0.269 0 0)', color: 'oklch(0.985 0 0)' }}
            >
              Clear
            </button>
            
            <button
              onClick={addWorkout}
              disabled={saveStatus === 'saving'}
              className="px-4 py-2 rounded-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'oklch(0.488 0.243 264.376)', color: 'oklch(0.205 0 0)' }}
            >
              {saveStatus === 'saving' ? 'Saving...' : 'Save Workout'}
            </button>
          </div>
        </div>
      </div>

      {/* Workouts List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold" style={{ color: 'oklch(0.985 0 0)' }}>
            Running History
          </h2>
          <button
            onClick={loadWorkouts}
            disabled={isLoading}
            className="px-3 py-1 text-sm rounded-lg hover:scale-105 transition-all duration-200 disabled:opacity-50"
            style={{ backgroundColor: 'oklch(0.269 0 0)', color: 'oklch(0.985 0 0)' }}
          >
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {isLoading && workouts.length === 0 ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{ borderColor: 'oklch(0.488 0.243 264.376)' }}></div>
            <p style={{ color: 'oklch(0.708 0 0)' }}>Loading running workouts...</p>
          </div>
        ) : workouts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg font-medium mb-2" style={{ color: 'oklch(0.985 0 0)' }}>
              No running workouts yet
            </p>
            <p style={{ color: 'oklch(0.708 0 0)' }}>
              Add your first running workout above to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {workouts.map((workout) => (
              <div
                key={workout.id}
                className="p-4 rounded-lg border hover:scale-[1.01] transition-all duration-200"
                style={{ backgroundColor: 'oklch(0.145 0 0)', borderColor: 'oklch(0.269 0 0)' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: 'oklch(0.769 0.188 70.08)', color: 'white' }}
                      >
                        {workout.runType.charAt(0).toUpperCase() + workout.runType.slice(1)} Run
                      </span>
                      <span className="text-sm" style={{ color: 'oklch(0.708 0 0)' }}>
                        {new Date(workout.date).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span style={{ color: 'oklch(0.708 0 0)' }}>Distance:</span>
                        <span className="ml-2 font-medium" style={{ color: 'oklch(0.985 0 0)' }}>
                          {workout.distance} mi
                        </span>
                      </div>
                      <div>
                        <span style={{ color: 'oklch(0.708 0 0)' }}>Duration:</span>
                        <span className="ml-2 font-medium" style={{ color: 'oklch(0.985 0 0)' }}>
                          {formatDuration(workout.duration)}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: 'oklch(0.708 0 0)' }}>Pace:</span>
                        <span className="ml-2 font-medium" style={{ color: 'oklch(0.985 0 0)' }}>
                          {calculatePace(workout.duration, workout.distance)}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: 'oklch(0.708 0 0)' }}>Speed:</span>
                        <span className="ml-2 font-medium" style={{ color: 'oklch(0.985 0 0)' }}>
                          {(workout.distance / (workout.duration / 3600)).toFixed(2)} mph
                        </span>
                      </div>
                    </div>
                    
                    {workout.notes && (
                      <div className="mt-2">
                        <span style={{ color: 'oklch(0.708 0 0)' }}>Notes:</span>
                        <span className="ml-2" style={{ color: 'oklch(0.985 0 0)' }}>{workout.notes}</span>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => deleteWorkout(workout.id)}
                    className="ml-4 px-3 py-1 text-sm rounded-lg hover:scale-105 transition-all duration-200"
                    style={{ backgroundColor: 'oklch(0.269 0 0)', color: 'oklch(0.985 0 0)' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 