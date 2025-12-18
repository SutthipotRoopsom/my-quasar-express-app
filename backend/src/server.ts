// src/server.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

import taskRoutes from './routes/task.routes';

dotenv.config();

const app = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(), // ดึงค่า default ปลอดภัยอื่นๆ มาด้วย
        "script-src": [
          "'self'", 
          "'sha256-ieoeWczDHkReVBsRBqaal5AFMlBtNjMzgwKvLqi/tSU='" // ใส่ Hash ตรงนี้
        ],
        "connect-src": ["'self'", "*"], // อนุญาตให้เชื่อมต่อ API ได้ยืดหยุ่นขึ้น
      },
    },
  })
);
// ---------------------------------------------------------

app.use(morgan('dev'));
app.use(express.json());

// logs dir (ต่อยอดจาก Lab 1.2)
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// (optional) endpoint เดิมจาก Lab 1.2 ถ้าอยากเก็บไว้ demo logging
app.get('/api/demo', (req, res) => {
  const logMessage = `Request at ${new Date().toISOString()}: ${req.ip}\n`;
  fs.appendFileSync(path.join(logsDir, 'access.log'), logMessage);

  res.json({
    git: {
      title: 'Advanced Git Workflow',
      detail:
        'ใช้ branch protection บน GitHub, code review ใน PR, และ squash merge เพื่อ history สะอาด',
    },
    docker: {
      title: 'Advanced Docker',
      detail:
        'ใช้ multi-stage build, healthcheck ใน Dockerfile, และ orchestration ด้วย Compose/Swarm',
    },
  });
});

// Health check root
app.get('/', (_req, res) => {
  res.json({
    message: 'API พร้อมใช้งาน (Supabase + Prisma + Quasar Frontend)',
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint (สำหรับ Docker healthcheck)
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Task API (Lab 2.1)
app.use('/api/tasks', taskRoutes);

// 404 handler — ห้ามใช้ '*' กับ Express เวอร์ชันใหม่
app.use((req, res) => {
  res.status(404).json({
    message: 'ไม่พบเส้นทาง',
    path: req.originalUrl,
  });
});

// Error handling
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('❌ Error:', err && err.stack ? err.stack : err);
  res.status(500).json({ error: 'Something broke!' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api/demo`);
  console.log(`💚 Health check at http://localhost:${PORT}/health`);
});
