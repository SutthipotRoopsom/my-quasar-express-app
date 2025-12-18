# Backend Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

#set dummy environment variable to avoid prompts during package installation
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV DIRECT_URL="postgresql://dummy:dummy@localhost:5432/dummy"

#Copy package files
COPY package*.json ./

# Install all dependencies including dev dependencies
RUN npm ci --legacy-peer-deps

#Copy Prisma schema and generate client
COPY prisma ./prisma
COPY prisma.config.ts ./

#Copy typescript configuration
COPY tsconfig.json ./

#Generate Prisma client
RUN npx prisma generate

#Copy source code
COPY src ./src

# Build the TypeScript code
RUN npm run build

#stage 2: Production image
FROM node:20-alpine 

WORKDIR /app

#Copy environment variables
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma.config.ts ./

#create logs directory
RUN mkdir -p logs

#heathcheck setup
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

#Expose application port
EXPOSE 3000

#Start the application
CMD ["node", "dist/server.js"]
