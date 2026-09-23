# NoteNest - MERN Full-Stack Notes Application

A full-stack note-taking platform built with MongoDB, Express.js, React (Vite), and Node.js.

## Project Structure

```
notes-app/
├── backend/                  # Node.js & Express API
│   ├── .env                  # Environment configuration (Mongo URI, JWT Secret)
│   ├── .env.example
│   ├── server.js             # Main server entry point
│   ├── package.json
│   └── src/
│       ├── config/           # Database (Mongoose) & Passport.js configurations
│       ├── controllers/      # Auth & Note controller logic
│       ├── models/           # User & Note Mongoose schemas
│       ├── routes/           # API routes (/api/auth & /api/notes)
│       └── middlewares/      # Passport JWT guard & centralized error handling
│
├── frontend/                 # Vite + React Client
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── api/              # Axios instance with JWT interceptors
│       ├── context/          # React Context API (AuthContext, NotesContext)
│       ├── components/       # UI Components (Navbar, Sidebar, NoteCard, NoteModal, ProtectedRoute)
│       ├── pages/            # View Pages (LoginPage, RegisterPage, DashboardPage, NotFoundPage)
│       └── styles/           # Modern CSS design system & glassmorphism styling
```

## Features

- **Separate Frontend & Backend Folders**: Completely decoupled client and API architectures.
- **Passport.js Authentication & Authorization**:
  - `passport-local` for credential verification with bcrypt password hashing.
  - `passport-jwt` for stateless API endpoint protection and token validation.
- **Axios HTTP Client**:
  - Global axios instance configured with request and response interceptors.
  - Automatic injection of `Authorization: Bearer <token>`.
  - Automatic handling of 401 session expirations.
- **React Router DOM (v6)**:
  - Client-side navigation with protected route guards (`ProtectedRoute`).
  - Seamless redirection from unauthenticated views to login and back.
- **React Context API & Hooks**:
  - Clear and descriptive state: `currentUser`, `authToken`, `isAuthChecking`, `notesList`, `isLoadingNotes`, `searchKeyword`, `selectedFilterTag`, `isPinnedFilterActive`.
- **Note Management Capabilities**:
  - Create, read, update, delete (CRUD) personal notes.
  - Fast search by title, content, or tag.
  - Pin and unpin notes to keep them at the top.
  - Custom color-accent picker for visually distinct cards.
  - Tagging system with dynamic sidebar filters.

## Getting Started

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Check `backend/.env`. If you are using a **MongoDB Atlas Cloud Cluster**, replace `MONGO_URI` with your connection string:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/notes_app?retryWrites=true&w=majority
   ```
   If using local MongoDB, ensure your local MongoDB service is running:
   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/notes_app
   ```
3. Start the backend development server:
   ```bash
   npm run dev
   # or
   npm start
   ```
   The backend API will run on `http://localhost:5000`.

### 2. Frontend Setup

1. In a separate terminal, navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open your browser at:
   ```
   http://localhost:5173
   ```
