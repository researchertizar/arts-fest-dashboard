# Arts Fest Dashboard 2025

A powerful, real-time, media-rich dashboard for managing and displaying Arts Fest scores and participants.

## Features

- **Admin Panel**: Manage events, teams, and participants. Activate events in real-time.
- **Judge Panel**: Real-time scoring interface for judges with search/filter capabilities.
- **Stage Panel**: Live display of on-stage participants with media support (images/videos).
- **Public Scoreboard**: High-impact leaderboard with animated updates and score distribution charts.
- **Real-time Sync**: All panels stay in sync using Socket.io.
- **Responsive**: Fully optimized for mobile, tablet, and desktop.

## Tech Stack

- **Frontend**: React 19, Vite, TailwindCSS, Recharts, Lucide Icons, Socket.io-client.
- **Backend**: Node.js, Express 5, Socket.io, SQLite3.
- **Auth**: JWT-based role authentication.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository.
2. Install dependencies for both backend and frontend:

```bash
# Backend
cd arts-dashboard-backend
npm install

# Frontend
cd ../arts-dashboard-frontend
npm install
```

### Configuration

Create a `.env` file in `arts-dashboard-backend`:

```env
ADMIN_PASSWORD=admin123
JUDGE_PASSWORD=judge123
PORT=5000
```

### Database Initialization & Seeding

```bash
cd arts-dashboard-backend
node src/database/init.js
node src/database/seed.js
```

### Running the Application

1. Start the Backend:
```bash
cd arts-dashboard-backend
npm start
```
(Note: You might need to add `"start": "node src/server.js"` to `package.json`)

2. Start the Frontend:
```bash
cd arts-dashboard-frontend
npm run dev
```

## Default Credentials

- **Admin**: Password `admin123`
- **Judge**: Password `judge123`

## License

MIT - Free to use and modify.
