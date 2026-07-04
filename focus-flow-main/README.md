# 🔥 Bornfire 2.0

Bornfire is a high-performance, Neo-Brutalist productivity dashboard designed for students and developers. It features gamified tasks, league rankings, and unique player IDs for collaboration.

## 📂 Project Structure

```text
bornfire/
├── 💻 frontend/      # Vite + React + Tailwind (The UI)
├── ⚙️ backend/       # Docker + SQL + Supabase (The Data)
└── README.md         # This file
```

## 🚀 Quick Start

To get the full system running:

1. **Setup Database**: Head to `/backend` to start Docker or configure Supabase.
2. **Setup UI**: Head to `/frontend` to install dependencies and start the dev server.

## 🤝 Collaborating with Friends

1. Clone this repository.
2. Follow the instructions in [frontend/README.md](./frontend/README.md) to set up your `.env`.
3. Follow the instructions in [backend/README.md](./backend/README.md) to sync the database.

---

## 💾 Database Integration

### Database Choice: Supabase (PostgreSQL)
We chose **Supabase** as our database provider for this project because:
- **Built-in Auth**: It securely integrates authentication out-of-the-box, allowing secure, seamless sign-ins.
- **Real-time Capabilities**: Easy access to real-time sync when friends complete tasks.
- **PostgreSQL Power**: Under the hood, it gives us robust relational features, strong consistency, and performance we can rely on using standard SQL or Prisma.
- **All 6+ API endpoints** in this project are already connected and fully reading/writing to this live database!

### Schema Diagram
![Database Schema Diagram](frontend/public/databasepic.png)

### Set up the database
To set up the database locally and link it to your project:
1. Make sure you have created your Supabase project (Dashboard URL: `https://supabase.com/dashboard/project/hthdcmbgiolpvcxduvni`).
2. Copy the `.env.example` to `.env` in the root folder.
3. Update the `DATABASE_URL` in your `.env` with your actual Postgres connection string (e.g. `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`).
4. If using Prisma, run `npx prisma generate` and `npx prisma db push` to push the schema defined in `schema.prisma`. Or manually run `backend/schema.sql` via Supabase SQL Editor.

---

**Built with Neo-Brutalism & Grit.**
