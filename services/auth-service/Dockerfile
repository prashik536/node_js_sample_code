FROM node:22-alpine

ENV NODE_ENV=production
ENV AUTH_SERVICE_PORT=3000

WORKDIR /app

COPY services/auth-service/package.json services/auth-service/package-lock.json ./
RUN npm ci --omit=dev

COPY services/auth-service/index.js ./index.js

EXPOSE 3000
CMD ["node", "index.js"]