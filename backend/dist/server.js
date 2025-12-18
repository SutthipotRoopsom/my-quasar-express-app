"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const task_routes_1 = __importDefault(require("./routes/task.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            ...helmet_1.default.contentSecurityPolicy.getDefaultDirectives(), // ดึงค่า default ปลอดภัยอื่นๆ มาด้วย
            "script-src": [
                "'self'",
                "'sha256-ieoeWczDHkReVBsRBqaal5AFMlBtNjMzgwKvLqi/tSU='" // ใส่ Hash ตรงนี้
            ],
            "connect-src": ["'self'", "*"], // อนุญาตให้เชื่อมต่อ API ได้ยืดหยุ่นขึ้น
        },
    },
}));
// ---------------------------------------------------------
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
// logs dir (ต่อยอดจาก Lab 1.2)
const logsDir = path_1.default.join(__dirname, '../logs');
if (!fs_1.default.existsSync(logsDir)) {
    fs_1.default.mkdirSync(logsDir, { recursive: true });
}
// (optional) endpoint เดิมจาก Lab 1.2 ถ้าอยากเก็บไว้ demo logging
app.get('/api/demo', (req, res) => {
    const logMessage = `Request at ${new Date().toISOString()}: ${req.ip}\n`;
    fs_1.default.appendFileSync(path_1.default.join(logsDir, 'access.log'), logMessage);
    res.json({
        git: {
            title: 'Advanced Git Workflow',
            detail: 'ใช้ branch protection บน GitHub, code review ใน PR, และ squash merge เพื่อ history สะอาด',
        },
        docker: {
            title: 'Advanced Docker',
            detail: 'ใช้ multi-stage build, healthcheck ใน Dockerfile, และ orchestration ด้วย Compose/Swarm',
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
app.use('/api/tasks', task_routes_1.default);
// 404 handler — ห้ามใช้ '*' กับ Express เวอร์ชันใหม่
app.use((req, res) => {
    res.status(404).json({
        message: 'ไม่พบเส้นทาง',
        path: req.originalUrl,
    });
});
// Error handling
app.use((err, _req, res, _next) => {
    console.error('❌ Error:', err && err.stack ? err.stack : err);
    res.status(500).json({ error: 'Something broke!' });
});
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`📊 API available at http://localhost:${PORT}/api/demo`);
    console.log(`💚 Health check at http://localhost:${PORT}/health`);
});
