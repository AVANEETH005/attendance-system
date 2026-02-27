# Online Attendance Monitoring System

A clean and simple attendance monitoring system built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- User authentication (Admin/Teacher roles)
- JWT-based authentication with password hashing
- Add, view, and delete students
- Mark attendance as present/absent
- View attendance records date-wise
- Check attendance by student
- Calculate attendance percentage

## Tech Stack

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: MongoDB (Atlas for production)
- **Authentication**: JWT and bcrypt for password hashing

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (for cloud database)
- npm or yarn

### Backend Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd attendance-system
```

2. Install backend dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/attendance-system?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
```

4. Run the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install frontend dependencies:
```bash
npm install
```

3. Create a `.env` file in the `frontend` directory (if needed):
```env
REACT_APP_API_URL=http://localhost:5000
```

4. Run the frontend development server:
```bash
npm start
```

## Deployment

### Backend Deployment (Render/Railway)

1. Create an account on Render.com or Railway.app
2. Connect your GitHub repository
3. Set environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A strong secret key for JWT
4. Deploy the application

### Frontend Deployment (Vercel/Netlify)

1. Create an account on Vercel or Netlify
2. Connect your GitHub repository
3. Set environment variables if needed
4. Build command: `npm run build`
5. Output directory: `build`
6. Deploy the application

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user info

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Add a new student
- `PUT /api/students/:id` - Update a student
- `DELETE /api/students/:id` - Delete a student

### Attendance
- `GET /api/attendance` - Get all attendance records
- `GET /api/attendance/date/:date` - Get attendance for a specific date
- `GET /api/attendance/student/:studentId` - Get attendance for a specific student
- `POST /api/attendance` - Mark attendance for a date
- `PUT /api/attendance/:date` - Update attendance for a date

## Folder Structure

```
attendance-system/
├── models/
│   ├── User.js
│   ├── Student.js
│   └── Attendance.js
├── routes/
│   ├── auth.js
│   ├── students.js
│   └── attendance.js
├── middleware/
│   └── auth.js
├── .env
├── .gitignore
├── package.json
├── server.js
└── README.md
```

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `PORT`: Port number for the server (default: 5000)

## Database Schema

### User Model
- `_id`: ObjectId
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required)
- `role`: String (enum: 'admin', 'teacher', default: 'teacher')
- `timestamps`: true

### Student Model
- `_id`: ObjectId
- `name`: String (required)
- `email`: String (required, unique)
- `rollNumber`: String (required, unique)
- `className`: String (required)
- `timestamps`: true

### Attendance Model
- `_id`: ObjectId
- `date`: Date (required, unique)
- `records`: Array of objects containing:
  - `studentId`: ObjectId (ref: 'Student', required)
  - `status`: String (enum: 'present', 'absent', required)
  - `note`: String (default: '')
- `timestamps`: true

## Usage

1. Register as an admin or teacher
2. Add students to the system
3. Mark attendance for students on a daily basis
4. View attendance records and statistics
5. Calculate attendance percentages for individual students

## Security Features

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Protected routes using middleware
- Input validation

## Contributing

Feel free to submit issues and enhancement requests!