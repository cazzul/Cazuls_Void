# Database Troubleshooting Guide

## Issue: Lifts are not being saved to the database

If you're experiencing issues with workouts not being saved, follow these steps to diagnose and fix the problem.

## 🔍 **Step 1: Check Environment Variables**

The most common issue is missing Supabase environment variables.

### Create `.env.local` file in your project root:
```bash
# Navigate to your project directory
cd /Users/yadielcasul/Desktop/PROJECTS/WORKOUT\ APP

# Create the environment file
touch .env.local
```

### Add your Supabase credentials to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### How to get your Supabase credentials:
1. Go to [supabase.com](https://supabase.com) and sign in
2. Select your project (or create one)
3. Go to Settings → API
4. Copy the "Project URL" and "anon public" key

## 🔍 **Step 2: Test Database Connection**

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Navigate to the lifts page** (`/lifts`)

3. **Click "Test DB Connection"** button in the header

4. **Check the console** for any error messages

## 🔍 **Step 3: Check Browser Console**

Open your browser's Developer Tools (F12) and check the Console tab for errors:

- **Missing environment variables**: Look for "Missing Supabase environment variables"
- **Connection errors**: Look for network or authentication errors
- **Database errors**: Look for SQL or permission errors

## 🔍 **Step 4: Verify Database Schema**

Make sure your database has the required tables. Run the SQL from `database-schema.sql` in your Supabase SQL editor:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `database-schema.sql`
4. Click "Run" to execute the schema

## 🔍 **Step 5: Check Supabase RLS (Row Level Security)**

If you have RLS enabled, you might need to create policies:

```sql
-- Enable RLS on tables
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lifting_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE lifting_sets ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for testing)
CREATE POLICY "Allow public access to workout_sessions" ON workout_sessions FOR ALL USING (true);
CREATE POLICY "Allow public access to lifting_exercises" ON lifting_exercises FOR ALL USING (true);
CREATE POLICY "Allow public access to lifting_sets" ON lifting_sets FOR ALL USING (true);
```

## 🔍 **Step 6: Test with Simple Query**

Try a simple test in the Supabase SQL Editor:

```sql
-- Test basic connection
SELECT * FROM body_parts LIMIT 1;

-- Test exercise categories
SELECT * FROM exercise_categories LIMIT 5;

-- Test workout sessions
SELECT * FROM workout_sessions LIMIT 5;
```

## 🚨 **Common Error Messages & Solutions**

### "Missing Supabase environment variables"
- **Solution**: Create `.env.local` file with your credentials

### "Network Error" or "Failed to fetch"
- **Solution**: Check your internet connection and Supabase project status

### "JWT expired" or "Invalid JWT"
- **Solution**: Check if your anon key is correct and not expired

### "Table doesn't exist"
- **Solution**: Run the database schema SQL in Supabase

### "Permission denied"
- **Solution**: Check RLS policies or temporarily disable RLS for testing

## 🔧 **Manual Database Test**

You can test the database connection manually by running this in your browser console:

```javascript
// Test if Supabase is accessible
fetch('https://your-project-id.supabase.co/rest/v1/body_parts?select=*&limit=1', {
  headers: {
    'apikey': 'your-anon-key',
    'Authorization': 'Bearer your-anon-key'
  }
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));
```

## 📱 **Environment File Location**

Make sure your `.env.local` file is in the correct location:
```
PROJECTS/WORKOUT APP/
├── .env.local          ← Create this file here
├── src/
├── package.json
└── ...
```

## 🔄 **After Fixing Environment Variables**

1. **Stop your development server** (Ctrl+C)
2. **Restart the server**: `npm run dev`
3. **Clear browser cache** and refresh the page
4. **Test the connection** again with the "Test DB Connection" button

## 📞 **Still Having Issues?**

If you're still experiencing problems:

1. **Check Supabase project status** at [status.supabase.com](https://status.supabase.com)
2. **Verify your project is active** in the Supabase dashboard
3. **Check your billing status** (free tier has limitations)
4. **Review the Supabase logs** in your project dashboard

## 🎯 **Expected Behavior After Fix**

Once everything is working correctly:

- ✅ "Test DB Connection" button shows success message
- ✅ Exercise dropdown loads with 50+ exercises
- ✅ You can add workouts and exercises
- ✅ "Save" button appears for unsaved workouts
- ✅ Workouts are saved to the database
- ✅ "Saved" indicator appears after successful save
- ✅ Console shows "Workout saved successfully" messages 