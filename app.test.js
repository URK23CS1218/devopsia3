const request = require('supertest');
const app = require('./app');

describe('DevSecOps Web Application', () => {

  describe('GET /', () => {
    it('should return application info', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.body.application).toBe('DevSecOps Demo App');
      expect(res.body.status).toBe('running');
      expect(res.body.endpoints).toBeDefined();
    });
  });

  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body.timestamp).toBeDefined();
      expect(res.body.uptime).toBeDefined();
    });
  });

  describe('GET /api/status', () => {
    it('should return API operational status', async () => {
      const res = await request(app).get('/api/status');
      expect(res.statusCode).toBe(200);
      expect(res.body.api).toBe('operational');
      expect(res.body.version).toBe('1.0.0');
    });
  });

  describe('GET /api/data', () => {
    it('should return 401 without authorization', async () => {
      const res = await request(app).get('/api/data');
      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe('Unauthorized — invalid API key');
    });

    it('should return 401 with wrong API key', async () => {
      const res = await request(app)
        .get('/api/data')
        .set('Authorization', 'Bearer wrong-key');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /unknown-route', () => {
    it('should return 404 for unknown routes', async () => {
      const res = await request(app).get('/does-not-exist');
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Not Found');
    });
  });

});
