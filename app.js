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

// Home page serving a nice HTML dashboard
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>DevSecOps Demo Application</title>
      <style>
        :root {
          --primary-color: #2563eb;
          --bg-color: #f8fafc;
          --card-bg: #ffffff;
          --text-main: #1e293b;
        }
        body {
          font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: var(--bg-color);
          color: var(--text-main);
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }
        .container {
          background-color: var(--card-bg);
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          padding: 40px;
          max-width: 600px;
          width: 90%;
          text-align: center;
        }
        h1 {
          color: var(--primary-color);
          margin-bottom: 10px;
          font-size: 2.2rem;
        }
        p {
          color: #64748b;
          font-size: 1.1rem;
          line-height: 1.5;
          margin-bottom: 30px;
        }
        .status-badge {
          display: inline-block;
          background-color: #dcfce7;
          color: #166534;
          padding: 6px 12px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 0.9rem;
          margin-bottom: 20px;
        }
        .endpoints {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-top: 30px;
        }
        .btn {
          background-color: var(--primary-color);
          color: white;
          text-decoration: none;
          padding: 12px 20px;
          border-radius: 6px;
          font-weight: 500;
          transition: background-color 0.2s;
        }
        .btn:hover {
          background-color: #1d4ed8;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="status-badge">🟢 Pipeline Status: Running</div>
        <h1>DevSecOps Demo App</h1>
        <p>Welcome to the live DevSecOps pipeline demo application. Hosted entirely through Jenkins and Kubernetes!</p>
        
        <div class="endpoints">
          <a href="/health" class="btn">View App Health (/health)</a>
          <a href="/api/status" class="btn">View API Status (/api/status)</a>
        </div>
      </div>
    </body>
    </html>
  `);
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
