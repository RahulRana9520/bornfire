# ⚙️ Bornfire Backend

This folder contains the database configuration and infrastructure for Bornfire.

## 🛢️ Choosing your Database

You have two options for running the backend:

### **Option 1: Supabase Cloud (Recommended for Teams)**
*   Go to [Supabase.com](https://supabase.com).
*   Create a project and open the **SQL Editor**.
*   Run the code in `schema.sql` to set up the tables and permissions.
*   Get your URL/Keys and add them to your `frontend/.env`.

### **Option 2: Local Docker (Private Development)**
*   Run `docker-compose up -d` to start a local PostgreSQL instance.
*   Connect using **DBeaver** at `localhost:5435`.
*   Check `DBEAVER_GUIDE.md` for connection details.

## 📜 Database Schema

The `schema.sql` file includes:
- **`users`**: Stores XP, Level, League, and Unique IDs.
- **`tasks`**: Stores task titles, completion status, and time tracking.
- **RLS Policies**: Ensures users can only see their own private data.
