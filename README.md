# Cazuls Void - Fitness Tracker

A comprehensive fitness tracking application built with Next.js, TypeScript, and Tailwind CSS. Track your lifting, running, and MTB rides with detailed metrics and progress visualization.

## Features

### 🏋️ **Lifting Tracker**
- Track sets, reps, and weights for each exercise
- Support for Push, Pull, Legs, and Upper workout types
- Detailed exercise logging with multiple sets
- Progress tracking over time

### 🏃 **Running Tracker**
- Log different run types: Interval, Tempo, Long Run, Easy, Recovery
- Track distance, duration, and pace
- Interval workout support with custom rest periods
- Performance metrics and pace calculations

### 🚵 **MTB Tracker**
- Endurance and Power & Skills ride logging
- Distance, duration, and speed tracking
- Heart rate zone monitoring
- Ride notes and performance insights

### 📊 **Overview Dashboard**
- Weekly volume charts showing all workout types
- Color-coded workout categories
- Progress tracking across all activities
- Visual representation of weekly goals

### 📅 **Calendar View**
- Weekly workout calendar
- Color-coded workout types
- Easy navigation between weeks
- Today highlighting

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **UI Components**: Radix UI primitives

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Navigate to the project directory**
   ```bash
   cd "/Users/yadielcasul/Desktop/PROJECTS/WORKOUT APP"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── page.tsx          # Overview dashboard
│   ├── calendar/         # Calendar view
│   ├── lifts/            # Lifting tracker
│   ├── running/          # Running tracker
│   └── mtb/              # MTB tracker
├── components/            # Reusable UI components
│   ├── navigation-sidebar.tsx
│   ├── weekly-volume-chart.tsx
│   └── tracking-requirements.tsx
├── types/                 # TypeScript type definitions
│   └── workout.ts
└── lib/                   # Utility functions
    └── utils.ts
```

## Usage

### Adding Workouts

1. **Lifting**: Click "Add Workout" → Select workout type → Add exercises → Log sets/reps/weights
2. **Running**: Click "Add Run" → Choose run type → Enter distance/duration/pace → Add intervals if needed
3. **MTB**: Click "Add Ride" → Select ride type → Log distance/duration/speed → Add heart rate data

### Tracking Progress

- View weekly volume charts on the Overview page
- Navigate through weeks in the Calendar view
- Review workout history in each section
- Monitor performance trends over time

## Customization

### Workout Types
- Modify workout types in the respective page components
- Add new exercise categories in the types file
- Customize color schemes in the Tailwind config

### Data Persistence
Currently, the app stores data in local state. To add persistence:
- Integrate with a database (PostgreSQL, MongoDB)
- Add authentication for user accounts
- Implement data export/import functionality

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions or support, please open an issue in the repository or contact the development team.

---

**Built with ❤️ for fitness enthusiasts who want to track their progress and achieve their goals.**
