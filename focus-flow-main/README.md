# 🔥 Bornfire (Focus Flow)

Bornfire (also known as Focus Flow) is a premium, gamified personal productivity and placement preparation assistant designed to help students and professionals structure their studies, track their focus, and achieve their career goals.

With features ranging from daily productivity tracking to AI-powered personalized preparation roadmaps, Bornfire is your smart companion on the journey to landing your dream job.

---

## 🚀 Key Features

### 1. 🎯 AI-Powered Placement Prep
Bornfire includes an intelligent preparation roadmap generator. Users can set their target companies, define their preparation timeline, specify daily study hours, and select focus or weak areas. The system dynamically generates an actionable day-by-day study roadmap tailored to their profile.

#### Setup & Customization
Configure your preparation timeline, daily hours, and target companies (e.g., Google, Amazon, Infosys). Identify focus topics (DSA, Aptitude, Projects, System Design) and tag weak areas to personalize the level of preparation.

![Placement Setup Dashboard](frontend/public/placement1.png)

#### Personalized Actionable Roadmaps
Once generated, the system creates a structured, day-by-day checklist. Each day has a target theme, categorized tasks (DSA, HR Interview, etc.), estimated completion time, and XP rewards.

![Generated Placement Roadmap](frontend/public/placement2.png)

---

### 2. 📊 Daily Productivity & Progress Tracking
Track your productivity, consistency, and growth over time with our gamified dashboard. 

#### Analytics & Gamification
- **XP & Levels:** Earn XP by completing tasks and level up your profile.
- **Weekly Outputs:** Visualize your weekly consistency and daily focus percentage.
- **Trophy Room:** Unlock achievements and badges (e.g., 3-Day Streak, 7-Day Streak, Early Bird, 50 Hours Focus) to stay motivated.

![Daily Progress Dashboard](frontend/public/Progress.png)

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
