# CorpLang web — Vite static build served by nginx.
#
#   docker build --build-arg VITE_API_URL=https://api.example.com -t corplang-frontend .
#
# VITE_API_URL is inlined at build time (Vite), so it must be supplied here.

# 1. Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# 2. Serve
FROM nginx:1.27-alpine AS runner
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
