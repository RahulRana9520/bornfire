# 🔥 Bornfire (Focus Flow)

Bornfire (also known as Focus Flow) is a premium, gamified personal productivity and placement preparation assistant designed to help students and professionals structure their studies, track their focus, and achieve their career goals.

With features ranging from daily productivity tracking to AI-powered personalized preparation roadmaps, Bornfire is your smart companion on the journey to landing your dream job.

---

## 📺 Video Tutorial

Learn how to use Bornfire (Focus Flow) in this step-by-step video tutorial:
👉 **[Watch the Tutorial on YouTube](https://youtu.be/CHGjs06xR4E)**

---

## 🚀 Key Features

### 1. 🎯 AI-Powered Placement Prep
Bornfire includes an intelligent preparation roadmap generator. Users can set their target companies, define their preparation timeline, specify daily study hours, and select focus or weak areas. The system dynamically generates an actionable day-by-day study roadmap tailored to their profile.

#### Setup & Customization
Configure your preparation timeline, daily hours, and target companies (e.g., Google, Amazon, Infosys). Identify focus topics (DSA, Aptitude, Projects, System Design) and tag weak areas to personalize the level of preparation.

![Placement Setup Dashboard](./focus-flow-main/frontend/public/placement1.png)

#### Personalized Actionable Roadmaps
Once generated, the system creates a structured, day-by-day checklist. Each day has a target theme, categorized tasks (DSA, HR Interview, etc.), estimated completion time, and XP rewards.

![Generated Placement Roadmap](./focus-flow-main/frontend/public/placement2.png)

---

### 2. 📊 Daily Productivity & Progress Tracking
Track your productivity, consistency, and growth over time with our gamified dashboard. 

#### Analytics & Gamification
- **XP & Levels:** Earn XP by completing tasks and level up your profile.
- **Weekly Outputs:** Visualize your weekly consistency and daily focus percentage.
- **Trophy Room:** Unlock achievements and badges (e.g., 3-Day Streak, 7-Day Streak, Early Bird, 50 Hours Focus) to stay motivated.

![Daily Progress Dashboard](./focus-flow-main/frontend/public/Progress.png)

## ⚙️ Backend & Database Integration

This project uses **Supabase (PostgreSQL)** as our database provider.

### Why Supabase?
- **Built-in Auth**: It securely integrates authentication out-of-the-box, allowing secure, seamless sign-ins.
- **Real-time Capabilities**: Easy access to real-time sync when friends complete tasks.
- **PostgreSQL Power**: Under the hood, it gives us robust relational features, strong consistency, and performance we can rely on using standard SQL or Prisma.
- **All 6+ API endpoints** in this project are already connected and fully reading/writing to this live database!

### Schema Diagram
![Database Schema Diagram](./focus-flow-main/frontend/public/databasepic.png)

### Set up the database
To set up the database locally and link it to your project:
1. Make sure you have created your Supabase project (Dashboard URL: `https://supabase.com/dashboard/project/hthdcmbgiolpvcxduvni`).
2. Copy the `.env.example` to `.env` in the root folder.
3. Update the `DATABASE_URL` in your `.env` with your actual Postgres connection string (e.g. `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`).
4. If using Prisma, run `npx prisma generate` and `npx prisma db push` to push the schema defined in `schema.prisma`. 
5. *Alternatively*, open your Supabase **SQL Editor** and run the code in `backend/schema.sql` to set up the tables and permissions.

---

## 🛠️ Technology Stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, PostgreSQL
- **AI Integration:** Gemini API (Structured JSON Mode)
- **Database:** Supabase / PostgreSQL (with custom RPCs and migrations)

---

## 💻 Getting Started

### Prerequisites
- Node.js (v18+)
- Docker (optional, for running database locally)
- Bun (recommended package manager)

### Installation & Run

1. Clone the repository.
2. Install dependencies:
   ```bash
   # Install root dependencies and setup frontend/backend
   bun install
   ```
3. Start the application:
   ```bash
   # Start the development server
   npm run dev
   ```
4. Set up the local database using docker (if applicable):
   ```bash
   npm run docker:up
   ```
