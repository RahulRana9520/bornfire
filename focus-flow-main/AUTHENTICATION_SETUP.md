# Authentication Setup Instructions

## Supabase Configuration

This application uses Supabase for authentication and database. Follow these steps to set it up:

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details
5. Wait for the database to be provisioned

### 2. Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** > **API**
2. Copy the following:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### 3. Create Environment File

1. Copy `.env.example` to `.env` in the `focus-flow-main` directory:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 4. Create Database Tables

Run these SQL commands in your Supabase SQL Editor (**SQL Editor** in the left sidebar):

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  username TEXT NOT NULL,
  avatar_url TEXT,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  league TEXT DEFAULT 'bronze' CHECK (league IN ('bronze', 'silver', 'gold', 'platinum', 'diamond')),
  streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_checkin_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  time_spent INTEGER DEFAULT 0,
  estimated_time INTEGER,
  remaining_time INTEGER,
  is_timer_running BOOLEAN DEFAULT FALSE,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  xp_reward INTEGER DEFAULT 20,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);
CREATE INDEX idx_tasks_completed ON tasks(completed);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create policies for tasks table
CREATE POLICY "Users can view own tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tasks"
  ON tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
  ON tasks FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 5. Configure Authentication Providers

#### Enable Email Authentication:
1. Go to **Authentication** > **Providers**
2. Enable **Email** provider
3. Configure email templates if desired

#### Enable Google Authentication:
1. Go to **Authentication** > **Providers**
2. Click on **Google**
3. Follow the instructions to create OAuth credentials in Google Cloud Console
4. Add your **Client ID** and **Client Secret**
5. Add authorized redirect URLs

#### Enable GitHub Authentication:
1. Go to **Authentication** > **Providers**  
2. Click on **GitHub**
3. Create a new OAuth App in your GitHub settings
4. Add the callback URL provided by Supabase
5. Add your **Client ID** and **Client Secret**

### 6. Update Site URL (for OAuth)

1. Go to **Authentication** > **URL Configuration**
2. Add your development URL: `http://localhost:8080`
3. Add your production URL when deploying (e.g., your Vercel URL)

### 7. Run the Application

```bash
npm run dev
```

## Features Implemented

✅ **Authentication System**
- Email/Password sign up and sign in
- Google OAuth
- GitHub OAuth
- Delayed sign-in prompt (1-2 days after first visit)
- Guest mode with local storage

✅ **XP System**
- 20 XP per completed task
- Level 1 requires 500 XP
- Each level doubles the XP requirement (500, 1000, 2000, 4000, etc.)
- New users start at Level 1 with 0 XP

✅ **Streak System**
- Daily check-in popup for logged-in users
- Streak maintained by completing at least one task per day
- Tracks current streak and longest streak
- Visual streak counter with fire icon

✅ **Cross-Device Sync**
- All progress syncs across devices when signed in
- Tasks, XP, level, and streaks stored in Supabase
- Real-time updates when data changes

✅ **Daily Progress**
- Total focus time only counts TODAY's completed tasks
- Tasks completed counter resets daily
- Stats specific to current day only

## Guest Mode vs Signed In

**Guest Mode:**
- Data stored in browser localStorage
- No cross-device sync
- Data may be lost if browser cache is cleared

**Signed In:**
- Data stored in Supabase database
- Syncs across all devices
- Persistent and secure
- Access to streak system and leaderboards

## Troubleshooting

**"Cannot find package '@supabase/supabase-js'"**
- Run: `npm install`

**Authentication not working:**
- Check your `.env` file has correct Supabase URL and key
- Verify OAuth providers are configured in Supabase dashboard
- Check redirect URLs match your application URL

**Database errors:**
- Ensure all SQL commands ran successfully
- Check Row Level Security policies are created
- Verify user is authenticated before accessing database

**Streak not updating:**
- User must be signed in
- At least one task must be completed today
- Check browser console for errors
