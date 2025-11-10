FROM node:20-alpine AS builder
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY package*.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
RUN pnpm install
COPY . .
RUN pnpm exec ng build --configuration production

FROM nginx:alpine
COPY --from=builder /app/dist/fletnix-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
