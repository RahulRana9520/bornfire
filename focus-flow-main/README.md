# FocusFlow

## Productivity & Task Management Application

FocusFlow is a comprehensive productivity app that helps you track tasks, build habits, and boost your daily focus time.

## Features

- ✅ **Task Management** - Create, track, and complete daily tasks with priorities
- ⏱️ **Time Tracking** - Built-in timer to track focus time on each task
- 🎯 **Daily Habits** - Track weekly habits and build consistency
- 📊 **Progress Analytics** - Visualize your productivity with charts and stats
- 🏆 **Gamification** - Earn XP, level up, and compete on leaderboards
- 🔥 **Streak Tracking** - Maintain daily streaks for motivation
- 👥 **Social Features** - Watch friends' progress and compete

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

Follow these steps:

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd focus-flow-main

# Step 3: Install the necessary dependencies
npm install

# Step 4: Start the development server
npm run dev
```

The app will be available at `http://localhost:8080` (or another port if 8080 is in use).

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
focus-flow-main/
├── src/
│   ├── components/     # React components
│   ├── contexts/       # Context providers
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   ├── pages/          # Page components
│   └── types/          # TypeScript types
├── public/             # Static assets
└── index.html          # Entry HTML
```

## Technologies Used

This project is built with:

- **Vite** - Fast build tool and dev server
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - High-quality UI components
- **Radix UI** - Accessible component primitives
- **Recharts** - Chart library

## Data Persistence

All your data (tasks, habits, progress) is stored locally in your browser's localStorage and persists across sessions.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
