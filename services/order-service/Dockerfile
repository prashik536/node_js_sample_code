FROM node:22-alpine

ENV NODE_ENV=production
ENV ORDER_SERVICE_PORT=3000

WORKDIR /app

COPY services/order-service/package.json services/order-service/package-lock.json ./
RUN npm ci --omit=dev

COPY services/order-service/index.js ./index.js

EXPOSE 3000
CMD ["node", "index.js"]