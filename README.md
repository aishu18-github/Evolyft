<h1 align="center">
  <br />
  <img salt="Evolyft" width="80" />
  <br />
  Evolyft
  <br />
</h1>

<h4 align="center">A personal developer growth platform to track learning, build roadmaps, and stay consistent.</h4>

<p align="center">
  <a href="https://nextjs.org/">
    <img src="https://img.shields.io/badge/Next.js-15.1-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  </a>
  <a href="https://www.prisma.io/">
    <img src="https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  </a>
  <a href="https://www.postgresql.org/">
    <img src="https://img.shields.io/badge/PostgreSQL-blue?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  </a>
  <a href="https://next-auth.js.org/">
    <img src="https://img.shields.io/badge/NextAuth.js-v5-purple?style=for-the-badge&logo=auth0&logoColor=white" alt="NextAuth" />
  </a>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-project-structure">Project Structure</a> •
  <a href="#-environment-variables">Environment Variables</a> •
  <a href="#-running-tests">Running Tests</a>
</p>

---

## ✨ Features

- 🗺️ **Learning Roadmaps** — Create structured roadmaps with milestones, categories, and target dates. Track status from `NOT_STARTED` → `IN_PROGRESS` → `COMPLETED`.
- ⏱️ **Study Session Tracker** — Log focused study sessions with subject, topic, duration, productivity rating, and difficulty level.
- 🔥 **Streak System** — Stay motivated with a daily streak tracker showing your current and longest streaks.
- 📚 **Resource Bookmarks** — Save and organize articles, videos, docs, and notes with tags and favorites.
- 📊 **Analytics Dashboard** — Visualize your weekly study habits with interactive area charts powered by Recharts.
- 🕒 **Activity Timeline** — A live feed of all your learning actions — roadmap creations, milestone completions, session logs, and more.
- 🔐 **Authentication** — Secure credential-based auth with NextAuth.js v5, bcrypt password hashing, and protected routes via middleware.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) |
| **Database ORM** | [Prisma 5](https://www.prisma.io/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) |
| **Auth** | [NextAuth.js v5](https://next-auth.js.org/) |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) |
| **Charts** | [Recharts](https://recharts.org/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Testing** | [Jest](https://jestjs.io/) + [Testing Library](https://testing-library.com/) |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [PostgreSQL](https://www.postgresql.org/) running locally or a hosted instance

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/evolyft.git
cd evolyft
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Then fill in your values in `.env` (see [Environment Variables](#-environment-variables)).

### 4. Set up the database

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
evolyft/
├── app/
│   ├── (dashboard)/         # Protected dashboard layout & pages
│   │   ├── dashboard/       # Home dashboard with stats & timeline
│   │   ├── roadmaps/        # Roadmap management
│   │   ├── tracker/         # Study session tracker
│   │   ├── resources/       # Resource bookmarks
│   │   ├── analytics/       # Analytics & charts
│   │   └── settings/        # User settings
│   ├── login/               # Login page
│   ├── register/            # Registration page
│   └── api/                 # API route handlers
├── actions/                 # Next.js server actions
├── components/
│   └── ui/                  # Reusable UI components
├── lib/                     # Utility functions & Prisma client
├── store/                   # Zustand global state stores
├── prisma/
│   └── schema.prisma        # Database schema
├── tests/                   # Jest test suites
├── auth.ts                  # NextAuth configuration
├── auth.config.ts           # Auth route protection config
└── middleware.ts             # Next.js middleware
```

---

## 🔑 Environment Variables

Copy `.env.example` to `.env` and fill in the following:

```env
# PostgreSQL connection string
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/evolyft?schema=public"

# NextAuth secret — generate with: openssl rand -base64 33
AUTH_SECRET="your-auth-secret-at-least-32-characters"
```

---

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage report
npm run test:coverage
```

---

## 🗄️ Database Schema Overview

```
User
 ├── StreakData      (1-to-1)
 ├── Roadmap[]       (1-to-many)
 │    └── Milestone[] (1-to-many)
 ├── StudySession[]  (1-to-many)
 ├── Resource[]      (1-to-many)
 └── ActivityLog[]   (1-to-many)
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">Built with ❤️ to make learning more intentional.</p>
