const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server');
const User = require('../src/models/User');

describe('User Endpoints', () => {
  let adminToken;
  let userToken;
  let adminUser;
  let regularUser;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test-db');
  });

  afterAll(async () => {
    // Clean up and close connection
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear users before each test
    await User.deleteMany({});

    // Create admin user
    adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'ADMIN',
    });

    // Create regular user
    regularUser = await User.create({
      name: 'Regular User',
      email: 'user@example.com',
      password: 'password123',
      role: 'USER',
    });

    // Get tokens
    const adminLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@example.com', password: 'password123' });

    adminToken = adminLogin.body.data.token;

    const userLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'user@example.com', password: 'password123' });

    userToken = userLogin.body.data.token;
  });

  describe('GET /api/v1/users', () => {
    it('should get all users as admin', async () => {
      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });

    it('should not allow regular user to get all users', async () => {
      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.message).toContain('not authorized');
    });
  });

  describe('GET /api/v1/users/:id', () => {
    it('should get user by id as admin', async () => {
      const response = await request(app)
        .get(`/api/v1/users/${regularUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(regularUser.email);
    });

    it('should get own profile as regular user', async () => {
      const response = await request(app)
        .get(`/api/v1/users/${regularUser._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(regularUser.email);
    });

    it('should not allow user to get other user profile', async () => {
      const response = await request(app)
        .get(`/api/v1/users/${adminUser._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.message).toContain('not authorized');
    });
  });

  describe('PUT /api/v1/users/:id', () => {
    it('should update user as admin', async () => {
      const updateData = { name: 'Updated Name' };

      const response = await request(app)
        .put(`/api/v1/users/${regularUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
    });

    it('should update own profile as regular user', async () => {
      const updateData = { name: 'Updated Name' };

      const response = await request(app)
        .put(`/api/v1/users/${regularUser._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
    });
  });

  describe('DELETE /api/v1/users/:id', () => {
    it('should soft delete user as admin', async () => {
      const response = await request(app)
        .delete(`/api/v1/users/${regularUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Check if user is marked as deleted
      const deletedUser = await User.findById(regularUser._id);
      expect(deletedUser.isDeleted).toBe(true);
    });

    it('should not allow regular user to delete users', async () => {
      const response = await request(app)
        .delete(`/api/v1/users/${adminUser._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.message).toContain('not authorized');
    });
  });
});