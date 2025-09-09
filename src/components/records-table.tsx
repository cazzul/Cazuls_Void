"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Calendar, ChevronUp, ChevronDown, Download, Dumbbell, Activity, Mountain } from "lucide-react";
import { 
  RecordsService, 
  RecordsFilters, 
  UnifiedWorkoutRecord, 
  UnifiedWorkoutSortConfig 
} from "../lib/records-service";

interface RecordsTableProps {
  className?: string;
}

export default function RecordsTable({ className = "" }: RecordsTableProps) {
  const [unifiedWorkouts, setUnifiedWorkouts] = useState<UnifiedWorkoutRecord[]>([]);
  const [muscleGroups, setMuscleGroups] = useState<Array<{ name: string; color: string }>>([]);
  const [exercises, setExercises] = useState<string[]>([]);
  const [stats, setStats] = useState({
    earliestDate: "",
    latestDate: "",
    totalSets: 0,
    totalWorkouts: 0,
    totalRunningWorkouts: 0,
    totalMTBWorkouts: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<RecordsFilters>({});
  const [sortConfig, setSortConfig] = useState<UnifiedWorkoutSortConfig>({ field: 'date', direction: 'desc' });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([]);
  const [selectedWorkoutTypes, setSelectedWorkoutTypes] = useState<('lifting' | 'running' | 'mtb')[]>([]);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        
        // Load data in parallel
        const [workouts, groups, exerciseList, statsData] = await Promise.all([
          RecordsService.getAllUnifiedWorkouts(),
          RecordsService.getMuscleGroups(),
          RecordsService.getExercises(),
          RecordsService.getDateRangeStats()
        ]);

        setUnifiedWorkouts(workouts);
        setMuscleGroups(groups);
        setExercises(exerciseList);
        setStats(statsData);
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    const applyFiltersAndSort = async () => {
      try {
        setIsLoading(true);
        const filteredWorkouts = await RecordsService.getAllUnifiedWorkouts(filters, sortConfig);
        setUnifiedWorkouts(filteredWorkouts);
      } catch (error) {
        console.error('Error applying filters:', error);
      } finally {
        setIsLoading(false);
      }
    };

    applyFiltersAndSort();
  }, [filters, sortConfig]);

  // Handle sorting
  const handleSort = (field: keyof UnifiedWorkoutRecord) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle search
  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({
      ...prev,
      searchTerm: searchTerm || undefined
    }));
  };

  // Handle workout type filter
  const handleWorkoutTypeFilter = (workoutType: 'lifting' | 'running' | 'mtb') => {
    setSelectedWorkoutTypes(prev => {
      if (prev.includes(workoutType)) {
        const filtered = prev.filter(t => t !== workoutType);
        setFilters(prevFilters => ({
          ...prevFilters,
          workoutTypes: filtered.length > 0 ? filtered : undefined
        }));
        return filtered;
      } else {
        const updated = [...prev, workoutType];
        setFilters(prevFilters => ({
          ...prevFilters,
          workoutTypes: updated
        }));
        return updated;
      }
    });
  };

  // Handle muscle group filter
  const handleMuscleGroupFilter = (muscleGroup: string) => {
    setSelectedMuscleGroups(prev => {
      if (prev.includes(muscleGroup)) {
        const filtered = prev.filter(g => g !== muscleGroup);
        setFilters(prevFilters => ({
          ...prevFilters,
          muscleGroups: filtered.length > 0 ? filtered : undefined
        }));
        return filtered;
      } else {
        const updated = [...prev, muscleGroup];
        setFilters(prevFilters => ({
          ...prevFilters,
          muscleGroups: updated
        }));
        return updated;
      }
    });
  };

  // Handle date range filter
  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setFilters(prev => ({
      ...prev,
      dateRange: startDate && endDate ? { start: startDate, end: endDate } : undefined
    }));
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Date', 'Type', 'Workout Type', 'Category', 'Distance', 'Duration', 'Weight', 'Reps', 'Set', 'Pace/Speed', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...unifiedWorkouts.map(workout => [
        workout.date,
        workout.type,
        workout.workoutType,
        workout.category,
        workout.distance || '',
        workout.duration || '',
        workout.weight || '',
        workout.reps || '',
        workout.setNumber || '',
        workout.pace || workout.speed || '',
        workout.notes || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `unified-workout-records-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Get sort icon
  const getSortIcon = (field: keyof UnifiedWorkoutRecord) => {
    if (sortConfig.field !== field) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get workout type icon
  const getWorkoutTypeIcon = (workoutType: 'lifting' | 'running' | 'mtb') => {
    switch (workoutType) {
      case 'lifting': return <Dumbbell className="h-4 w-4" />;
      case 'running': return <Activity className="h-4 w-4" />;
      case 'mtb': return <Mountain className="h-4 w-4" />;
      default: return null;
    }
  };

  // Get workout type color
  const getWorkoutTypeColor = (workoutType: 'lifting' | 'running' | 'mtb') => {
    switch (workoutType) {
      case 'lifting': return 'oklch(68.6% 0.021 73.1)'; // Latte
      case 'running': return 'oklch(93.5% 0.005 250)'; // Cool Gray
      case 'mtb': return 'oklch(79.6% 0.025 76.5)'; // Dusk
      default: return 'oklch(91% 0.007 90)'; // Taupe
    }
  };

  // Format duration from seconds to HH:MM:SS
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

  if (isLoading && unifiedWorkouts.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{ borderColor: 'oklch(74.1% 0.054 62.9)' }}></div> {/* Terracotta */}
          <p style={{ color: 'oklch(91% 0.007 90)' }}>Loading unified workout records...</p> {/* Taupe */}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="p-4 rounded-lg border" style={{ backgroundColor: 'oklch(87.1% 0.018 78.4)', borderColor: 'oklch(90% 0.012 235)' }}> {/* Sweet Beige background, Spring Rain border */}
          <div className="text-2xl font-bold" style={{ color: 'oklch(74.1% 0.054 62.9)' }}> {/* Terracotta */}
            {stats.totalSets}
          </div>
          <div className="text-sm" style={{ color: 'oklch(91% 0.007 90)' }}>Total Sets</div> {/* Taupe */}
        </div>
        <div className="p-4 rounded-lg border" style={{ backgroundColor: 'oklch(87.1% 0.018 78.4)', borderColor: 'oklch(90% 0.012 235)' }}> {/* Sweet Beige background, Spring Rain border */}
          <div className="text-2xl font-bold" style={{ color: 'oklch(74.1% 0.054 62.9)' }}> {/* Terracotta */}
            {stats.totalWorkouts}
          </div>
          <div className="text-sm" style={{ color: 'oklch(91% 0.007 90)' }}>Total Workouts</div> {/* Taupe */}
        </div>
        <div className="p-4 rounded-lg border" style={{ backgroundColor: 'oklch(87.1% 0.018 78.4)', borderColor: 'oklch(90% 0.012 235)' }}> {/* Sweet Beige background, Spring Rain border */}
          <div className="text-lg font-bold" style={{ color: 'oklch(74.1% 0.054 62.9)' }}> {/* Terracotta */}
            {stats.totalRunningWorkouts}
          </div>
          <div className="text-sm" style={{ color: 'oklch(91% 0.007 90)' }}>Running</div> {/* Taupe */}
        </div>
        <div className="p-4 rounded-lg border" style={{ backgroundColor: 'oklch(87.1% 0.018 78.4)', borderColor: 'oklch(90% 0.012 235)' }}> {/* Sweet Beige background, Spring Rain border */}
          <div className="text-lg font-bold" style={{ color: 'oklch(74.1% 0.054 62.9)' }}> {/* Terracotta */}
            {stats.totalMTBWorkouts}
          </div>
          <div className="text-sm" style={{ color: 'oklch(91% 0.007 90)' }}>MTB Rides</div> {/* Taupe */}
        </div>
        <div className="p-4 rounded-lg border" style={{ backgroundColor: 'oklch(87.1% 0.018 78.4)', borderColor: 'oklch(90% 0.012 235)' }}> {/* Sweet Beige background, Spring Rain border */}
          <div className="text-lg font-bold" style={{ color: 'oklch(74.1% 0.054 62.9)' }}> {/* Terracotta */}
            {formatDate(stats.earliestDate)}
          </div>
          <div className="text-sm" style={{ color: 'oklch(91% 0.007 90)' }}>First Workout</div> {/* Taupe */}
        </div>
        <div className="p-4 rounded-lg border" style={{ backgroundColor: 'oklch(87.1% 0.018 78.4)', borderColor: 'oklch(90% 0.012 235)' }}> {/* Sweet Beige background, Spring Rain border */}
          <div className="text-lg font-bold" style={{ color: 'oklch(74.1% 0.054 62.9)' }}> {/* Terracotta */}
            {formatDate(stats.latestDate)}
          </div>
          <div className="text-sm" style={{ color: 'oklch(91% 0.007 90)' }}>Latest Workout</div> {/* Taupe */}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="space-y-4">
        {/* Search and Export */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: 'oklch(0.708 0 0)' }} />
            <input
              type="text"
              placeholder="Search workouts, exercises, or categories..."
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg text-sm"
              style={{ backgroundColor: 'oklch(0.269 0 0)', color: 'oklch(0.985 0 0)', border: '1px solid oklch(0.269 0 0)' }}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 rounded-lg hover:scale-105 transition-all duration-200"
            style={{ backgroundColor: 'oklch(0.269 0 0)', color: 'oklch(0.985 0 0)' }}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center px-4 py-2 rounded-lg hover:scale-105 transition-all duration-200"
            style={{ backgroundColor: 'oklch(0.488 0.243 264.376)', color: 'oklch(0.205 0 0)' }}
          >
            <Download className="mr-2 h-4 w-4" />
            Export All
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="p-4 rounded-lg border space-y-4" style={{ backgroundColor: 'oklch(0.145 0 0)', borderColor: 'oklch(0.269 0 0)' }}>
            {/* Workout Types */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.985 0 0)' }}>
                Workout Types
              </label>
              <div className="flex flex-wrap gap-2">
                {(['lifting', 'running', 'mtb'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => handleWorkoutTypeFilter(type)}
                    className={`px-3 py-1 rounded-lg text-sm transition-all duration-200 ${
                      selectedWorkoutTypes.includes(type)
                        ? 'text-white'
                        : 'text-gray-300 hover:text-white'
                    }`}
                    style={{
                      backgroundColor: selectedWorkoutTypes.includes(type) 
                        ? getWorkoutTypeColor(type)
                        : 'oklch(0.269 0 0)',
                      border: `1px solid ${getWorkoutTypeColor(type)}`
                    }}
                  >
                    {getWorkoutTypeIcon(type)} {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.985 0 0)' }}>
                Date Range
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  onChange={(e) => handleDateRangeChange(e.target.value, filters.dateRange?.end || '')}
                  className="px-3 py-2 rounded-lg text-sm"
                  style={{ backgroundColor: 'oklch(0.269 0 0)', color: 'oklch(0.985 0 0)', border: '1px solid oklch(0.269 0 0)' }}
                />
                <span className="flex items-center" style={{ color: 'oklch(0.708 0 0)' }}>to</span>
                <input
                  type="date"
                  onChange={(e) => handleDateRangeChange(filters.dateRange?.start || '', e.target.value)}
                  className="px-3 py-2 rounded-lg text-sm"
                  style={{ backgroundColor: 'oklch(0.269 0 0)', color: 'oklch(0.985 0 0)', border: '1px solid oklch(0.269 0 0)' }}
                />
              </div>
            </div>

            {/* Muscle Groups (for lifting workouts) */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.985 0 0)' }}>
                Muscle Groups (Lifting Only)
              </label>
              <div className="flex flex-wrap gap-2">
                {muscleGroups.map(group => (
                  <button
                    key={group.name}
                    onClick={() => handleMuscleGroupFilter(group.name)}
                    className={`px-3 py-1 rounded-lg text-sm transition-all duration-200 ${
                      selectedMuscleGroups.includes(group.name)
                        ? 'text-white'
                        : 'text-gray-300 hover:text-white'
                    }`}
                    style={{
                      backgroundColor: selectedMuscleGroups.includes(group.name) 
                        ? group.color 
                        : 'oklch(0.269 0 0)',
                      border: `1px solid ${group.color}`
                    }}
                  >
                    {group.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Unified Records Table */}
      <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: 'oklch(87.1% 0.018 78.4)', borderColor: 'oklch(90% 0.012 235)' }}> /* Sweet Beige background, Spring Rain border */
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: 'oklch(88.7% 0.009 89.1)' }}> /* Oat */
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('date')}
                    className="flex items-center gap-1 hover:scale-105 transition-all duration-200 font-medium"
                    style={{ color: 'oklch(68.6% 0.021 73.1)' }} /* Latte */
                  >
                    Date {getSortIcon('date')}
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('workoutType')}
                    className="flex items-center gap-1 hover:scale-105 transition-all duration-200 font-medium"
                    style={{ color: 'oklch(68.6% 0.021 73.1)' }} /* Latte */
                  >
                    Type {getSortIcon('workoutType')}
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('type')}
                    className="flex items-center gap-1 hover:scale-105 transition-all duration-200 font-medium"
                    style={{ color: 'oklch(68.6% 0.021 73.1)' }} /* Latte */
                  >
                    Workout {getSortIcon('type')}
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('category')}
                    className="flex items-center gap-1 hover:scale-105 transition-all duration-200 font-medium"
                    style={{ color: 'oklch(68.6% 0.021 73.1)' }} /* Latte */
                  >
                    Category {getSortIcon('category')}
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('distance')}
                    className="flex items-center gap-1 hover:scale-105 transition-all duration-200 font-medium"
                    style={{ color: 'oklch(68.6% 0.021 73.1)' }} /* Latte */
                  >
                    Distance {getSortIcon('distance')}
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('duration')}
                    className="flex items-center gap-1 hover:scale-105 transition-all duration-200 font-medium"
                    style={{ color: 'oklch(68.6% 0.021 73.1)' }} /* Latte */
                  >
                    Duration {getSortIcon('duration')}
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('weight')}
                    className="flex items-center gap-1 hover:scale-105 transition-all duration-200 font-medium"
                    style={{ color: 'oklch(68.6% 0.021 73.1)' }} /* Latte */
                  >
                    Weight {getSortIcon('weight')}
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('reps')}
                    className="flex items-center gap-1 hover:scale-105 transition-all duration-200 font-medium"
                    style={{ color: 'oklch(68.6% 0.021 73.1)' }} /* Latte */
                  >
                    Reps {getSortIcon('reps')}
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('setNumber')}
                    className="flex items-center gap-1 hover:scale-105 transition-all duration-200 font-medium"
                    style={{ color: 'oklch(68.6% 0.021 73.1)' }} /* Latte */
                  >
                    Set {getSortIcon('setNumber')}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {unifiedWorkouts.map((workout, index) => (
                <tr
                  key={workout.id}
                  className={`hover:scale-[1.01] transition-all duration-200 ${
                    index % 2 === 0 ? 'bg-opacity-50' : ''
                  }`}
                  style={{ backgroundColor: index % 2 === 0 ? 'oklch(88.7% 0.009 89.1)' : 'transparent' }} /* Oat for alternating rows */
                >
                  <td className="px-4 py-3 text-sm" style={{ color: 'oklch(68.6% 0.021 73.1)' }}> /* Latte */
                    {formatDate(workout.date)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                      style={{ backgroundColor: getWorkoutTypeColor(workout.workoutType), color: 'white' }}
                    >
                      {getWorkoutTypeIcon(workout.workoutType)}
                      {workout.workoutType.charAt(0).toUpperCase() + workout.workoutType.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: 'oklch(68.6% 0.021 73.1)' }}> /* Latte */
                    {workout.type}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: workout.color, color: 'white' }}
                    >
                      {workout.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'oklch(68.6% 0.021 73.1)' }}> /* Latte */
                    {workout.distance ? `${workout.distance} mi` : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'oklch(68.6% 0.021 73.1)' }}> /* Latte */
                    {workout.duration ? formatDuration(workout.duration) : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'oklch(68.6% 0.021 73.1)' }}> /* Latte */
                    {workout.weight ? `${workout.weight} lbs` : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'oklch(68.6% 0.021 73.1)' }}> /* Latte */
                    {workout.reps || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'oklch(91% 0.007 90)' }}> /* Taupe */
                    {workout.setNumber || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {unifiedWorkouts.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-lg font-medium mb-2" style={{ color: 'oklch(68.6% 0.021 73.1)' }}> /* Latte */
              No workout records found
            </p>
            <p style={{ color: 'oklch(91% 0.007 90)' }}> /* Taupe */
              {filters.searchTerm || filters.workoutTypes || filters.muscleGroups || filters.dateRange
                ? 'Try adjusting your filters or search terms.'
                : 'Start logging workouts in the Lifts, Running, and MTB pages to see your records here!'}
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && unifiedWorkouts.length > 0 && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 mx-auto mb-2" style={{ borderColor: 'oklch(74.1% 0.054 62.9)' }}></div> /* Terracotta */
            <p className="text-sm" style={{ color: 'oklch(0.708 0 0)' }}>Updating records...</p>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="text-center text-sm" style={{ color: 'oklch(91% 0.007 90)' }}> /* Taupe */
        Showing {unifiedWorkouts.length} workout record{unifiedWorkouts.length !== 1 ? 's' : ''}
        {filters.searchTerm && ` matching "${filters.searchTerm}"`}
        {filters.workoutTypes && filters.workoutTypes.length > 0 && ` of type(s): ${filters.workoutTypes.join(', ')}`}
        {filters.muscleGroups && filters.muscleGroups.length > 0 && ` in muscle group(s): ${filters.muscleGroups.join(', ')}`}
      </div>
    </div>
  );
} 