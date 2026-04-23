# LMS Portal (MERN Stack)

A beginner-friendly **Learning Management System (LMS) Portal** built using the MERN stack. It has two roles:
- **Student**: browse courses, enroll with payment, watch lectures, track progress
- **Educator**: create courses, add lectures, manage course content

This project is designed for a 3rd year B.Tech level mini/major project and follows a simple 3-tier architecture:

**React Frontend → Express/Node Backend → MongoDB Database**

---

## Features

### Authentication
- JWT based register/login
- Password hashing with bcrypt
- Role-based authorization (student / educator)

### Student Features
- Browse all courses
- View course details
- Enroll in free courses
- Razorpay test payment for paid courses
- Watch embedded lecture videos
- Track progress
- View enrolled courses in dashboard
- Edit basic profile

### Educator Features
- Create new courses
- Add lectures with video URLs
- Delete own courses
- Manage created courses from dashboard
- View enrolled students API available on backend

### Dashboard
- Separate student and educator dashboard views

---

## Tech Stack

### Frontend
- React + Vite
- React Router DOM
- Axios
- Tailwind CSS
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT
- bcryptjs
- Razorpay SDK

---

## Project Structure

```bash
lms/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## Setup Instructions

## 1) Clone and open project
```bash
git clone <your-repo-url>
cd lms-portal
```

## 2) Backend setup
```bash
cd backend
npm install
cp .env.example .env
```

Update `.env` values:
- `MONGO_URI`
- `JWT_SECRET`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

Run backend:
```bash
npm run dev
```

Backend runs on: `http://localhost:5000`

## 3) Frontend setup
```bash
cd ../frontend
npm install
cp .env.example .env
```

Run frontend:
```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## Environment Variables

### backend/.env.example
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/lms_portal
JWT_SECRET=your_super_secret_key
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_test_secret
```

### frontend/.env.example
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
```

---

## API Routes (Important)

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `PUT /api/auth/profile`

### Courses
- `GET /api/courses`
- `GET /api/courses/:id`
- `POST /api/courses` (educator)
- `PUT /api/courses/:id` (educator)
- `DELETE /api/courses/:id` (educator)
- `POST /api/courses/:id/lectures` (educator)

### Enrollment + Payment
- `POST /api/enrollments/free-enroll`
- `POST /api/enrollments/create-order`
- `POST /api/enrollments/verify-payment`
- `GET /api/enrollments/my`
- `PUT /api/enrollments/progress`

---

## Notes for Razorpay Test Mode

1. Create Razorpay account and get **test key id/secret**.
2. Add keys in backend `.env` and key id in frontend `.env`.
3. Use Razorpay test cards/UPI in checkout popup.

---

## Screenshot Placeholders

- Home page: `docs/screenshots/home.png`
- Courses list: `docs/screenshots/courses.png`
- Student dashboard: `docs/screenshots/student-dashboard.png`
- Educator dashboard: `docs/screenshots/educator-dashboard.png`
- Video player: `docs/screenshots/video-player.png`

---

## Future Improvements
- Add better video progress tracking per lecture
- Add educator analytics
- Add profile photo uploads
- Add quiz and assignment modules

