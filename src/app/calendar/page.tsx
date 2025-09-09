"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Dumbbell, Zap, Clock, Activity, TrendingUp } from "lucide-react";
import { getWorkoutForDate, getCurrentRunningPhase, getCurrentWeekInPhase, getCurrentWeekTargets } from "@/lib/workout-data";
import { getWeekDates, getDayName, getCurrentWeekRange, isToday } from "@/lib/utils";

export default function CalendarPage() {
  const [currentWeek, setCurrentWeek] = useState(() => {
    // Initialize with the current week
    const today = new Date()
    const { start } = getCurrentWeekRange()
    return start
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const weekDates = getWeekDates(currentWeek);
  const currentPhase = getCurrentRunningPhase();
  const currentWeekInfo = getCurrentWeekInPhase();
  const currentTargets = getCurrentWeekTargets();

  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeek(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeek(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    const { start } = getCurrentWeekRange();
    setCurrentWeek(start);
    setSelectedDate(today);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <>
      {/* Header */}
      <header className="flex justify-between items-center p-6 border-b" style={{ borderColor: 'var(--color-muted)', backgroundColor: 'var(--color-card)' }}>
        <h2 className="text-xl font-semibold" style={{ color: 'var(--color-accent)' }}>CALENDAR</h2>
        <div className="text-right">
          <p className="text-lg font-bold" style={{ color: 'var(--color-accent)' }}>
            {currentTime.toLocaleTimeString()}
          </p>
          <p className="text-xs" style={{ color: 'var(--color-secondary)' }}>
            {currentTime.toLocaleDateString()}
          </p>
        </div>
      </header>

      {/* Calendar Content */}
      <div className="flex-1 p-6">
        {/* Running Phase Info */}
        {currentPhase && currentWeekInfo && currentTargets && (
          <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-lg p-6 border" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-muted)' }}>
              <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-accent)' }}>
                Current Running Phase
              </h3>
              <div className="space-y-2 text-sm" style={{ color: 'var(--color-foreground)' }}>
                <p><strong>Phase:</strong> {currentPhase.name}</p>
                <p><strong>Week:</strong> {currentWeekInfo.weekIndex + 1}</p>
                <p><strong>Deload Week:</strong> {currentWeekInfo.isDeloadWeek ? 'Yes' : 'No'}</p>
                <p><strong>Long Run Target:</strong> {currentTargets.longRun} miles</p>
                <p><strong>Tempo Target:</strong> {currentTargets.tempo}</p>
                <p><strong>Interval Target:</strong> {currentTargets.interval}</p>
              </div>
            </div>
            
            <div className="rounded-lg p-6 border" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-muted)' }}>
              <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-running)' }}>
                Running Progression
              </h3>
              <div className="space-y-2 text-sm" style={{ color: 'var(--color-foreground)' }}>
                <p>• Progressive distance increases</p>
                <p>• Deload every 4th week (after Dec 18)</p>
                <p>• Phase-based training cycles</p>
                <p>• Automatic progression tracking</p>
              </div>
            </div>
          </div>
        )}

        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={goToPreviousWeek}
            className="p-2 rounded-lg hover:scale-105 transition-all duration-200"
            style={{ backgroundColor: 'var(--color-muted)' }}
          >
            <ChevronLeft className="h-5 w-5" style={{ color: 'var(--color-foreground)' }} />
          </button>
          
          <div className="text-center">
            <h3 className="text-lg font-bold" style={{ color: 'var(--color-accent)' }}>
              {formatDate(weekDates[0])} - {formatDate(weekDates[6])}
            </h3>
            <button
              onClick={goToToday}
              className="text-sm px-3 py-1 rounded-lg hover:scale-105 transition-all duration-200"
              style={{ backgroundColor: 'var(--color-muted)', color: 'var(--color-foreground)' }}
            >
              Today
            </button>
          </div>
          
          <button
            onClick={goToNextWeek}
            className="p-2 rounded-lg hover:scale-105 transition-all duration-200"
            style={{ backgroundColor: 'var(--color-muted)' }}
          >
            <ChevronRight className="h-5 w-5" style={{ color: 'var(--color-foreground)' }} />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-4 mb-6">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center p-2">
              <div className="text-sm font-medium" style={{ color: 'var(--color-secondary)' }}>{day}</div>
            </div>
          ))}
          
          {weekDates.map((date, index) => {
            const workout = getWorkoutForDate(date);
            const isTodayDate = isToday(date);
            const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();
            
            return (
              <div
                key={index}
                onClick={() => handleDateClick(date)}
                className={`p-4 rounded-lg border cursor-pointer hover:scale-105 transition-all duration-200 ${
                  isTodayDate ? 'ring-2' : ''
                } ${isSelected ? 'ring-2' : ''}`}
                style={{ 
                  backgroundColor: 'var(--color-card)', 
                  borderColor: isTodayDate || isSelected ? 'var(--color-accent)' : 'var(--color-muted)'
                }}
              >
                <div className="text-sm font-medium mb-2" style={{ color: 'var(--color-foreground)' }}>
                  {date.getDate()}
                  {isTodayDate && (
                    <span className="ml-2 text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-button-text)' }}>
                      TODAY
                    </span>
                  )}
                </div>
                {workout && (
                  <div className="space-y-1">
                    {workout.workouts.map((w, i) => (
                      <div
                        key={i}
                        className="text-xs p-1 rounded"
                        style={{ backgroundColor: w.color, color: 'var(--color-foreground)' }}
                      >
                        {w.type}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Day Details */}
        {selectedDate && (
          <div className="rounded-lg p-6 border" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-muted)' }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-accent)' }}>
              {getDayName(selectedDate)} - {selectedDate.toLocaleDateString()}
            </h3>
            
            {(() => {
              const workout = getWorkoutForDate(selectedDate);
              if (!workout) {
                return (
                  <p style={{ color: 'var(--color-secondary)' }}>No workout scheduled for this day.</p>
                );
              }

              return (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {workout.workouts.map((w, i) => (
                    <div key={i} className="space-y-4">
                      <h4 className="text-md font-semibold" style={{ color: w.color }}>
                        {w.type}
                      </h4>
                      
                      {w.exercises.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium mb-2" style={{ color: 'var(--color-foreground)' }}>
                            <Dumbbell className="inline h-4 w-4 mr-2" />
                            Exercises
                          </h5>
                          <ul className="space-y-1 ml-6">
                            {w.exercises.map((exercise, j) => (
                              <li key={j} className="text-sm" style={{ color: 'var(--color-foreground)' }}>
                                • {exercise}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {w.warmup.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium mb-2" style={{ color: 'var(--color-foreground)' }}>
                            <Zap className="inline h-4 w-4 mr-2" />
                            Warmup
                          </h5>
                          <ul className="space-y-1 ml-6">
                            {w.warmup.map((item, j) => (
                              <li key={j} className="text-sm" style={{ color: 'var(--color-foreground)' }}>
                                • {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {w.mobility.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium mb-2" style={{ color: 'var(--color-foreground)' }}>
                            <Activity className="inline h-4 w-4 mr-2" />
                            Mobility/Activation
                          </h5>
                          <ul className="space-y-1 ml-6">
                            {w.mobility.map((item, j) => (
                              <li key={j} className="text-sm" style={{ color: 'var(--color-foreground)' }}>
                                • {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {w.stretches.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium mb-2" style={{ color: 'var(--color-foreground)' }}>
                            <TrendingUp className="inline h-4 w-4 mr-2" />
                            Stretches
                          </h5>
                          <ul className="space-y-1 ml-6">
                            {w.stretches.map((item, j) => (
                              <li key={j} className="text-sm" style={{ color: 'var(--color-foreground)' }}>
                                • {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </>
  );
} 