# Chart Integration Guide - Cazuls Void Fitness Tracker

## 🎯 **How the Chart System Works**

### **1. Database Structure**
The system uses a relational database with the following key tables:
- **`body_parts`** - Defines muscle groups (Back, Chest, Biceps, etc.)
- **`exercise_categories`** - Maps exercises to body parts
- **`workout_sessions`** - Tracks workout sessions by type and date
- **`lifting_exercises`** - Records exercises and sets completed
- **`running_workouts`** - Tracks running distance and duration
- **`mtb_workouts`** - Tracks MTB rides and metrics

### **2. Exercise to Body Part Mapping**
The system automatically maps exercises to body parts:
```typescript
// Examples:
'Pull-ups' → 'Back'
'Bench Press' → 'Chest'
'Back Squat' → 'Quads'
'Romanian Deadlift' → 'Hamstrings'
```

### **3. Data Flow**
1. **User logs workout** in Lifts/Running/MTB pages
2. **System maps exercises** to body parts automatically
3. **Data is aggregated** by day and body part
4. **Chart displays** weekly volume across all muscle groups

## 🚀 **Current Implementation**

### **ChartDataService**
- **`getBodyPartForExercise()`** - Maps exercise names to body parts
- **`generateWeeklyVolumeData()`** - Creates chart data from workout data
- **`aggregateByBodyPart()`** - Summarizes data by date range

### **Sample Data Structure**
```typescript
const workout = {
  date: '2025-01-20',
  workoutType: 'lifting',
  exercises: [
    { name: 'Pull-ups', sets: 3, bodyPart: 'Back' },
    { name: 'Bench Press', sets: 4, bodyPart: 'Chest' }
  ]
};
```

## 🔧 **Next Steps for Full Integration**

### **1. Database Setup**
```bash
# Run the database schema
psql -d your_database -f database-schema.sql
```

### **2. Update Workout Pages**
- **Lifts page**: Save exercises with body part mapping
- **Running page**: Save distance and duration
- **MTB page**: Save ride metrics

### **3. Data Fetching**
Replace sample data with real database queries:
```typescript
// Instead of sample data, fetch from database
const workouts = await fetchWorkoutsFromDatabase(startDate, endDate);
const chartData = ChartDataService.generateWeeklyVolumeData(workouts);
```

### **4. Real-time Updates**
- **Save workout** → **Update chart** automatically
- **Delete workout** → **Recalculate chart** data
- **Edit workout** → **Refresh chart** display

## 📊 **Chart Display Logic**

### **Lifting Workouts**
- **Sets completed** = Number of working sets
- **Body part volume** = Sum of sets per muscle group
- **Example**: 3 sets of Pull-ups = 3 working sets of Back

### **Running Workouts**
- **Distance** = Miles run per day
- **Displayed as**: Running volume in the chart

### **MTB Workouts**
- **Distance** = Miles ridden per day
- **Displayed as**: Biking volume in the chart

## 🎨 **Customization Options**

### **Add New Exercises**
```typescript
// Add to exerciseToBodyPart mapping
'New Exercise': 'Target Body Part'
```

### **Add New Body Parts**
```sql
INSERT INTO body_parts (name, color) VALUES ('New Muscle', 'oklch(0.5 0.2 180)');
```

### **Modify Chart Colors**
Update the `customColors` object in the chart component.

## 🔍 **Example Workflow**

1. **Monday**: Log 4 sets of Bench Press
   - System maps 'Bench Press' → 'Chest'
   - Chart shows 4 working sets of Chest on Monday

2. **Wednesday**: Log 5-mile run
   - System records 5 miles of Running
   - Chart shows 5 miles of Running on Wednesday

3. **Thursday**: Log 3 sets of Back Squat
   - System maps 'Back Squat' → 'Quads'
   - Chart shows 3 working sets of Quads on Thursday

## 💡 **Benefits of This System**

- **Automatic categorization** - No manual body part selection needed
- **Real-time updates** - Chart reflects actual workout data
- **Accurate tracking** - See exactly how much volume per muscle group
- **Progress monitoring** - Track weekly volume changes over time
- **Data consistency** - Standardized exercise naming and categorization

## 🚧 **Current Status**

- ✅ **Database schema** - Complete
- ✅ **Chart service** - Complete
- ✅ **Sample integration** - Complete
- 🔄 **Real data integration** - Next step
- 🔄 **Database connection** - To be implemented
- 🔄 **Real-time updates** - To be implemented

The chart system is now ready to display real workout data once you connect it to your database and update the workout tracking pages! 