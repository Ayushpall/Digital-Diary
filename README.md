# 📖 Digital Diary

> A modern private journaling and personal productivity platform that combines digital convenience with the feeling of a traditional handwritten diary.

Digital Diary is a full-stack web application designed for people who want to capture their thoughts, memories, habits, and study plans in one personal digital space.

Unlike a traditional notes application, Digital Diary focuses on creating a realistic diary experience. Users can write digitally, customize the appearance of their writing, organize entries, search memories, track habits, and manage study activities.

---

## ✨ Features

### 📖 Digital Journaling
- Create and manage personal diaries
- Write and edit diary entries
- Organize entries by date
- Realistic diary-style reading experience
- Automatic saving and persistent storage

### ✍️ Handwriting Experience
- Convert typed text into handwriting-style presentation
- Multiple handwriting fonts
- Text formatting
- Bold, italic, and underline support
- Text alignment
- Ink/color customization
- Diary page preview

### 📅 Memory Calendar
Browse diary entries through a calendar interface and revisit memories based on when they were written.

### 🔍 Search
Search through previous diary entries and quickly rediscover thoughts and memories.

### 🔥 Habit Tracker
- Create personal habits
- Track daily progress
- Record habit completions
- Monitor streaks
- View progress statistics

### 🎓 Study Planner
- Create subjects
- Add assignments, exams, projects, and revision tasks
- Set deadlines and priorities
- Track task status
- Schedule study sessions
- Organize academic activities

### 📊 Personal Dashboard
A central dashboard displaying diaries, recent entries, statistics, quick actions, and productivity tools.

### 🔐 Private Authentication
Secure authentication and user-specific data isolation powered by Clerk.

Every user's diaries, entries, habits, and study information are associated with their authenticated account.

---

## 🚀 Vision

Digital Diary is being developed beyond a simple journaling application.

The long-term goal is to build a **Personal Memory Platform** where users can securely capture and rediscover their life experiences.

Future directions include:

- 🎙️ Voice diary
- 🧠 AI-powered memory search
- 🔎 Semantic search
- ✨ AI-assisted reflection
- 📸 Media memories
- 📈 Advanced personal insights
- 🔔 Smart reminders
- 📱 Improved mobile/PWA experience
- ☁️ Secure cloud media storage

The goal is simple:

> **Write today. Remember forever.**

---

## 🛠️ Tech Stack

### Frontend
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide Icons

### Backend
- Next.js App Router
- Next.js API Routes
- Prisma ORM

### Database
- PostgreSQL
- Neon

### Authentication
- Clerk

### Infrastructure
- Vercel
- Cloudflare
- Cloudflare R2

---

## 🏗️ Architecture

```text
User
 │
 ▼
Next.js / React
 │
 ├── Dashboard
 ├── Diary
 ├── Editor
 ├── Handwriting View
 ├── Calendar
 ├── Search
 ├── Habit Tracker
 └── Study Planner
 │
 ▼
Next.js API Routes
 │
 ├── Clerk Authentication
 │
 ▼
Prisma ORM
 │
 ▼
Neon PostgreSQL

Media Storage
     │
     ▼
Cloudflare R2
```

---

## 📂 Main Application Routes

```text
/
├── /dashboard
├── /diary/demo
├── /editor/demo
├── /handwriting/demo
├── /calendar
├── /search
├── /features
│   ├── /habits
│   └── /study-planner
├── /sign-in
└── /sign-up
```

API routes include:

```text
/api/auth
/api/diaries
/api/entries
/api/stats
/api/habits
/api/study/subjects
/api/study/tasks
/api/study/sessions
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd Digital-Diary
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create:

```text
.env.local
```

Configure the environment variables required by your installation, such as:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
DATABASE_URL=
```

Never commit `.env` or `.env.local` files containing real credentials.

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Configure the database

Use the migration/deployment workflow appropriate for your environment.

For an existing production database, review migrations carefully before applying schema changes.

### 6. Start development

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### 7. Production build

```bash
npm run build
npm start
```

---

## 🔒 Privacy & Security

Digital Diary is designed around private personal information.

The application follows principles such as:

- Authenticated user access
- User-level data isolation
- Server-side authentication
- Server-side secrets
- Input validation
- Secure database access
- Environment-based configuration
- API authorization
- Error handling

Secrets such as database credentials and Clerk secret keys must never be exposed to the client or committed to Git.

---

## ⚡ Performance

The application has been optimized using techniques such as:

- Next.js image optimization
- Lazy loading
- Dynamic imports where appropriate
- Code splitting
- Stable loading states
- Reduced layout shifts
- Responsive image delivery
- Browser caching
- Dead-code reduction

Recent local Lighthouse testing achieved:

- **LCP:** 0.9s
- **CLS:** 0
- **Total Blocking Time:** 0ms
- **Speed Index:** 0.5s
- **SEO:** 100

> Lighthouse results depend on the device, network conditions, environment, and application version.

---

## 🗺️ Roadmap

### Current
- [x] Authentication
- [x] Personal dashboard
- [x] Diary management
- [x] Diary editor
- [x] Handwriting presentation
- [x] Calendar
- [x] Search
- [x] Habit tracker
- [x] Study planner
- [x] Responsive interface
- [x] Performance optimization

### Next
- [ ] Production security hardening
- [ ] User onboarding
- [ ] Product analytics
- [ ] Feedback system
- [ ] Notifications/reminders
- [ ] Subscription system
- [ ] Voice diary
- [ ] AI memory search
- [ ] Advanced analytics
- [ ] PWA/mobile improvements

---

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome.

If you would like to contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the application
5. Submit a pull request

Please avoid committing credentials, `.env` files, generated build files, or private user information.

---

## 📄 License

Add the project's chosen license here before public distribution.

---

## 👨‍💻 Author

**Ayush Pal**

B.Tech Computer Science & Engineering — AI & ML

Building Digital Diary as a modern platform for journaling, productivity, and personal memories.

---

## ⭐ Support

If you find Digital Diary interesting, consider starring the repository.

Feedback and contributions are always welcome.
