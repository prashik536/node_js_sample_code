FROM node:22-alpine AS build

ARG VITE_API_URL=/api

WORKDIR /app

COPY apps/customer-ui/package.json apps/customer-ui/package-lock.json ./
RUN npm ci

COPY apps/customer-ui/ ./
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

FROM nginx:alpine
COPY apps/customer-ui/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 3000