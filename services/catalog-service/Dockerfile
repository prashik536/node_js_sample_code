FROM node:22-alpine

ENV NODE_ENV=production
ENV CATALOG_SERVICE_PORT=3000

WORKDIR /app

COPY services/catalog-service/package.json services/catalog-service/package-lock.json ./
RUN npm ci --omit=dev

COPY services/catalog-service/index.js ./index.js

EXPOSE 3000
CMD ["node", "index.js"]