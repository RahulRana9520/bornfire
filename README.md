# 🔥 Bornfire 2.0

Bornfire is a high-performance, Neo-Brutalist productivity dashboard designed for students and developers. It features gamified tasks, league rankings, and unique player IDs for collaboration.

---

## 💻 Frontend Setup (Vite + React + Tailwind)

This is the user interface for Bornfire, following a **Neo-Brutalist** design system with bold borders and vibrant colors.

### 🛠️ Configuration

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in the `frontend` folder and add your Supabase keys:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_key
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

### 🎨 Design System
We use a custom Neo-Brutalist style defined in `frontend/src/index.css`.
- **Borders**: `4px solid black`
- **Shadows**: Hard offsets `4px 4px 0px 0px #000`
- **Colors**: Cyber Yellow, Neon Pink, Electric Teal.

---

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

## 🤝 Collaborating with Friends

1. Clone this repository.
2. Follow the instructions above to set up your `.env` in the frontend.
3. Set up your database following the backend instructions.

---

**Built with Neo-Brutalism & Grit.**
