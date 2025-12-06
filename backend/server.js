const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware - แก้ CORS ให้รองรับทุก origin
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// สร้างโฟลเดอร์ logs ถ้ายังไม่มี
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Health check endpoint (สำหรับ Docker healthcheck)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Endpoint demo: Return Git + Docker info + Student Info
app.get('/api/demo', (req, res) => {
  console.log('📡 API /api/demo called');
  
  const logMessage = `Request at ${new Date().toISOString()}: ${req.ip}\n`;
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
  
  console.log('✅ Sending response:', responseData);
  res.json(responseData);
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