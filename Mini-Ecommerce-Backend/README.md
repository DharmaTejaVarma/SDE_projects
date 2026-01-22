# Mini E-commerce Backend API

A clean, production-ready Mini E-commerce Backend API built with Node.js, Express, and MongoDB. Features JWT authentication, role-based authorization, and comprehensive REST API endpoints.

## Features

- **Authentication & Authorization**: JWT-based auth with user registration/login, password hashing with bcrypt, and role-based access control (USER/ADMIN)
- **Product Management**: CRUD operations for products with pagination, filtering, and soft delete
- **Cart System**: User-specific carts with add/update/remove items functionality
- **Order Management**: Convert cart to order with status tracking
- **Payment Processing**: Mocked payment system with success/failure simulation
- **Security**: Helmet, CORS, rate limiting, input validation, and sanitization
- **Logging**: Structured logging with Winston for requests, errors, orders, and payments
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Validation**: Request validation using Joi
- **Database**: MongoDB with Mongoose ODM, soft deletes, timestamps, and indexes

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Security**: Helmet, CORS, Express Rate Limit
- **Logging**: Winston
- **Testing**: Jest, Supertest
- **Containerization**: Docker

## Project Structure

```
src/
├── config/          # Database and logger configuration
├── controllers/     # Route controllers
├── middlewares/     # Custom middlewares (auth, validation, error handling)
├── models/          # MongoDB models
├── routes/          # API routes
├── utils/           # Utility functions
├── validators/      # Request validation schemas
└── tests/           # Unit and API tests
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mini-ecommerce-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mini-ecommerce
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
LOG_LEVEL=info
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=http://localhost:3000
```

5. Start MongoDB service (if running locally)

6. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

### Docker Setup

1. Build the Docker image:
```bash
docker build -t mini-ecommerce-backend .
```

2. Run the container:
```bash
docker run -p 5000:5000 --env-file .env mini-ecommerce-backend
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/profile` - Get user profile (protected)

### Products
- `GET /api/v1/products` - Get all products (with pagination/filtering)
- `GET /api/v1/products/:id` - Get single product
- `POST /api/v1/products` - Create product (ADMIN only)
- `PUT /api/v1/products/:id` - Update product (ADMIN only)
- `DELETE /api/v1/products/:id` - Delete product (ADMIN only)

### Cart
- `GET /api/v1/cart` - Get user cart
- `POST /api/v1/cart/items` - Add item to cart
- `PUT /api/v1/cart/items/:itemId` - Update cart item
- `DELETE /api/v1/cart/items/:itemId` - Remove item from cart
- `DELETE /api/v1/cart` - Clear cart

### Orders
- `GET /api/v1/orders` - Get user orders
- `GET /api/v1/orders/:id` - Get single order
- `POST /api/v1/orders` - Create order from cart
- `PUT /api/v1/orders/:id/status` - Update order status (ADMIN only)

### Payments
- `GET /api/v1/payments` - Get user payments
- `GET /api/v1/payments/:id` - Get single payment
- `POST /api/v1/payments/orders/:orderId` - Process payment for order

## Sample API Requests

### Register User
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Products
```bash
curl -X GET "http://localhost:5000/api/v1/products?page=1&limit=10&search=laptop"
```

### Create Product (Admin)
```bash
curl -X POST http://localhost:5000/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 999.99,
    "category": "Electronics",
    "stock": 50
  }'
```

### Add to Cart
```bash
curl -X POST http://localhost:5000/api/v1/cart/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "productId": "PRODUCT_ID",
    "quantity": 2
  }'
```

### Create Order
```bash
curl -X POST http://localhost:5000/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "shippingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    }
  }'
```

### Process Payment
```bash
curl -X POST http://localhost:5000/api/v1/payments/orders/ORDER_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "paymentMethod": "CREDIT_CARD"
  }'
```

## Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/mini-ecommerce` |
| `JWT_SECRET` | JWT secret key | - |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `LOG_LEVEL` | Logging level | `info` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | `900000` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |
| `CORS_ORIGIN` | CORS allowed origin | `http://localhost:3000` |

## Security Features

- **Password Hashing**: bcrypt for secure password storage
- **JWT Authentication**: Stateless authentication with expiration
- **Role-based Access**: USER and ADMIN roles with proper authorization
- **Rate Limiting**: Prevents abuse with configurable limits
- **Input Validation**: Joi schemas for request validation
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers for common vulnerabilities
- **Error Handling**: Prevents information leakage in production

## Logging

The application uses Winston for structured logging:
- **Request Logs**: All API requests with IP and user agent
- **Error Logs**: Application errors with stack traces
- **Order/Payment Logs**: Business logic events

Logs are stored in the `logs/` directory:
- `error.log`: Error-level logs
- `combined.log`: All logs

## Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Configure production MongoDB URI
- [ ] Set appropriate CORS origin
- [ ] Enable HTTPS
- [ ] Set up monitoring and alerts
- [ ] Configure log aggregation
- [ ] Set up database backups

### Docker Deployment

```bash
# Build image
docker build -t mini-ecommerce-backend .

# Run container
docker run -d \
  --name ecommerce-backend \
  -p 5000:5000 \
  --env-file .env \
  --restart unless-stopped \
  mini-ecommerce-backend
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.