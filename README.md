# 🇳🇬 NSA Linktree — Nigerian Student Association

A dynamic, Firebase-powered Linktree-style web app for your organization.

## Features
- 🌐 **Public Linktree page** — beautiful landing with links, events, and social buttons
- 🔐 **Admin dashboard** — protected by Firebase Auth
- ➕ **Dynamic links** — add/edit/delete links without touching code
- 📅 **Dynamic events** — manage upcoming events with full details
- 📊 **Analytics** — click tracking per link, shown in dashboard
- ✏️ **Profile editor** — change org name, bio, social URLs from the dashboard

---

## 🚀 Setup & Deployment

### Step 1 — Install dependencies
```bash
npm install
```

### Step 2 — Create a Firebase project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add Project** → give it a name (e.g. `nsa-linktree`)
3. Once created, click the **Web** icon (`</>`) to add a web app
4. Copy the `firebaseConfig` values — you'll need them next

### Step 3 — Enable Firebase services

In the Firebase Console:

**Authentication:**
- Go to **Build → Authentication → Get Started**
- Enable **Email/Password** sign-in method
- Go to **Users** tab → **Add User** → create your admin email + password

**Firestore Database:**
- Go to **Build → Firestore Database → Create Database**
- Start in **Production mode**
- Choose your region (us-east1 recommended)
- After creation, go to **Rules** tab and paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public: read links, events, settings
    match /links/{doc} { allow read; allow write: if request.auth != null; }
    match /events/{doc} { allow read; allow write: if request.auth != null; }
    match /settings/{doc} { allow read; allow write: if request.auth != null; }
  }
}
```

### Step 4 — Configure environment variables

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your Firebase values:
```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc123
```

### Step 5 — Run locally
```bash
npm run dev
```

Visit `http://localhost:5173` for the public page.
Visit `http://localhost:5173/admin` to manage your content.

---

## 🌐 Deploy to Vercel

### Option A — Vercel CLI (fastest)
```bash
npm install -g vercel
vercel
```

During setup:
- Framework: **Vite**
- Build command: `npm run build`
- Output directory: `dist`

Then add your env vars in Vercel Dashboard → Settings → Environment Variables.

### Option B — GitHub + Vercel (recommended)

1. Push this project to a GitHub repo
2. Go to [https://vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repo
4. Framework: **Vite** (auto-detected)
5. Go to **Environment Variables** and add all 6 `VITE_FIREBASE_*` variables
6. Click **Deploy** 🚀

Your site will be live at `https://your-project.vercel.app`

---

## 📁 Project Structure

```
src/
├── context/
│   └── AuthContext.jsx     # Firebase Auth state
├── hooks/
│   ├── useLinks.js         # Firestore CRUD for links
│   ├── useEvents.js        # Firestore CRUD for events
│   └── useProfile.js       # Org profile settings
├── components/
│   ├── LinkCard.jsx        # Public link card
│   ├── EventCard.jsx       # Public event card
│   └── ProtectedRoute.jsx  # Auth guard
├── pages/
│   ├── Home.jsx            # Public linktree page
│   ├── Login.jsx           # Admin login
│   └── Admin.jsx           # Admin dashboard
├── firebase.js             # Firebase initialization
└── main.jsx
```

---

## ✏️ Admin Usage

1. Visit `/admin` (or `/admin/login` to sign in)
2. **Links tab** — Add links with emoji icons, titles, subtitles, URLs, and sort order
3. **Events tab** — Add events with date, time, location, price, RSVP URL
4. **Analytics tab** — See click counts for every link
5. **Profile tab** — Update org name, bio, and all social media links

Changes appear on the public page **instantly** (Firestore real-time).
