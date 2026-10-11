FROM node:22-alpine

ENV NODE_ENV=production
ENV DELIVERY_SERVICE_PORT=3000

WORKDIR /app

COPY services/delivery-service/package.json services/delivery-service/package-lock.json ./
RUN npm ci --omit=dev

COPY services/delivery-service/index.js ./index.js

EXPOSE 3000
CMD ["node", "index.js"]