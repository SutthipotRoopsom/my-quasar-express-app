const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Serve static files (สำหรับ favicon)
app.use(express.static(path.join(__dirname, '../public')));

// Content-Security-Policy (ปรับให้เหมาะสมและปลอดภัย)
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
    "script-src 'self' 'sha256-ieoeWczDHkReVBsRBqaal5AFMlBtNjMzgwKvLqi/tSU='; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' data:; " +
    "connect-src 'self' https:; " +
    "object-src 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self';"
  );
  next();
});

// สร้างโฟลเดอร์ logs
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Demo
app.get('/api/demo', (req, res) => {
  console.log('📡 API /api/demo called');

  const logMessage = `Request at ${new Date().toISOString()}: ${req.ip || req.socket.remoteAddress}\n`;
  fs.appendFileSync(path.join(logsDir, 'access.log'), logMessage);

  const responseData = {
    student: {
      firstName: 'สุทธิพจน์',
      lastName: 'รูปโสม',
      studentId: '6604101391',
      fullName: 'นาย สุทธิพจน์ รูปโสม'
    },
    git: {
      title: 'Advanced Git Workflow',
      detail: 'ใช้ branch protection บน GitHub, code review ใน PR, และ squash merge เพื่อ history สะอาด'
    },
    docker: {
      title: 'Advanced Docker',
      detail: 'ใช้ multi-stage build, healthcheck ใน Dockerfile, และ orchestration ด้วย Compose/Swarm'
    }
  };

  res.json(responseData);
});

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    message: 'API พร้อมใช้งาน (Supabase + Prisma + Quasar Frontend)',
    timestamp: new Date().toISOString(),
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api/demo`);
  console.log(`💚 Health check at http://localhost:${PORT}/health`);
});