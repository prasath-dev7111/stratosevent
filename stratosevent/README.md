# StratosEvent — Event Management & Registration Platform

Enterprise-grade event management system built with HTML/CSS/JS, Node.js, Express, and MongoDB.

---

## 📁 Project Structure

```
stratosevent/
├── backend/
│   ├── config/db.js          → MongoDB connection
│   ├── middleware/auth.js     → JWT authentication
│   ├── models/               → User, Event, Registration schemas
│   ├── routes/               → auth, events, registrations APIs
│   ├── seed.js               → Demo data seeder
│   ├── server.js             → Main Express server
│   └── .env                  → Environment variables
└── frontend/
    ├── css/style.css          → Full UI stylesheet
    ├── js/utils.js            → Shared utilities
    ├── js/main.js             → Home page logic
    ├── index.html             → Event listing (home page)
    └── pages/
        ├── login.html         → Login page
        ├── register.html      → Registration page
        ├── event-detail.html  → Event detail + ticket selection
        ├── my-registrations.html → User's registrations
        └── admin.html         → Full admin dashboard
```

---

## ⚡ Quick Setup (5 Steps)

### Step 1 — Open in VS Code
```
File → Open Folder → Select the "stratosevent" folder
```

### Step 2 — Install dependencies
Open the VS Code terminal (Ctrl + `) and run:
```bash
cd backend
npm install
```

### Step 3 — Start MongoDB
Make sure MongoDB Compass is running locally, then verify the service:
```bash
net start MongoDB
```
Your `.env` is already configured for local MongoDB:
```
MONGO_URI=mongodb://localhost:27017/stratosevent
```

### Step 4 — Seed demo data
```bash
cd backend
node seed.js
```
This creates 4 events, 3 users, and 5 sample registrations.

### Step 5 — Start the server
```bash
npm run dev
```
Open your browser: **http://localhost:5000**

---

## 🔑 Demo Login Credentials

| Role  | Email                  | Password   |
|-------|------------------------|------------|
| Admin | admin@stratos.com      | Admin@2026 |
| User  | user@stratos.com       | User@2026  |
| User  | ananya@stratos.com     | User@2026  |

---

## 🌐 Pages

| URL                              | Description              |
|----------------------------------|--------------------------|
| http://localhost:5000            | Home — Event Listing     |
| http://localhost:5000/pages/login.html | Login              |
| http://localhost:5000/pages/register.html | Register        |
| http://localhost:5000/pages/admin.html | Admin Dashboard    |
| http://localhost:5000/pages/my-registrations.html | My Tickets |

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint              | Description     |
|--------|-----------------------|-----------------|
| POST   | /api/auth/register    | Create account  |
| POST   | /api/auth/login       | Login           |
| GET    | /api/auth/me          | Get current user|

### Events
| Method | Endpoint              | Auth     | Description         |
|--------|-----------------------|----------|---------------------|
| GET    | /api/events           | None     | List all events     |
| GET    | /api/events/all       | Admin    | All events (admin)  |
| GET    | /api/events/:id       | None     | Single event        |
| POST   | /api/events           | Admin    | Create event        |
| PUT    | /api/events/:id       | Admin    | Update event        |
| DELETE | /api/events/:id       | Admin    | Delete event        |

### Registrations
| Method | Endpoint                           | Auth  | Description            |
|--------|------------------------------------|-------|------------------------|
| POST   | /api/registrations                 | User  | Register for event     |
| GET    | /api/registrations/my              | User  | My registrations       |
| GET    | /api/registrations/event/:id       | Admin | Event's registrations  |
| GET    | /api/registrations/analytics/:id   | Admin | Event analytics        |
| GET    | /api/registrations/admin/all       | Admin | All registrations      |
| PUT    | /api/registrations/:id/approve     | Admin | Approve registration   |
| PUT    | /api/registrations/:id/reject      | Admin | Reject registration    |
| PUT    | /api/registrations/:id/checkin     | Admin | Mark attendance        |

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JS (no frameworks)
- **Backend**: Node.js 18+, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Auth**: JWT (jsonwebtoken) + bcryptjs
- **Dev**: Nodemon for hot reload

---

## 🚀 Features

- ✅ Event creation with multiple ticket tiers
- ✅ User registration with JWT authentication
- ✅ Role-based access (Admin / Participant)
- ✅ Invite-only events with approval workflow
- ✅ Real-time admin dashboard with analytics
- ✅ Attendee check-in with unique tokens
- ✅ Registration status tracking (pending/approved/rejected)
- ✅ Search and category filtering
- ✅ Responsive design for mobile & desktop
