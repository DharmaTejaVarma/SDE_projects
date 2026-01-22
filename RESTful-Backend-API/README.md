# RESTful Backend API

A production-ready RESTful Backend API built with Node.js, Express, and MongoDB. Features JWT authentication, role-based authorization, comprehensive validation, error handling, logging, and full CRUD operations.

## Features

- **RESTful Design**: Clean, noun-based endpoints with proper HTTP methods
- **Authentication**: JWT-based login and signup with bcrypt password hashing
- **Authorization**: Role-based access control (USER, ADMIN)
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Request body, parameters, and query string validation with Joi
- **Error Handling**: Centralized error handling with appropriate HTTP status codes
- **Security**: Input sanitization, CORS, rate limiting, JWT expiration
- **Logging**: Structured logging with Winston for requests, errors, and authentication failures
- **Testing**: Unit tests for services and API tests with Jest and Supertest
- **Documentation**: Swagger/OpenAPI documentation
- **Soft Delete**: Users can be soft deleted and restored
- **Pagination**: Built-in pagination for list endpoints

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Security**: bcrypt, Helmet, CORS, express-rate-limit
- **Logging**: Winston
- **Testing**: Jest, Supertest
- **Documentation**: Swagger/OpenAPI
- **Environment**: dotenv

## Project Structure

```
src/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   └── userController.js    # User CRUD operations
├── middleware/
│   ├── authMiddleware.js    # JWT authentication & authorization
│   ├── errorMiddleware.js   # Centralized error handling
│   └── validationMiddleware.js # Request validation
├── models/
│   └── User.js              # User model with Mongoose
├── routes/
│   ├── authRoutes.js        # Auth endpoints (login, register)
│   └── userRoutes.js        # User CRUD endpoints
├── utils/
│   └── logger.js            # Winston logger configuration
└── server.js                # Main application entry point

tests/
├── auth.test.js             # Authentication tests
└── user.test.js             # User CRUD tests
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd restful-backend-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up MongoDB:
   - **Local MongoDB**: Install MongoDB Community Server and start the service
   - **MongoDB Atlas**: Create a cluster and get the connection string

4. Create environment file:
   ```bash
   cp .env.example .env
   ```

5. Configure environment variables in `.env`:
   ```env
   NODE_ENV=development
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/restful-api
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=30d
   BCRYPT_ROUNDS=12
   ```

6. Start the application:
   ```bash
   # Development mode with auto-restart
   npm run dev

   # Production mode
   npm start
   ```

The API will be available at `http://localhost:3000`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/restful-api` |
| `JWT_SECRET` | JWT signing secret | (required) |
| `JWT_EXPIRE` | JWT expiration time | `30d` |
| `BCRYPT_ROUNDS` | bcrypt salt rounds | `12` |

## API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/v1/auth/register` | Register new user | Public |
| POST | `/api/v1/auth/login` | User login | Public |

### Users

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/v1/users` | Get all users | Admin |
| GET | `/api/v1/users/:id` | Get user by ID | User (own) / Admin |
| POST | `/api/v1/users` | Create new user | Admin |
| PUT | `/api/v1/users/:id` | Update user | User (own) / Admin |
| DELETE | `/api/v1/users/:id` | Delete user (soft) | Admin |

## API Documentation

API documentation is available via Swagger UI at:
```
http://localhost:3000/api-docs
```

## Sample Requests

### Register User
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

### Get Users (Admin only)
```bash
GET /api/v1/users?page=1&limit=10
Authorization: Bearer jwt_token_here
```

### Update User
```bash
PUT /api/v1/users/user_id
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "name": "John Smith"
}
```

## Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

## Deployment

### Environment Setup

1. Set environment variables in your deployment platform
2. Ensure MongoDB is accessible
3. Set `NODE_ENV=production`

### Platforms

This API is deployment-ready for platforms like:
- **Render**: Set build command to `npm install` and start command to `npm start`
- **Railway**: Automatic deployment from GitHub
- **Heroku**: Use the `heroku/nodejs` buildpack
- **AWS EC2**: Manual server setup
- **Docker**: Containerize the application

### Docker (Optional)

Build and run with Docker:
```bash
# Build the image
docker build -t restful-api .

# Run the container
docker run -p 3000:3000 --env-file .env restful-api
```

### Health Check

The application includes a health check endpoint for container orchestration.

## Deployment

### Environment Setup

1. Set environment variables in your deployment platform
2. Ensure MongoDB is accessible
3. Set `NODE_ENV=production`

### Platforms

This API is deployment-ready for platforms like:
- **Render**: Set build command to `npm install` and start command to `npm start`
- **Railway**: Automatic deployment from GitHub
- **Heroku**: Use the `heroku/nodejs` buildpack
- **AWS EC2**: Manual server setup
- **Docker**: Use the provided Dockerfile

## Security Best Practices

- **Password Hashing**: bcrypt with configurable rounds
- **JWT Tokens**: Secure signing with expiration
- **Rate Limiting**: Prevents brute force attacks
- **CORS**: Configured for cross-origin requests
- **Helmet**: Security headers
- **Input Validation**: Comprehensive validation with Joi
- **Error Handling**: No sensitive information exposed
- **Logging**: All security events logged

## Error Handling

The API uses consistent error response format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"] // for validation errors
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the ISC License.