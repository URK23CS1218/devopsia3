const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================
// SECURITY ISSUE: Hardcoded API key (SonarQube will flag this)
// In production, this should be stored in environment variables
// or a secrets manager like Kubernetes Secrets
// ============================================================
const API_KEY = "sk-proj-R4nd0mH4rdc0d3dK3y123456789ABCDEF";  // sonar:S6418 - hardcoded credential

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// ============================================================
// Routes
// ============================================================

// Home page
app.get('/', (req, res) => {
  res.json({
    application: 'DevSecOps Demo App',
    version: '1.0.0',
    status: 'running',
    message: 'Welcome to the DevSecOps Pipeline Demo Application',
    endpoints: {
      health: '/health',
      api_status: '/api/status',
      api_data: '/api/data'
    }
  });
});

// Health check endpoint (used by Kubernetes liveness/readiness probes)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    api: 'operational',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    authenticated: false
  });
});

// API data endpoint — uses the hardcoded API key (vulnerability demo)
app.get('/api/data', (req, res) => {
  const authHeader = req.headers['authorization'];

  // SECURITY ISSUE: comparing against hardcoded credential
  if (authHeader === `Bearer ${API_KEY}`) {
    res.json({
      data: [
        { id: 1, name: 'Secure Deployment', status: 'active' },
        { id: 2, name: 'Pipeline Monitoring', status: 'active' },
        { id: 3, name: 'Vulnerability Scanning', status: 'active' }
      ]
    });
  } else {
    res.status(401).json({ error: 'Unauthorized — invalid API key' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server (only when run directly, not when imported for testing)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`DevSecOps app running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
  });
}

module.exports = app;
