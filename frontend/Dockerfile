# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# ✅ รับ API URL จาก docker-compose args
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Copy package files
COPY package*.json ./

# ✅ Copy source code ก่อน npm install (เพื่อให้ quasar prepare ทำงานได้)
COPY . .

# Install dependencies (ตอนนี้ quasar prepare จะทำงานได้แล้ว)
RUN npm install

# Build (VITE_API_URL จะถูก embed เข้าไป)
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist/spa /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]