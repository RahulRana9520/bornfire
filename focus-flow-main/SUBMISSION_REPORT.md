# 📋 Project Submission & Internship Report

## 1. Project & Intern Information
- **Project Title:** Bornfire (Focus Flow)
- **Intern ID:** `[Your Intern ID - e.g., INT_12345]`
- **Name:** `[Your Name - e.g., Rahul Rana]`
- **University Name:** `[Your University Name]`

---

## 2. The Problem We Are Solving
Many students and job seekers face major hurdles when preparing for placements:
- **Consistency & Motivation Drop:** Without clear feedback and tracking, users lose motivation. Bornfire solves this using **gamified habits, XP leveling, and streak counts**.
- **Lack of Structured Roadmap:** Generic study templates do not fit individual needs. Bornfire uses **AI-powered personalization** to generate structured, day-by-day roadmaps based on user profile inputs (weak areas, target companies, timelines).
- **Tool Fragmentation:** Tracking tasks, habit consistency, placement preps, and squad progress are usually done across separate apps. Bornfire **consolidates them into a single, cohesive productivity platform**.

---

## 3. Tech Stack Selected & Rationale

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend** | React, Vite, TypeScript, Tailwind CSS | **Vite** offers instant HMR and quick builds. **TypeScript** provides type safety, especially when handling strict AI-generated JSON outputs. **Tailwind CSS** ensures rapid development of high-quality UI components. |
| **Backend** | Node.js, Express | Event-driven, non-blocking asynchronous architecture that handles requests efficiently and allows quick API development. |
| **Database** | Supabase (PostgreSQL) | Chosen for its robust relational schema integrity. Features like foreign key cascading and custom indexing guarantee data safety, high performance, and rapid authorization integration. |
| **AI Engine** | Google Gemini API (JSON Mode) | Provides state-of-the-art natural language processing. Using structured JSON mode ensures the AI outputs perfectly conform to typescript models on the client side. |

---

## 4. Frontend Screenshots & Live Link
- **Live Website Link:** `[Insert Live URL - e.g., https://bornfire-frontend.vercel.app]`

### 🎯 Placement Prep Customization
*Configure preparation timelines, daily hours, target companies, and highlight weak areas.*
![Placement Setup Dashboard](frontend/public/placement1.png)

### 🗺️ Generated AI Roadmap & Task Checklist
*Interactive roadmap with daily goals, estimated study times, and XP rewards.*
![Generated Placement Roadmap](frontend/public/placement2.png)

### 📊 Daily Progress & Trophy Room
*Visualize weekly consistency charts, level progression, and unlock achievements/badges.*
![Daily Progress Dashboard](frontend/public/Progress.png)

---

## 5. Backend: Best APIs & Working

### API 1: Task Completion & XP Awarding (`PATCH /api/tasks/:id/complete`)
- **How it works:** 
  1. Validates the JWT auth token to identify the logged-in user.
  2. Queries the database to verify if the task belongs to the user and isn't already completed.
  3. Updates the task status to `completed = true`.
  4. Fetches the user's profile, increments their XP by `20 XP`, and updates the user table.
  5. Returns the updated XP and success status in a single transaction.

### API 2: Daily Check-In & Streak Tracker (`POST /api/users/checkin`)
- **How it works:**
  1. Identifies the user, queries the last check-in date from their profile.
  2. Compares the last check-in date with the current server date (timezone-safe comparison).
  3. If already checked in today, it returns a status message.
  4. Otherwise, it increments the streak counter by 1, updates the `longest_streak` if broken, and saves the new check-in date.

---

## 6. Database Selection & Schema

### Why Supabase/PostgreSQL?
A relational database is selected because the data model relies heavily on relationships: Users own Profiles, Profiles have Tasks/Habits, Habits track Completions, and Users earn Badges. Relational constraints (such as `ON DELETE CASCADE`) guarantee data consistency across tables when an account is deleted.

### Database Schema Overview
```sql
-- Profiles (Extends User information)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    league TEXT DEFAULT 'bronze',
    streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    total_focus_time INTEGER DEFAULT 0,
    completed_tasks_count INTEGER DEFAULT 0,
    last_checkin_date DATE
);

-- Tasks
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    time_spent INTEGER DEFAULT 0,
    estimated_time INTEGER,
    priority TEXT DEFAULT 'medium',
    xp_reward INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 7. AI Feature & LLM Implementation
- **LLM Used:** Google Gemini API
- **Use Case:** Personalized placement roadmaps.
- **Workflow:** When a student creates a plan, their profile variables (timeline, hours, level, weak areas) are injected into a strict instruction prompt template. The model returns a structured JSON roadmap containing days, titles, and individual task checklists with duration estimates and XP values, parsed directly by the React frontend.

---

## 8. Hosting & Deployment Services
- **Frontend Hosting:** Vercel (for high-speed global edge distribution and CD/CI pipeline)
- **Backend Hosting:** Vercel Serverless / Render (for Node.js Express environment)
- **Database Hosting:** Supabase (PostgreSQL hosting with built-in connection pool)

---

## 9. Live URLs
- **Frontend Live URL:** `[Insert URL]`
- **Backend Live URL:** `[Insert URL]`
- **GitHub Repository URL:** `[Insert URL]`

---

## 10. Reflection on the Internship
During this internship, I gained hands-on experience in building modern, AI-integrated SaaS products:
- **Full-Stack Competency:** Improved skills in React, Vite, Tailwind CSS, Express, and PostgreSQL.
- **AI Integrations:** Learned how to safely structure LLM outputs using schema-enforced prompt engineering.
- **Database Management:** Gained proficiency in designing clean relational schemas and cascading triggers.
- **Experience:** The internship provided a fast-paced environment to build features end-to-end, mimicking production grade software workflows.
