FROM node:22-alpine

ENV NODE_ENV=production
ENV NOTIFICATION_SERVICE_PORT=3000

WORKDIR /app

COPY services/notification-service/package.json services/notification-service/package-lock.json ./
RUN npm ci --omit=dev

COPY services/notification-service/index.js ./index.js

EXPOSE 3000
CMD ["node", "index.js"]