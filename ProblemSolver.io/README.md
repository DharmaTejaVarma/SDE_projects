# ProblemSolver.io

An interactive platform where users can learn, practice, visualize, and solve Data Structures and Algorithms (DSA) problems. Built with React.js, Node.js, Express.js, and MongoDB.

## 🚀 Features

### Core Features
- **User Authentication**: Secure JWT-based authentication with role-based access control
- **DSA Learning Modules**: Comprehensive theory, operations, and examples for:
  - Arrays
  - Stacks
  - Queues
  - Linked Lists
  - Trees
- **Problem Repository**: Categorized problems with Easy, Medium, and Hard difficulty levels
- **Online Code Editor**: Multi-language support (C, C++, Java, Python)
- **Visualization**: Interactive animations for DSA operations
- **Progress Tracking**: Track solved problems, topic-wise progress, and performance statistics
- **Admin Panel**: Manage problems and users

## 🛠️ Tech Stack

### Frontend
- React.js 18
- React Router DOM
- Axios
- CSS3 (Custom styling)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## 🔧 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd "ProblemSolver.io"
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dsa-platform
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=7d
NODE_ENV=development
```

Start MongoDB (if running locally):
```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
```

Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal:
```bash
cd frontend
npm install
npm start
```

The frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
ProblemSolver.io/
├── backend/
│   ├── models/          # MongoDB models
│   │   ├── User.js
│   │   ├── Problem.js
│   │   └── Submission.js
│   ├── routes/          # API routes
│   │   ├── auth.js
│   │   ├── problems.js
│   │   ├── submissions.js
│   │   ├── progress.js
│   │   └── admin.js
│   ├── middleware/     # Custom middleware
│   │   └── auth.js
│   ├── server.js        # Express server
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Problems
- `GET /api/problems` - Get all problems (with filters)
- `GET /api/problems/:id` - Get single problem
- `GET /api/problems/category/:category` - Get problems by category

### Submissions
- `POST /api/submissions` - Submit code (Protected)
- `GET /api/submissions` - Get user's submissions (Protected)
- `GET /api/submissions/:id` - Get single submission (Protected)

### Progress
- `GET /api/progress` - Get user's progress statistics (Protected)

### Admin
- `POST /api/admin/problems` - Create problem (Admin)
- `PUT /api/admin/problems/:id` - Update problem (Admin)
- `DELETE /api/admin/problems/:id` - Delete problem (Admin)
- `GET /api/admin/users` - Get all users (Admin)
- `PUT /api/admin/users/:id/role` - Update user role (Admin)

## 🎯 Usage

1. **Register/Login**: Create an account or login to access all features
2. **Learn**: Explore DSA concepts in the Learning Modules section
3. **Practice**: Browse and solve problems from the Problem Repository
4. **Visualize**: Use interactive visualizations to understand DSA operations
5. **Track Progress**: Monitor your progress in the Dashboard
6. **Admin**: Admins can manage problems and users from the Admin Panel

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected routes for authenticated users
- Role-based access control (User/Admin)
- Input validation and sanitization

## 📝 Notes

- Code execution is currently simulated. For production, integrate with a code execution service (e.g., Docker-based executor, Judge0 API)
- MongoDB connection string can be changed to MongoDB Atlas for cloud deployment
- JWT secret should be changed in production environment

## 🚧 Future Enhancements

- Real-time code execution integration
- More data structures (Graphs, Heaps, etc.)
- Discussion forum for problems
- User profiles and leaderboards
- Code sharing and collaboration
- Mobile app version

## 📄 License

This project is open source and available under the MIT License.

## 👥 Contributors

Built as a comprehensive DSA learning platform for engineering students and interview aspirants.

