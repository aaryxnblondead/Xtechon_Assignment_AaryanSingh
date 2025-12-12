# Use Node.js LTS
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./

RUN npm ci || npm install

COPY tsconfig.json ./
COPY src ./src

ENV NODE_ENV=production

RUN npm run build

EXPOSE 5000
CMD ["node", "dist/server.js"]
